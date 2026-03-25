export const taskBreakdownPrompt = (feature) => `
You are a senior software engineer and product manager.

Break down the following feature into:
- user stories
- tasks
- acceptance criteria

Return JSON in this format:
{
  "feature": "",
  "userStories": [
    {
      "title": "",
      "description": "",
      "tasks": [
        {
          "title": "",
          "description": ""
        }
      ],
      "acceptanceCriteria": []
    }
  ]
}

Feature:
${feature}
`;