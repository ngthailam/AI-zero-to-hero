import { run as runCodeGeneration } from "../skills/codeGeneration.js";
import { run as runWriteTest } from "../skills/writeTest.js";
import { run as runTest } from "../skills/runTest.js";
import { run as runFixCode } from "../skills/fixCode.js";
import { run as runGitCommit } from "../skills/gitCommit.js";
import { run as runCreatePr } from "../skills/createPr.js";
import { run as runCheckReview } from "../skills/checkReview.js";
import { SKILL_TYPES } from "../utils/skillTypes.js";
import { run as runOpenAi, parseJson } from "../tools/openAi.js";
import { validateSteps } from "../validator/stepValidator.js";
import { createContext } from "../memory/simpleContext.js";
import { createBranch, slugify } from "../git/gitManager.js";

const MAX_FIX_ATTEMPTS = 3;

function isTestSuccess(testResults) {
  if (!testResults) return false;
  if (testResults.success === false) return false;
  const output = (testResults.output || "").toLowerCase();
  return !output.includes("fail") && !output.includes("error");
}

function mergeFiles(context, files) {
  for (const file of files) {
    context.files[file.path] = file.content;
  }
}

function getFilesList(context) {
  return Object.entries(context.files).map(([path, content]) => ({ path, content }));
}

export async function run(task) {
  console.log("Running agent...");
  const planningSkills = Object.values(SKILL_TYPES).join(", ");
  console.log("Allowed skills:", planningSkills);

  // Create a feature branch for this task
  const branchName = `feature/${slugify(task)}`;
  const branchResult = await createBranch(branchName);
  if (!branchResult.success) {
    console.warn("Could not create branch (may already exist):", branchResult.output);
  }

  const prompt = `
  You are an AI agent designed to complete software development tasks.

  Your task is: ${task}

  You have access to the following skills for planning: ${planningSkills}

  Break the task down into steps using only generate_code and write_test.

  Output should be a JSON array of steps in the following format:
  [
    {
      "skill_type": "generate_code or write_test",
      "task": "Clear and concise task description used as an AI prompt."
    }
  ]

  Return only the JSON array. No explanation.
  `;

  const res = await runOpenAi(prompt);
  const steps = parseJson(res);
  const context = createContext();
  context.branchName = branchName;
  console.log("Agent steps:", steps);

  validateSteps(steps);

  // Execute planned steps
  for (const step of steps) {
    console.log(`Executing step with skill: ${step.skill_type}`);
    let output;

    if (step.skill_type === SKILL_TYPES.GENERATE_CODE) {
      output = await runCodeGeneration(step.task);
      mergeFiles(context, output.files);
    } else if (step.skill_type === SKILL_TYPES.WRITE_TEST) {
      output = await runWriteTest(step.task, { files: getFilesList(context) });
      mergeFiles(context, output.files);
    } else {
      console.error(`Unknown skill type: ${step.skill_type}`);
      continue;
    }

    context.history.push({ step: step.skill_type, result: output });
  }

  // Auto write tests if not in the plan
  if (!steps.some(s => s.skill_type === SKILL_TYPES.WRITE_TEST)) {
    console.log("Auto-running WRITE_TEST...");
    const output = await runWriteTest("Write tests for the generated code", { files: getFilesList(context) });
    mergeFiles(context, output.files);
    context.history.push({ step: SKILL_TYPES.WRITE_TEST, result: output });
  }

  // Run tests
  console.log("Auto-running RUN_TESTS...");
  const testOutput = await runTest();
  context.testResults = testOutput;
  context.history.push({ step: SKILL_TYPES.RUN_TESTS, result: testOutput });

  // Fix loop
  let attempts = 0;
  while (!isTestSuccess(context.testResults) && attempts < MAX_FIX_ATTEMPTS) {
    attempts++;
    console.log(`Tests failed. Running fix attempt ${attempts}/${MAX_FIX_ATTEMPTS}...`);

    const fixOutput = await runFixCode("Fix the code so all tests pass", {
      files: getFilesList(context),
      testResults: context.testResults,
    });
    mergeFiles(context, fixOutput.files);
    context.history.push({ step: SKILL_TYPES.FIX_CODE, result: fixOutput });

    const retestOutput = await runTest();
    context.testResults = retestOutput;
    context.history.push({ step: SKILL_TYPES.RUN_TESTS, result: retestOutput });
  }

  if (isTestSuccess(context.testResults)) {
    console.log("All tests passed.");
  } else {
    console.log(`Tests still failing after ${MAX_FIX_ATTEMPTS} fix attempts.`);
  }

  // Git commit + push
  console.log("Auto-running GIT_COMMIT...");
  const commitOutput = await runGitCommit(task, {
    files: getFilesList(context),
    branchName,
  });
  context.history.push({ step: SKILL_TYPES.GIT_COMMIT, result: commitOutput });

  // Create PR
  console.log("Auto-running CREATE_PR...");
  const prOutput = await runCreatePr(task, {
    files: getFilesList(context),
    branchName,
    testResults: context.testResults,
  });
  context.prUrl = prOutput.prUrl;
  context.history.push({ step: SKILL_TYPES.CREATE_PR, result: prOutput });

  console.log("PR created:", context.prUrl);
  return context;
}
