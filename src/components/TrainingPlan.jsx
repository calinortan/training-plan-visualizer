import React from "react";
import { isBefore, isAfter, toDateSafe } from "../utils/date";
import WeekCard from "./WeekCard";

export default function TrainingPlan({
  trainingPlan,
  getWeekProgress,
  getDaysInWeek,
  completedEvents,
  toggleEventCompletion,
  actualMileage,
  onMileageChange,
}) {
  const today = new Date();
  return (
    <>
      {trainingPlan.map((week, index) => {
        const weekStart = toDateSafe(week.startDate);
        let weekStatus = "";
        const weekEnd = weekStart
          ? new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
          : null;
        if (weekEnd && isBefore(weekEnd, today)) {
          weekStatus = "past";
        } else if (weekStart && isAfter(weekStart, today)) {
          weekStatus = "future";
        } else {
          weekStatus = "current";
        }
        const weekProgress = getWeekProgress(week, actualMileage);
        const isCompleted = weekProgress === 100;
        return (
          <WeekCard
            key={index}
            week={week}
            weekProgress={weekProgress}
            weekStatus={weekStatus}
            isCompleted={isCompleted}
            weekStart={weekStart}
            weekEnd={weekEnd}
            completedEvents={completedEvents}
            toggleEventCompletion={toggleEventCompletion}
            actualMileage={actualMileage}
            onMileageChange={onMileageChange}
          />
        );
      })}
    </>
  );
}
