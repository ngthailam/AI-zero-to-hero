import { run as runOpenAi, parseJson } from "../../tools/openAi.js";
import fs from "fs";
import path from "path";

export async function run(task, input) {
  console.log("Running fix code skill..., Task:", task, "Input:", input);
  const prompt = `
    You are a senior Javascript software engineer.

    Here is the input containing the code files and the test results:
    Input: ${JSON.stringify(input)}

    Task: ${task}

    Fix the source code files so the tests pass. Only modify source files, not test files.

    Output: A JSON in the following format:
    {
      "files": [
        {
          "path": "the original file path",
          "content": "the fixed code as a string"
        }
      ]
    }

    No explanation. Just return the raw JSON.
  `;

  const res = await runOpenAi(prompt);
  const jsonRes = parseJson(res);

  console.log("Fix code skill raw response:", jsonRes);

  for (const file of jsonRes.files) {
    fs.mkdirSync(path.dirname(file.path), { recursive: true });
    fs.writeFileSync(file.path, file.content);
  }

  return jsonRes;
}
