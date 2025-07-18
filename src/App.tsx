import React from "react";
import "./App.css";
import { useTrainingPlan } from "./hooks/useTrainingPlan";
import StatsOverview from "./components/StatsOverview";
import TrainingPlan from "./components/TrainingPlan";
import PlanWizard from "./components/PlanWizard";
import EventBanner from "./components/EventBanner";
import ClearDataButton from "./components/ClearDataButton";
import OverallProgressCard from "./components/OverallProgressCard";
import { getDaysInWeek } from "./utils/date";
import type { Week } from "./components/WeekCard";

const App: React.FC = () => {
  const {
    trainingPlan,
    loading,
    error,
    setTrainingPlan,
    clearPlan,
    eventInfo,
    completedEvents,
    actualMileage,
    getWeekProgress,
    getOverallProgress,
    getTotalWeeks,
    getCompletedWeeks,
    totalMileage,
    completedMileage,
    onMileageChange,
    toggleEventCompletion,
  } = useTrainingPlan();

  // Adapter for TrainingPlan's getWeekProgress prop
  const getWeekProgressForTrainingPlan = React.useCallback(
    (week: Week, mileageObj?: Record<number, string>) =>
      getWeekProgress(week, completedEvents, mileageObj || actualMileage),
    [getWeekProgress, completedEvents, actualMileage]
  );

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
      <EventBanner
        raceDistance={eventInfo.raceDistance || ""}
        raceDate={eventInfo.raceDate || ""}
      />
      <div style={{ textAlign: "right", marginBottom: 16 }}>
        <ClearDataButton onClear={clearPlan} />
      </div>
      <StatsOverview
        totalWeeks={getTotalWeeks()}
        completedWeeks={getCompletedWeeks()}
        totalMileage={totalMileage}
        completedMileage={completedMileage}
      />
      <OverallProgressCard progress={getOverallProgress()} />
      <TrainingPlan
        trainingPlan={trainingPlan}
        getWeekProgress={getWeekProgressForTrainingPlan}
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
