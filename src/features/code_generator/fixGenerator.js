import { getOpenAIClient } from "../task_generator/ai/client.js";

export async function fixCode(code, errorOutput) {
  const prompt = `
You are a senior engineer.

Fix the following code based on the test error.

Code:
${code}

Error:
${errorOutput}

Return ONLY the fixed code. No explanation. Do not wrap the code in any markdown or code block. Just return the raw code.

`;

  const res = await getOpenAIClient().chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  return res.choices[0].message.content;
}