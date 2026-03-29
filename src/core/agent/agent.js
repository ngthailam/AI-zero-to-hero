import { run as runCodeGeneration } from "../skills/codeGeneration.js";
import { run as runTest } from "../skills/runTest.js";
import { SKILL_TYPES } from "../utils/skillTypes.js";
import { run as runOpenAi } from "../tools/openAi.js";

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
      "skill_type": "the type of skill to use given in SKILL_TYPES, e.g. codeGeneration",
      "task": "The input to provide to the skill.  This should be clear and concise.
      This input is used for as an AI prompt for the skill. Contains only the general idea. e.g. 'Write a function that reverses a string in JavaScript'.",
      "input_from": "the name of the skill that provides the input for this step, if any, e.g. 'codeGeneration'. This field is optional and can be null if the input does not depend on the output of another skill."
    },
    ...
  ]

  Please execute the task using the appropriate skill and provide the output. If you cannot complete the task with the given skills, stop immediately and explain why.
  `;

  const res = await runOpenAi(prompt);
  const jsonRes = JSON.parse(res);
  let context = {};
  console.log("Agent parsed steps:", jsonRes);

  for (const step of jsonRes) {
    console.log(`Executing step with skill: ${step.skill_type}`);
    if (step.skill_type === SKILL_TYPES.GENERATE_CODE) {
      const output = await runCodeGeneration(step.task);
      context.generate_code = output;
    } else if (step.skill_type === SKILL_TYPES.RUN_TESTS) {
      await runTest(step.task, context.generate_code);
    } else {
      console.error(`Unknown skill type: ${step.skill_type}`);
    }
  }

  return;
}
