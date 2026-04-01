import dotenv from "dotenv";
dotenv.config();

import taskRoutes from "./routes/taskRoutes.js";
import express from "express";

const app = express();

app.use(express.json());
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 🔥 Add this
server.on("error", (err) => {
  console.error("Server error:", err);
});

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);