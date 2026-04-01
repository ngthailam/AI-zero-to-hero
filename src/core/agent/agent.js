import { run as runCodeGeneration } from "../skills/code/codeGeneration.js";
import { run as runWriteTest } from "../skills/test/writeTest.js";
import { run as runTest } from "../skills/test/runTest.js";
import { run as runFixCode } from "../skills/code/fixCode.js";
import { run as runGitCommit } from "../skills/git/gitCommit.js";
import { run as runCreatePr } from "../skills/git/createPr.js";
import { run as runGitCreateBranch } from "../skills/git/createBranch.js";
import { SKILL_TYPES } from "../utils/skillTypes.js";
import { run as runOpenAi, parseJson } from "../tools/openAi.js";
import { validateSteps } from "../utils/validator/stepValidator.js";
import { context } from "../memory/simpleContext.js";

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
  return Object.entries(context.files).map(([path, content]) => ({
    path,
    content,
  }));
}

export async function run(task) {
  console.log("Running agent...");
  const planningSkills = Object.values(SKILL_TYPES).join(", ");
  console.log("Allowed skills:", planningSkills);

  // Create a feature branch for this task
  const prompt = `
  You are an AI agent designed to complete software development tasks.

  Your task is: ${task}

  You have access to the following skills for planning: ${planningSkills}

  Break the task down into steps using only generate_code and write_test.

  Output should be a JSON array of steps in the following format:
  [
    {
      "skill_type": "Any of the following: ${planningSkills}",
      "task": "Clear and concise task description used as an AI prompt."
    }
  ]

  Return only the JSON array. No explanation.
  `;

  const res = await runOpenAi(prompt);
  const steps = parseJson(res);
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
      const output = await runWriteTest("Write tests for the generated code", {
        files: getFilesList(context),
      });
      mergeFiles(context, output.files);
    } else if (step.skill_type === SKILL_TYPES.GIT_CREATE_BRANCH) {
      let { branchName } = await runGitCreateBranch(step.task);
      context.branchName = branchName;
    } else if (step.skill_type === SKILL_TYPES.RUN_TESTS) {
      const testOutput = await runTest();
      context.testResults = testOutput;
    } else if (step.skill_type === SKILL_TYPES.FIX_CODE) {
      if (context.testResults && isTestSuccess(context.testResults)) {
        console.log("Tests are passing, skipping fix code step.");
        continue;
      }
      
      const fixOutput = await runFixCode("Fix the code so all tests pass", {
        files: getFilesList(context),
        testResults: context.testResults,
      });
      mergeFiles(context, fixOutput.files);
    } else if (step.skill_type === SKILL_TYPES.GIT_COMMIT) {
      await runGitCommit(step.task, {
        files: getFilesList(context),
      });
    } else {
      console.error(`Unknown skill type: ${step.skill_type}`);
      continue;
    }

    context.history.push({ step: step.skill_type, result: output });
  }

  return context;
}
