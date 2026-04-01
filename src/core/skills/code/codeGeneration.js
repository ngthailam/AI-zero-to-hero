import { run as runOpenAi, parseJson } from "../../tools/openAi.js";
import fs from "fs";
import path from "path";

export async function run(task) {
  console.log("Running code generation skill...");
  const prompt = `
    You are a senior Javascript software engineer.

    Write code in javascript for the following task. This is a javascript module so remember to export the function.

    Task: ${task}
    
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
