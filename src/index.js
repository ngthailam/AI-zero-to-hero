import dotenv from "dotenv";
dotenv.config();

import taskRoutes from "./routes/taskRoutes.js";
import express from "express";

const app = express();

console.log("API KEY:", process.env.OPENAI_API_KEY);

app.use(express.json());
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});