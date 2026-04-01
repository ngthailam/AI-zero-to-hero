import { run as runCli } from "./cliExecutor.js";

export async function run(task, input) {
  console.log("Running check review skill...");

  const { prUrl } = input;

  if (!prUrl) {
    return { status: "no_pr", comments: [] };
  }

  // Get PR review status
  const statusResult = await runCli(`gh pr view "${prUrl}" --json state,reviewDecision,reviews`);

  if (!statusResult.success) {
    console.error("Failed to fetch PR review status:", statusResult.output);
    return { status: "error", comments: [] };
  }

  let prData;
  try {
    prData = JSON.parse(statusResult.output);
  } catch {
    return { status: "error", comments: [] };
  }

  // Get PR comments
  const commentsResult = await runCli(`gh pr view "${prUrl}" --json comments`);
  let comments = [];
  if (commentsResult.success) {
    try {
      const parsed = JSON.parse(commentsResult.output);
      comments = parsed.comments ?? [];
    } catch {
      // ignore parse errors
    }
  }

  const reviewDecision = prData.reviewDecision ?? "PENDING";
  console.log("PR review decision:", reviewDecision);

  return {
    status: reviewDecision,
    comments,
    prState: prData.state,
  };
}
