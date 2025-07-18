import { PlanWizardAnswers, PlanWeek } from "../types/plan";
import { buildPlanPrompt } from "./prompt";
const fetch = require("node-fetch");

export async function generatePlanWithDeepSeek(
  answers: PlanWizardAnswers
): Promise<PlanWeek[]> {
  const currentDate = new Date().toISOString().slice(0, 10);
  const prompt = buildPlanPrompt({ ...answers, currentDate });

  const apiRes = await fetch(
    process.env.DEEPSEEK_API_URL ||
      "https://api.deepseek.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a running coach and training plan generator.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1800,
      }),
    }
  );
  if (!apiRes.ok) {
    const errText = await apiRes.text();
    throw new Error("DeepSeek LLM error: " + errText);
  }
  const data = await apiRes.json();
  const content = data.choices?.[0]?.message?.content || "";
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
