import { run as runCli } from "./cliExecutor.js";

export async function run() {
  console.log("Running tests...");
  const npmTestResult = await runCli("npm test");
  return npmTestResult;
}
