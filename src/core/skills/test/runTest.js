import { run as runCli } from "../misc/cliExecutor.js";

export async function run() {
  console.log("Running tests...");
  const npmTestResult = await runCli("npm test");

  if (npmTestResult.success) {
    console.log("Tests passed successfully.");
  } else {
    console.error("Test failed");
  }

  return npmTestResult;
}
