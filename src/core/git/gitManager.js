import { run as runCli } from "../skills/cliExecutor.js";

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50);
}

export async function createBranch(branchName) {
  console.log(`Creating branch: ${branchName}`);
  return runCli(`git checkout -b ${branchName}`);
}

export async function checkoutBranch(branchName) {
  console.log(`Checking out branch: ${branchName}`);
  return runCli(`git checkout ${branchName}`);
}

export async function stageAll() {
  console.log("Staging all changes...");
  return runCli("git add .");
}

export async function commit(message) {
  console.log("Committing...");
  return runCli(`git commit -m "${message.replace(/"/g, "'")}"`);
}

export async function push(branchName) {
  console.log(`Pushing branch: ${branchName}`);
  return runCli(`git push -u origin ${branchName}`);
}

export async function getCurrentBranch() {
  const result = await runCli("git rev-parse --abbrev-ref HEAD");
  return result.output?.trim();
}
