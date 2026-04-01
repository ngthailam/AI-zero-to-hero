import { run as runOpenAi, parseJson } from "../tools/openAi.js";
import { run as runCli } from "./cliExecutor.js";
import fs from "fs";
import os from "os";
import path from "path";

export async function run(task, input) {
  console.log("Running create PR skill...");

  const { files, branchName, testResults } = input;

  const prompt = `
    You are a senior software engineer writing a GitHub pull request.

    Task completed: ${task}
    Files changed: ${JSON.stringify(files?.map((f) => f.path) ?? [])}
    Test results: ${testResults?.output ?? "N/A"}

    Write a short PR title and a markdown body summarizing what was done and why.

    Output: A JSON object in the following format:
    {
      "title": "short PR title",
      "body": "markdown PR body"
    }

    No explanation. Just return the raw JSON.
  `;

  const res = await runOpenAi(prompt);
  const { title, body } = parseJson(res);

  console.log("AI PR title:", title);

  // Write body to temp file to avoid shell escaping issues
  const bodyFile = path.join(os.tmpdir(), `pr-body-${Date.now()}.md`);
  fs.writeFileSync(bodyFile, body);

  const result = await runCli(
    `gh pr create --title "${title.replace(/"/g, "'")}" --body-file "${bodyFile}" --base main --head ${branchName}`
  );

  fs.unlinkSync(bodyFile);

  if (!result.success) {
    console.warn("PR creation failed (is 'gh' CLI installed and authenticated?):", result.output);
    return { title, body, prUrl: null };
  }

  const prUrl = result.output?.trim();
  console.log("PR created:", prUrl);
  return { title, body, prUrl };
}
