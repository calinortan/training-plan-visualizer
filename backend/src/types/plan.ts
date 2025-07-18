export type PlanWizardAnswers = {
  raceDistance: string;
  raceDate: string;
  targetTime: string;
  recentRaceDistance: string;
  recentRaceTime: string;
  currentMileage: string;
  longRun: string;
  easyPace: string;
  experience: string;
  daysPerWeek: string;
  constraints: string;
};

export type PlanWeek = {
  weekNumber: number;
  Phase: string;
  startDate: string;
  longRunKm: number;
  weeklyMileage: number;
  "Key Workout": string;
  "Long Run Pace": string;
};
