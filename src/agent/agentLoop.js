import fs from "fs";
import { generateCode } from "../features/code_generator/codeGenerator.js";
import { fixCode } from "../features/code_generator/fixGenerator.js";
import { runTests } from "../features/code_generator/runTest.js";

export async function runAgent(task) {
  let code = await generateCode(task);

  fs.writeFileSync("generated.js", code);

  for (let i = 0; i < 3; i++) {
    console.log(`Running tests, attempt ${i + 1}...`);
    const result = await runTests(code);

    if (result.success) {
      return {
        success: true,
        code,
        attempts: i + 1,
      };
    }

    code = await fixCode(code, result.output);
    fs.writeFileSync("generated.js", code);
  }

  return {
    success: false,
    code,
  };
}