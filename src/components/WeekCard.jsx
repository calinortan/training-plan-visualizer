import React from "react";
import { format } from "../utils/date";

export default function WeekCard({
  week,
  weekProgress,
  weekStatus,
  isCompleted,
  weekStart,
  weekEnd,
  completedEvents,
  toggleEventCompletion,
  actualMileage,
  onMileageChange,
}) {
  // Unique keys for this week's events
  const keyWorkoutKey = `week${week.weekNumber}-keyworkout`;
  const longRunKey = `week${week.weekNumber}-longrun`;
  const mileageKey = `week${week.weekNumber}-mileage`;
  const mileageValue = actualMileage[week.weekNumber] || "";
  const mileageCompleted = Number(mileageValue) >= Number(week.weeklyMileage);
  return (
    <div
      className={`card week-card ${
        isCompleted ? "completed" : ""
      } ${weekStatus}`}
    >
      <div className="week-header">
        <div>
          <div className="week-title">Week {week.weekNumber}</div>
          <div className="week-dates">
            {weekStart ? format(weekStart, "MMM d") : "?"} -{" "}
            {weekEnd ? format(weekEnd, "MMM d, yyyy") : "?"}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            className={`week-phase ${week.Phase?.toLowerCase().replace(
              " ",
              "-"
            )}`}
          >
            {week.Phase}
          </div>
          {weekStatus === "current" && (
            <span className="week-badge current">Current Week</span>
          )}
          {weekStatus === "past" && (
            <span className="week-badge past">Past Week</span>
          )}
        </div>
      </div>
      <div className="week-stats">
        <div className="stat-item">
          <div className="stat-label">Long Run</div>
          <div className="stat-value">{week.longRunKm} km</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Weekly Mileage</div>
          <div className="stat-value">{week.weeklyMileage} km</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Key Workout</div>
          <div className="stat-value" style={{ fontSize: "0.9rem" }}>
            {week["Key Workout"]}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Long Run Pace</div>
          <div className="stat-value" style={{ fontSize: "0.9rem" }}>
            {week["Long Run Pace"]}
          </div>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${weekProgress}%` }}
        ></div>
      </div>
      <p style={{ marginTop: "10px", textAlign: "center", fontSize: "0.9rem" }}>
        {Math.round(weekProgress)}% Complete (
        {
          [keyWorkoutKey, longRunKey, mileageKey].filter((k) =>
            k === mileageKey ? mileageCompleted : completedEvents[k]
          ).length
        }
        /3 events)
      </p>
      <div className="event-tiles-row" style={{ marginTop: 16 }}>
        <div
          className={`event-tile ${
            completedEvents[keyWorkoutKey] ? "completed" : ""
          }`}
          onClick={() => toggleEventCompletion(keyWorkoutKey)}
          style={{ cursor: "pointer", minWidth: 140 }}
          title="Toggle completion"
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Key Workout</div>
          <div style={{ fontSize: "0.95rem" }}>{week["Key Workout"]}</div>
          {completedEvents[keyWorkoutKey] && (
            <div style={{ color: "#28a745", marginTop: 8 }}>✓ Completed</div>
          )}
        </div>
        <div
          className={`event-tile ${
            completedEvents[longRunKey] ? "completed" : ""
          }`}
          onClick={() => toggleEventCompletion(longRunKey)}
          style={{ cursor: "pointer", minWidth: 140 }}
          title="Toggle completion"
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Long Run</div>
          <div style={{ fontSize: "0.95rem" }}>{week.longRunKm} km</div>
          <div style={{ fontSize: "0.85rem", color: "#666" }}>
            {week["Long Run Pace"]}
          </div>
          {completedEvents[longRunKey] && (
            <div style={{ color: "#28a745", marginTop: 8 }}>✓ Completed</div>
          )}
        </div>
        <div
          className={`event-tile ${mileageCompleted ? "completed" : ""}`}
          style={{
            minWidth: 170,
            padding: 18,
            borderColor: mileageCompleted ? "#28a745" : undefined,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            Weekly Mileage Achieved
          </div>
          <div style={{ fontSize: "0.95rem", marginBottom: 8 }}>
            Target: {week.weeklyMileage} km
          </div>
          <input
            type="number"
            min="0"
            step="0.1"
            value={mileageValue}
            onChange={(e) => onMileageChange(week.weekNumber, e.target.value)}
            placeholder="Enter actual km"
          />
          {mileageCompleted && (
            <div style={{ color: "#28a745", marginTop: 8 }}>✓ Completed</div>
          )}
        </div>
      </div>
    </div>
  );
}
