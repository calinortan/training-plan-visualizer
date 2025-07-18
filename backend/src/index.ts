import express from "express";
import cors from "cors";
import dotenv from "dotenv";
const fetch = require("node-fetch");
import { PlanWizardAnswers } from "./types/plan";
import { generatePlan } from "./llm";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/generate-plan", async (req, res) => {
  const answers: PlanWizardAnswers = req.body;
  try {
    const plan = await generatePlan(answers);
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Unknown error" });
  }
});

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, "../../../dist")));

// Fallback: serve index.html for any non-API route (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
