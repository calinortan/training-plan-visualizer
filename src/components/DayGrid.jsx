import React from "react";
import { format, isToday, toDateSafe } from "../utils/date";

export default function DayGrid({ days, completedDays, toggleDayCompletion }) {
  return (
    <div className="days-grid">
      {days.map((day, dayIndex) => {
        const dayDate = toDateSafe(day);
        const dateString = dayDate ? format(dayDate, "yyyy-MM-dd") : "";
        const isCompleted = completedDays[dateString];
        const isTodayDate = dayDate ? isToday(dayDate) : false;
        const isValidDay = !!dayDate;
        return (
          <div
            key={dayIndex}
            className={`day-item ${isCompleted ? "completed" : ""} ${
              isTodayDate ? "today" : ""
            }`}
            onClick={() => isValidDay && toggleDayCompletion(dateString)}
            title={
              isValidDay
                ? `${format(dayDate, "EEEE, MMM d")}${
                    isCompleted ? " - Completed" : ""
                  }`
                : "Invalid date"
            }
          >
            {isValidDay ? format(dayDate, "d") : "-"}
          </div>
        );
      })}
    </div>
  );
}
