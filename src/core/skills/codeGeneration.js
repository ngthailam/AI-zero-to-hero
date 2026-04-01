import { run as runOpenAi, parseJson } from "../tools/openAi.js";
import fs from "fs";
import path from "path";

export async function run(task) {
  console.log("Running code generation skill...");
  const prompt = `
    You are a senior Javascript software engineer.

    Write code in javascript for the following task. This is a javascript module so remember to export the function.

    Task: ${task}

    The workflow should be as follows:

    1. Create a new git branch
    2. Write code for the task.
    3. Write tests for the code you just wrote.
    4. Run the tests and make sure they pass.
    5. If tests fail, fix the code until tests pass. (max try 2 times)
    6. Commit the code and push the branch to remote.
    7. Create a PR to merge the branch to main.
    8. Check the PR review comments and if there are any requested changes, make the changes and update the PR.

    Output: A JSON in the following format:
    {
      "files": [
        {
          "path": "path to save the file, relative to project root, under generated/src/, e.g. generated/src/calculator.js",
          "content": "the generated code as a string"
        }
      ]
    }

    No additional explanation. Do not wrap the response or code in any markdown or code block. Just return the raw JSON.
  `;

  const res = await runOpenAi(prompt);
  const jsonRes = parseJson(res);

  console.log("Code generation skill raw response:", jsonRes);

  for (const file of jsonRes.files) {
    fs.mkdirSync(path.dirname(file.path), { recursive: true });
    fs.writeFileSync(file.path, file.content);
  }

  return jsonRes;
}
