import { PlanWizardAnswers } from "../types/plan";

export function buildPlanPrompt(
  answers: PlanWizardAnswers & { currentDate: string }
): string {
  return `Generate a personalized running training plan as a JSON array of weeks. Each week should have: weekNumber, Phase, startDate, longRunKm, weeklyMileage, Key Workout, Long Run Pace (as an exact pace range, e.g. 5:10-5:30/km, not a description).

User info:
- Goal distance: ${answers.raceDistance}
- Race date: ${answers.raceDate}
- Target finish time: ${answers.targetTime}
- Recent race result: ${
    answers.recentRaceDistance === "None" || !answers.recentRaceDistance
      ? "None"
      : `${answers.recentRaceDistance} in ${answers.recentRaceTime}`
  }
- Current weekly mileage: ${answers.currentMileage} km
- Long run: ${answers.longRun} km
- Current easy pace: ${answers.easyPace}
- Experience: ${answers.experience}
- Days per week: ${answers.daysPerWeek}
- Constraints: ${answers.constraints || "None"}
- Current date: ${answers.currentDate}

The plan must start from the current date, and the first week may be partial if the race is not a whole number of weeks away. Each week must include exact pace ranges for all workouts and long runs. Use the user's current easy pace as a reference for recommended paces. The plan should gradually increase mileage, include a variety of workouts, and have a taper and race week. Output only a JSON array, no extra text.`;
}
