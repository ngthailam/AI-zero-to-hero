import { getOpenAIClient } from "../task_generator/ai/client.js";

export async function generateCode(task) {
  const prompt = `
You are a senior software engineer.

Write code for the following task.

Task:
${task.title}
${task.description}

Return ONLY code. No explanation. Do not wrap the code in any markdown or code block. Just return the raw code.
`;

  const res = await getOpenAIClient().chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  return res.choices[0].message.content;
}