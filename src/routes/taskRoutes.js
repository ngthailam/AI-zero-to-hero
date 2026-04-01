import express from "express";
import { run } from "../core/agent/agent.js";
import { run as runTest } from "../core/skills/test/runTest.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ error: "Feature is required" });
    }

    const context = await run(task);

    res.json({
      message: "Task completed successfully",
      prUrl: context.prUrl ?? null,
      branch: context.branchName ?? null,
      testsPassed: context.testResults?.success ?? false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/test", async (req, res) => {
  try {
    const testResults = await runTest();
    res.json({
      message: "Tests executed",
      testResults,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
