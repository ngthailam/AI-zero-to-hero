import { exec } from "child_process";
import fs from "fs";
import { getOpenAIClient } from "../task_generator/ai/client.js";

export async function runTests(codeBlock) {
  const prompt = `
  You are a senior software engineer.

  Write test for the following code. The tests should be in Jest format.

  Import like this: import { reverseString } from '../generated.js';
  The function name is in the codeBlock. keep the from statement the same

  Task: ${codeBlock}

  Return ONLY code. No explanation. Do not wrap the code in any markdown or code block. Just return the raw code.
`;

  const res = await getOpenAIClient().chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

    fs.writeFileSync("__tests__/generated.js", res.choices[0].message.content);

  return new Promise((resolve) => {
    exec("npm test", (error, stdout, stderr) => {
      if (error) {
        console.error(`Test execution error: ${error}`);
        return resolve({
          success: false,
          output: stderr || stdout,
        });
      }
      
      console.log(`Test execution output: ${stdout}`);
      resolve({
        success: true,
        output: stdout,
      });
    });
  });
}
