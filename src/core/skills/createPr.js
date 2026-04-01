import { run as runOpenAi, parseJson } from "../tools/openAi.js";
import { run as runCli } from "./cliExecutor.js";

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

  const result = await runCli(
    `gh pr create --title "${title.replace(/"/g, "'")}" --body "${body.replace(/"/g, "'")}" --base main --head ${branchName}`
  );

  console.log("Create PR result:", result);

  const prUrl = result.output?.trim();
  return { title, body, prUrl };
}
