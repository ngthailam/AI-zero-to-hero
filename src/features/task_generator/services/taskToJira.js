import { createIssue } from "./jiraService.js";

export async function pushToJira(data) {
  const results = [];

  for (const story of data.userStories) {
    // Create Story
    const storyIssue = await createIssue({
      summary: story.title,
      description: story.description,
      issueType: "Story",
    });

    results.push(storyIssue);

    // Create Tasks under story
    for (const task of story.tasks) {
      const taskIssue = await createIssue({
        summary: task.title,
        description: task.description,
        issueType: "Task",
      });

      results.push(taskIssue);
    }
  }

  return results;
}