import { run as runOpenAi, parseJson } from "../../tools/openAi.js";
import fs from "fs";
import path from "path";

export async function run(task, input) {
  console.log("Running write test skill..., Task:", task, "Input:", input);
  const prompt = `
    You are a senior Javascript software engineer.

    Here are the generated code files:
    Input: ${JSON.stringify(input)}

    Task: ${task}

    Write Jest tests for the code files above. Import tested functions correctly.
    For example, if a file path is generated/src/calculator.js, the import in the test should be: import { functionName } from '../src/calculator.js';

    Output: A JSON in the following format:
    {
      "files": [
        {
          "path": "path to save the test file, must be under generated/__tests__/, e.g. generated/__tests__/calculator.test.js",
          "content": "the generated test code as a string, no markdown formatting"
        }
      ]
    }

    No explanation. Just return the raw JSON.
  `;

  const res = await runOpenAi(prompt);
  const jsonRes = parseJson(res);

  console.log("Write test skill raw response:", jsonRes);

  for (const file of jsonRes.files) {
    fs.mkdirSync(path.dirname(file.path), { recursive: true });
    fs.writeFileSync(file.path, file.content);
  }

  return jsonRes;
}
