import { getOpenAIClient } from "./client.js";
import { taskBreakdownPrompt } from "./prompt.js";
import { taskSchema } from "../schemas/taskSchema.js";

export async function generateTasks(feature) {
  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: "You are a precise JSON generator." },
      { role: "user", content: taskBreakdownPrompt(feature) },
    ],
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;

  let parsed;

  try {
    console.log(content);
    parsed = JSON.parse(content);
  } catch (e) {
    throw new Error("Invalid JSON from AI");
  }

  const validated = taskSchema.parse(parsed);

  return validated;
}