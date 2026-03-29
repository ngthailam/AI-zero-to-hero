export const taskBreakdownPrompt = (feature) => `
You are a senior software engineer and product manager.

Break down the following feature into:
- a single epic with title and description
- user stories
- tasks
- acceptance criteria
- estimatedTime for a user story (in days)

Note:
- Keep the epic title concise but still contains original meaning of the feature.
- The epic description should be no more than 3 sentences.
- 1 user story cannot be too big. If it is, break it down into multiple user stories.
- Each user story should have a clear title and description.
- Each user story should not excced more than 3 days of work for a single engineer.
- Each task should have a clear title and description.
- Each user story should have 3-5 tasks.

Return ONLY valid JSON. Do not wrap in markdown or code blocks. The JSON should follow this structure:
{
  "epicTitle": "",
  "epicDescription": "",
  "userStories": [
    {
      "title": "",
      "description": "",
      "estimatedTime": "",
      "tasks": [
        {
          "title": "",
          "description": "",
        }
      ],
      "acceptanceCriteria": []
    }
  ]
}

Feature:
${feature}
`;