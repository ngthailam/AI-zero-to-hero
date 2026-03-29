import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const baseURL = process.env.JIRA_BASE_URL;

const auth = {
  username: process.env.JIRA_EMAIL,
  password: process.env.JIRA_API_TOKEN,
};

export async function createIssue({ summary, description, issueType }) {
  const response = await axios.post(
    `${baseURL}/rest/api/3/issue`,
    {
      fields: {
        project: {
          key: process.env.JIRA_PROJECT_KEY,
        },
        summary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  text: description,
                  type: "text",
                },
              ],
            },
          ],
        },
        issuetype: {
          name: issueType, // "Task", "Story", "Epic"
        },
      },
    },
    {
      auth,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}