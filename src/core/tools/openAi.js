import OpenAI from "openai";

export function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function run(prompt) {
  const res = await getOpenAIClient().chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  return res.choices[0].message.content;
}
