import { PlanWizardAnswers, PlanWeek } from "../types/plan";
import { buildPlanPrompt } from "./prompt";
const fetch = require("node-fetch");

export async function generatePlanWithGoogle(
  answers: PlanWizardAnswers
): Promise<PlanWeek[]> {
  const currentDate = new Date().toISOString().slice(0, 10);
  const prompt = buildPlanPrompt({ ...answers, currentDate });
  const apiRes = await fetch(
    (process.env.GOOGLE_API_URL ||
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent") +
      `?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    }
  );
  if (!apiRes.ok) {
    const errText = await apiRes.text();
    throw new Error("Google Gemini LLM error: " + errText);
  }
  const data = await apiRes.json();
  // Gemini returns candidates[0].content.parts[0].text
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  let plan;
  try {
    plan = JSON.parse(content);
  } catch (e) {
    const match = content.match(/\[[\s\S]*\]/);
    if (match) {
      plan = JSON.parse(match[0]);
    } else {
      throw new Error("Could not parse plan JSON");
    }
  }
  return plan;
}
