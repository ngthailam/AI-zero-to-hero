import { run as runCodeGeneration } from "../skills/codeGeneration.js";
import { run as runWriteTest } from "../skills/writeTest.js";
import { run as runTest } from "../skills/runTest.js";
import { run as runFixCode } from "../skills/fixCode.js";
import { SKILL_TYPES } from "../utils/skillTypes.js";
import { run as runOpenAi, parseJson } from "../tools/openAi.js";
import { validateSteps } from "../validator/stepValidator.js";
import { createContext } from "../memory/simpleContext.js";

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

export async function run(task) {
  console.log("Running agent...");
  const allowedSkills = Object.values(SKILL_TYPES).join(", ");
  console.log("Allowed skills:", allowedSkills);

  const prompt = `
  You are an AI agent designed to complete software development tasks.

  Your task is: ${task}

  You have access to the following skills:
  ${allowedSkills}

  Break the task down into steps and determine which skill to use for each step.

  Output should be a JSON array of steps in the following format:
  [
    {
      "skill_type": "the type of skill to use, one of: ${allowedSkills}",
      "task": "The input to provide to the skill. Clear and concise. Used as an AI prompt. e.g. 'Write a function that reverses a string in JavaScript'.",
      "input_from": "the skill_type whose output feeds into this step, or null if none"
    }
  ]

  Do not include fix_code or run_tests in your plan — those are handled automatically after the initial steps.
  Return only the JSON array. No explanation.
  `;

  const res = await runOpenAi(prompt);
  const steps = parseJson(res);
  const context = createContext();
  console.log("Agent parsed steps:", steps);

  validateSteps(steps);

  // Execute planned steps
  for (const step of steps) {
    console.log(`Executing step with skill: ${step.skill_type}`);
    let output;

    if (step.skill_type === SKILL_TYPES.GENERATE_CODE) {
      output = await runCodeGeneration(step.task);
      mergeFiles(context, output.files);
    } else if (step.skill_type === SKILL_TYPES.WRITE_TEST) {
      const input = { files: Object.entries(context.files).map(([path, content]) => ({ path, content })) };
      output = await runWriteTest(step.task, input);
      mergeFiles(context, output.files);
    } else if (step.skill_type === SKILL_TYPES.RUN_TESTS) {
      output = await runTest();
      context.testResults = output;
    } else {
      console.error(`Unknown skill type: ${step.skill_type}`);
      continue;
    }

    context.history.push({ step: step.skill_type, result: output });
  }

  // Auto write+run tests if not already in the plan
  const hasWriteTest = steps.some(s => s.skill_type === SKILL_TYPES.WRITE_TEST);
  const hasRunTests = steps.some(s => s.skill_type === SKILL_TYPES.RUN_TESTS);

  if (!hasWriteTest) {
    console.log("Auto-running WRITE_TEST...");
    const input = { files: Object.entries(context.files).map(([path, content]) => ({ path, content })) };
    const output = await runWriteTest("Write tests for the generated code", input);
    mergeFiles(context, output.files);
    context.history.push({ step: SKILL_TYPES.WRITE_TEST, result: output });
  }

  if (!hasRunTests) {
    console.log("Auto-running RUN_TESTS...");
    const output = await runTest();
    context.testResults = output;
    context.history.push({ step: SKILL_TYPES.RUN_TESTS, result: output });
  }

  // Fix loop
  let attempts = 0;
  while (!isTestSuccess(context.testResults) && attempts < MAX_FIX_ATTEMPTS) {
    attempts++;
    console.log(`Tests failed. Running fix attempt ${attempts}/${MAX_FIX_ATTEMPTS}...`);

    const fixInput = {
      files: Object.entries(context.files).map(([path, content]) => ({ path, content })),
      testResults: context.testResults,
    };
    const fixOutput = await runFixCode("Fix the code so all tests pass", fixInput);
    mergeFiles(context, fixOutput.files);
    context.history.push({ step: SKILL_TYPES.FIX_CODE, result: fixOutput });

    const testOutput = await runTest();
    context.testResults = testOutput;
    context.history.push({ step: SKILL_TYPES.RUN_TESTS, result: testOutput });
  }

  if (isTestSuccess(context.testResults)) {
    console.log("All tests passed.");
  } else {
    console.log(`Tests still failing after ${MAX_FIX_ATTEMPTS} fix attempts.`);
  }

  return context;
}
