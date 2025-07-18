import { PlanWizardAnswers, PlanWeek } from "../types/plan";
import { generatePlanWithDeepSeek } from "./deepseek";
import { generatePlanWithGoogle } from "./google";

export async function generatePlan(
  answers: PlanWizardAnswers
): Promise<PlanWeek[]> {
  const provider = (process.env.LLM_PROVIDER || "deepseek").toLowerCase();
  if (provider === "google") {
    return generatePlanWithGoogle(answers);
  }
  // Default to deepseek
  return generatePlanWithDeepSeek(answers);
}
