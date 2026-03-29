import { run as runOpenAi } from "../tools/openAi.js";
import fs from "fs";

export async function run(task) {
  console.log("Running code generation skill...");
  const prompt = `
    You are a senior Javascript software engineer.

    Write code in javascript for the following task. This is a javascript module so remember to export the function.

    Task: ${task}

    Output: A Json in the following format:
    {
        "filePath": "the path to save the file, relative to the project root, project root is generated/src/, e.g. generated/src/sum.js",
        "code": "the generated code as a string"
    }

    No additional explanation. Do not wrap the response or code in any markdown or code block. Just return the raw code.
  `;

  const res = await runOpenAi(prompt);
  const jsonRes = JSON.parse(res);

  console.log("Code generation skill raw response:", jsonRes);

  fs.writeFileSync(jsonRes.filePath, jsonRes.code);
  
  return jsonRes;
}
