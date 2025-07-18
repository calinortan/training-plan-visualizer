import React, { useState } from "react";
import Papa from "papaparse";
import "./App.css";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { toDateSafe, getDaysInWeek, format } from "./utils/date";
import StatsOverview from "./components/StatsOverview";
import TrainingPlan from "./components/TrainingPlan";
import type { Week } from "./components/WeekCard";
import PlanWizard from "./components/PlanWizard";
import { PlanWizardAnswers } from "./components/PlanWizard";

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

const App: React.FC = () => {
  const [trainingPlan, setTrainingPlanState] = useState<Week[] | null>(null);
  const [completedEvents, setCompletedEvents] = useLocalStorage<
    Record<string, boolean>
  >("completedEvents", {});
  const [actualMileage, setActualMileage] = useLocalStorage<
    Record<number, string>
  >("actualMileage", {});
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save plan to localStorage when set
  const setTrainingPlan = (plan: Week[] | null) => {
    setTrainingPlanState(plan);
    if (plan) {
      localStorage.setItem("trainingPlan", JSON.stringify(plan));
    } else {
      localStorage.removeItem("trainingPlan");
    }
  };

  // On mount, load plan from localStorage if present
  React.useEffect(() => {
    const savedPlan = localStorage.getItem("trainingPlan");
    if (savedPlan) {
      setTrainingPlanState(JSON.parse(savedPlan));
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
  }, []);

  const toggleEventCompletion = (eventKey: string) => {
    setCompletedEvents((prev) => ({
      ...prev,
      [eventKey]: !prev[eventKey],
    }));
  };

  const getWeekProgress = (
    week: Week,
    mileageObj: Record<number, string> = actualMileage
  ): number => {
    const keyWorkoutKey = `week${week.weekNumber}-keyworkout`;
    const longRunKey = `week${week.weekNumber}-longrun`;
    const mileageKey = `week${week.weekNumber}-mileage`;
    const mileageValue = mileageObj[week.weekNumber] || "";
    const mileageCompleted = Number(mileageValue) >= Number(week.weeklyMileage);
    const completedCount = [keyWorkoutKey, longRunKey, mileageKey].filter(
      (k) => {
        if (k === mileageKey) return mileageCompleted;
        return completedEvents[k];
      }
    ).length;
    return (completedCount / 3) * 100;
  };

  const getOverallProgress = (): number => {
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
  };

  const getTotalWeeks = () => trainingPlan?.length || 0;
  const getCompletedWeeks = () => {
    if (!trainingPlan) return 0;
    return trainingPlan.filter((week) => getWeekProgress(week) === 100).length;
  };
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
  };

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

  if (!trainingPlan) {
    if (loading) {
      return (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <div className="card">
            <h2>Generating your plan...</h2>
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <div className="card">
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        </div>
      );
    }
    return <PlanWizard onPlanGenerated={setTrainingPlan} />;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🏃‍♂️ Training Plan Visualizer</h1>
        <p>Track your running progress week by week</p>
      </div>
      {eventInfo.raceDistance && eventInfo.raceDate && (
        <div
          className="card"
          style={{
            marginBottom: 20,
            background: "#e3f2fd",
            borderLeft: "6px solid #667eea",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: "1.3rem" }}>
            Target Event: {eventInfo.raceDistance} on {eventInfo.raceDate}
          </h2>
        </div>
      )}
      <div style={{ textAlign: "right", marginBottom: 16 }}>
        <button
          className="btn btn-secondary"
          style={{ marginBottom: 8 }}
          onClick={() => {
            setTrainingPlan(null);
            setCompletedEvents({});
            setActualMileage({});
            window.localStorage.removeItem("trainingPlan");
            window.localStorage.removeItem("completedEvents");
            window.localStorage.removeItem("actualMileage");
          }}
        >
          Clear All Data
        </button>
      </div>
      <StatsOverview
        totalWeeks={getTotalWeeks()}
        completedWeeks={getCompletedWeeks()}
        totalMileage={totalMileage}
        completedMileage={completedMileage}
      />
      <div className="card">
        <h3>Overall Progress</h3>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${getOverallProgress()}%` }}
          ></div>
        </div>
        <p style={{ marginTop: "10px", textAlign: "center" }}>
          {Math.round(getOverallProgress())}% Complete
        </p>
      </div>
      <TrainingPlan
        trainingPlan={trainingPlan}
        getWeekProgress={getWeekProgress}
        getDaysInWeek={getDaysInWeek}
        completedEvents={completedEvents}
        toggleEventCompletion={toggleEventCompletion}
        actualMileage={actualMileage}
        onMileageChange={onMileageChange}
      />
    </div>
  );
};

export default App;
