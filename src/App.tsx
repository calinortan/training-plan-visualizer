import React, { useState } from "react";
import Papa from "papaparse";
import "./App.css";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { toDateSafe, getDaysInWeek, format } from "./utils/date";
import UploadArea from "./components/UploadArea";
import StatsOverview from "./components/StatsOverview";
import TrainingPlan from "./components/TrainingPlan";
import type { Week } from "./components/WeekCard";

const App: React.FC = () => {
  const [trainingPlan, setTrainingPlan] = useLocalStorage<Week[] | null>(
    "trainingPlan",
    null
  );
  const [completedEvents, setCompletedEvents] = useLocalStorage<
    Record<string, boolean>
  >("completedEvents", {});
  const [actualMileage, setActualMileage] = useLocalStorage<
    Record<number, string>
  >("actualMileage", {});
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        if (results.errors.length > 0) {
          alert("Error parsing CSV file. Please check the format.");
          console.error("PapaParse errors:", results.errors);
          return;
        }
        const requiredColumns = [
          "Week",
          "Phase",
          "Start",
          "Long Run (km)",
          "Key Workout",
          "Weekly Mileage (km)",
          "Long Run Pace",
        ];
        const firstRow = results.data[0] || {};
        const missing = requiredColumns.filter((col) => !(col in firstRow));
        if (missing.length > 0) {
          alert("Missing required columns: " + missing.join(", "));
          return;
        }
        const parsedPlan: Week[] = results.data.map(
          (row: any, index: number) => ({
            ...row,
            weekNumber: parseInt(row.Week) || index + 1,
            startDate: toDateSafe(row.Start),
            longRunKm: parseFloat(row["Long Run (km)"]) || 0,
            weeklyMileage: parseFloat(row["Weekly Mileage (km)"]) || 0,
          })
        );
        setTrainingPlan(parsedPlan);
        setCompletedEvents({});
        setActualMileage({});
      },
      error: (error: any) => {
        alert("Error reading file: " + error.message);
        console.error("PapaParse error:", error);
      },
    });
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

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

  const clearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This cannot be undone."
      )
    ) {
      setTrainingPlan(null);
      setCompletedEvents({});
      setActualMileage({});
      window.localStorage.removeItem("trainingPlan");
      window.localStorage.removeItem("completedEvents");
      window.localStorage.removeItem("actualMileage");
    }
  };

  const onMileageChange = (weekNumber: number, value: string) => {
    setActualMileage((prev) => ({ ...prev, [weekNumber]: value }));
  };

  if (!trainingPlan) {
    return (
      <div className="container">
        <div className="header">
          <h1>🏃‍♂️ Training Plan Visualizer</h1>
          <p>Upload your training plan CSV to start tracking your progress</p>
        </div>
        <UploadArea
          onFileInput={handleFileInput}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🏃‍♂️ Training Plan Visualizer</h1>
        <p>Track your running progress week by week</p>
      </div>
      <div style={{ textAlign: "right", marginBottom: 16 }}>
        <button
          className="btn btn-secondary"
          style={{ marginBottom: 8 }}
          onClick={clearData}
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
