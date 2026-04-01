import { createBranch, slugify } from "../git/gitManager.js";

export async function run(task) {
  console.log("Running create branch skill...");

  const branchName = `feature/${slugify(task)}`;
  const result = await createBranch(branchName);

  if (result.success) {
    console.log(`Branch ${branchName} created successfully.`);
    return { branchName };
  } else {
    // If branch creation fails, it might already exist. Log the warning and attempt to checkout the branch.
    console.warn(
      `Could not create branch ${branchName} (may already exist):`,
      result.output,
    );

    await checkoutBranch(branchName);

    return { branchName };
  }
}
