import { SKILL_TYPES } from "../../utils/skillTypes.js";

const VALID_SKILL_TYPES = new Set(Object.values(SKILL_TYPES));

export function validateSteps(steps) {
  if (!Array.isArray(steps) || steps.length === 0) {
    throw new Error("Planner output must be a non-empty array of steps");
  }

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    if (!step.skill_type) {
      throw new Error(`Step ${i}: missing required field 'skill_type'`);
    }
    if (!VALID_SKILL_TYPES.has(step.skill_type)) {
      throw new Error(
        `Step ${i}: unknown skill_type '${step.skill_type}'. Valid types: ${[...VALID_SKILL_TYPES].join(", ")}`
      );
    }
    if (!step.task || typeof step.task !== "string" || !step.task.trim()) {
      throw new Error(`Step ${i}: missing or empty required field 'task'`);
    }
  }
}
