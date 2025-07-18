import express from "express";
import cors from "cors";
import dotenv from "dotenv";
const fetch = require("node-fetch");
import { PlanWizardAnswers } from "./types/plan";
import { generatePlan } from "./llm";

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

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
