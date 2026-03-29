import { run as runOpenAi } from "../tools/openAi.js";
import { run as runCli } from "./cliExecutor.js";
import fs from "fs";

export async function run(task, input) {
  console.log("Running test generation skill..., Task:", task, "Input:", input);
  // 1. Create prompt to OpenAI to generate the test code
  const prompt = `
        You are a senior Javascript software engineer.

        Here is the input, containing the code and the filePath
        Input: ${input} 

        Task: ${task}

        Write test for the code inside the input. The tests should be in Jest format. Import the tested function correctly. For example, if the input filePath is generated/src/sum.js, the import statement in the test code should be: import { functionName } from '../src/sum.js';

        Output: A Json in the following format:
        {
            "filePath": "the file path to save the generated test code, must be in generated/__tests__/, the remaining filePath use the filePath from input, excluding the src/",
            "code": "the generated test code as a string. This should be the raw code without any markdown or code block formatting."
        }

        No explanation
    `;

  const res = await runOpenAi(prompt);
  const jsonRes = JSON.parse(res);

  console.log("Test generation skill raw response:", jsonRes);

  // 2. Save the generated test code to a file in the __tests__ directory
  const { filePath, code } = jsonRes;
  fs.writeFile(filePath, code, (err) => {
    if (err) {
      console.error("Error saving test file:", err);
    }
  });

  // 3. Run the tests using a exec command and capture the output
  const npmTestResult = await runCli("npm test");

  // 4. Return the test results
  return npmTestResult;
}
