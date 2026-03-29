import express from "express";
import { generateTasks } from "../features/task_generator/ai/generator.js";
import { pushToJira } from "../features/task_generator/services/taskToJira.js";
import { runAgent } from "../agent/agentLoop.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    // const { feature } = req.body;

    // if (!feature) {
    //   return res.status(400).json({ error: "Feature is required" });
    // }

    // const aiResult = await generateTasks(feature);

    console.log("Sending to Jira...");
    // const jiraResult = await pushToJira(aiResult);

    console.log("Running agent ")
    const agentResult = await runAgent(
      {
        title: "Implement a function to reverse a string",
        description: "Write a JavaScript function that takes a string as input and returns the reversed version of that string.",
      }
    );

    res.json({
      // tasks: aiResult,
      agentResult: agentResult,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;