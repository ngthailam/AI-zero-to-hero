import express from "express";
import { generateTasks } from "../ai/generator.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { feature } = req.body;

    if (!feature) {
      return res.status(400).json({ error: "Feature is required" });
    }

    const result = await generateTasks(feature);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;