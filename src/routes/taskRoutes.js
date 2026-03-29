import express from "express";
import { run } from "../core/agent/agent.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ error: "Feature is required" });
    }

    await run(task);

    res.json({
      message: "Task completed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
