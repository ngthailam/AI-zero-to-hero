import { run as runOpenAi, parseJson } from "../tools/openAi.js";
import { stageAll, commit, push } from "../git/gitManager.js";

export async function run(task, input) {
  console.log("Running git commit skill...");

  const { files, branchName } = input;

  const prompt = `
    You are a senior software engineer writing a git commit message.

    The following files were generated or modified:
    ${JSON.stringify(files?.map((f) => f.path) ?? [])}

    Task that was completed: ${task}

    Write a concise, conventional-style commit message (e.g. "feat: add calculator with add and subtract").

    Output: A JSON object in the following format:
    {
      "message": "the commit message"
    }

    No explanation. Just return the raw JSON.
  `;

  const res = await runOpenAi(prompt);
  const { message } = parseJson(res);

  console.log("AI commit message:", message);

  await stageAll();
  await commit(message);

  if (branchName) {
    await push(branchName);
  }

  return { message };
}
