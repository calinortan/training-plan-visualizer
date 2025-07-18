import { useState, useEffect, useCallback } from "react";
import type { Week } from "../components/WeekCard";
import { PlanWizardAnswers } from "../components/PlanWizard";

const LOCAL_KEY = "planWizardAnswers";

const isAnswersComplete = (a: PlanWizardAnswers | null) => {
  if (!a) return false;
  return (
    !!a.raceDistance &&
    !!a.raceDate &&
    !!a.currentMileage &&
    !!a.longRun &&
    !!a.experience &&
    !!a.daysPerWeek
  );
};

export function useTrainingPlan() {
  const [trainingPlan, setTrainingPlanState] = useState<Week[] | null>(null);
  const [completedEvents, setCompletedEvents] = useState<
    Record<string, boolean>
  >({});
  const [actualMileage, setActualMileage] = useState<Record<number, string>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save plan to localStorage when set
  const setTrainingPlan = useCallback((plan: Week[] | null) => {
    setTrainingPlanState(plan);
    if (plan) {
      localStorage.setItem("trainingPlan", JSON.stringify(plan));
    } else {
      localStorage.removeItem("trainingPlan");
    }
  }, []);

  // On mount, load plan from localStorage if present
  useEffect(() => {
    const savedPlan = localStorage.getItem("trainingPlan");
    if (savedPlan) {
      setTrainingPlanState(JSON.parse(savedPlan));
      setCompletedEvents(
        JSON.parse(localStorage.getItem("completedEvents") || "{}")
      );
      setActualMileage(
        JSON.parse(localStorage.getItem("actualMileage") || "{}")
      );
      return;
    }
    // Only auto-generate if no plan is present
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      const answers: PlanWizardAnswers = JSON.parse(saved);
      if (isAnswersComplete(answers)) {
        setLoading(true);
        setError(null);
        fetch("/api/generate-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answers),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to generate plan");
            return res.json();
          })
          .then((data) => {
            setTrainingPlan(data);
          })
          .catch((err) => {
            setError(err.message || "Unknown error");
          })
          .finally(() => setLoading(false));
      }
    }
  }, [setTrainingPlan]);

  const clearPlan = useCallback(() => {
    setTrainingPlanState(null);
    setCompletedEvents({});
    setActualMileage({});
    window.localStorage.removeItem("trainingPlan");
    window.localStorage.removeItem("completedEvents");
    window.localStorage.removeItem("actualMileage");
  }, []);

  // Read event info from localStorage
  let eventInfo: { raceDistance?: string; raceDate?: string } = {};
  try {
    const wizard = localStorage.getItem(LOCAL_KEY);
    if (wizard) {
      const parsed = JSON.parse(wizard);
      eventInfo = {
        raceDistance: parsed.raceDistance,
        raceDate: parsed.raceDate,
      };
    }
  } catch {}

  // Progress helpers
  const getWeekProgress = useCallback(
    (
      week: Week,
      completedEventsObj: Record<string, boolean> = completedEvents,
      actualMileageObj: Record<number, string> = actualMileage
    ): number => {
      const keyWorkoutKey = `week${week.weekNumber}-keyworkout`;
      const longRunKey = `week${week.weekNumber}-longrun`;
      const mileageKey = `week${week.weekNumber}-mileage`;
      const mileageValue = actualMileageObj[week.weekNumber] || "";
      const mileageCompleted =
        Number(mileageValue) >= Number(week.weeklyMileage);
      const completedCount = [keyWorkoutKey, longRunKey, mileageKey].filter(
        (k) => {
          if (k === mileageKey) return mileageCompleted;
          return completedEventsObj[k];
        }
      ).length;
      return (completedCount / 3) * 100;
    },
    [completedEvents, actualMileage]
  );

  const getOverallProgress = useCallback((): number => {
    if (!trainingPlan) return 0;
    const totalEvents = trainingPlan.length * 3;
    let completedCount = 0;
    trainingPlan.forEach((week) => {
      const keyWorkoutKey = `week${week.weekNumber}-keyworkout`;
      const longRunKey = `week${week.weekNumber}-longrun`;
      const mileageKey = `week${week.weekNumber}-mileage`;
      const mileageValue = actualMileage[week.weekNumber] || "";
      const mileageCompleted =
        Number(mileageValue) >= Number(week.weeklyMileage);
      if (completedEvents[keyWorkoutKey]) completedCount++;
      if (completedEvents[longRunKey]) completedCount++;
      if (mileageCompleted) completedCount++;
    });
    return (completedCount / totalEvents) * 100;
  }, [trainingPlan, completedEvents, actualMileage]);

  const getTotalWeeks = useCallback(
    () => trainingPlan?.length || 0,
    [trainingPlan]
  );
  const getCompletedWeeks = useCallback(() => {
    if (!trainingPlan) return 0;
    return trainingPlan.filter((week) => getWeekProgress(week) === 100).length;
  }, [trainingPlan, getWeekProgress]);
  const totalMileage = trainingPlan
    ? trainingPlan.reduce(
        (sum, week) => sum + Number(week.weeklyMileage || 0),
        0
      )
    : 0;
  const completedMileage = trainingPlan
    ? trainingPlan.reduce(
        (sum, week) => sum + (Number(actualMileage[week.weekNumber]) || 0),
        0
      )
    : 0;

  const onMileageChange = (weekNumber: number, value: string) => {
    setActualMileage((prev) => ({ ...prev, [weekNumber]: value }));
    window.localStorage.setItem(
      "actualMileage",
      JSON.stringify({ ...actualMileage, [weekNumber]: value })
    );
  };

  const toggleEventCompletion = (eventKey: string) => {
    setCompletedEvents((prev) => {
      const updated = { ...prev, [eventKey]: !prev[eventKey] };
      window.localStorage.setItem("completedEvents", JSON.stringify(updated));
      return updated;
    });
  };

  return {
    trainingPlan,
    loading,
    error,
    setTrainingPlan,
    clearPlan,
    eventInfo,
    completedEvents,
    setCompletedEvents,
    actualMileage,
    setActualMileage,
    getWeekProgress,
    getOverallProgress,
    getTotalWeeks,
    getCompletedWeeks,
    totalMileage,
    completedMileage,
    onMileageChange,
    toggleEventCompletion,
  };
}
