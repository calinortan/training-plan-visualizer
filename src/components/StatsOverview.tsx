import React from "react";

type StatsOverviewProps = {
  totalWeeks: number;
  completedWeeks: number;
  totalMileage: number;
  completedMileage: number;
};

const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalWeeks,
  completedWeeks,
  totalMileage,
  completedMileage,
}) => {
  const progress = totalMileage > 0 ? completedMileage / totalMileage : 0;
  let completedBg = "#f8f9fa";
  let completedColor = "#333";
  if (progress < 0.5) {
    completedBg = "#ffeaea"; // light red
    completedColor = "#d32f2f"; // red
  } else if (progress < 0.9) {
    completedBg = "#fffbe6"; // light yellow
    completedColor = "#ff9800"; // orange
  } else {
    completedBg = "#e8f5e8"; // light green
    completedColor = "#388e3c"; // green
  }

  return (
    <div className="stats-overview">
      <div className="overview-card">
        <div className="overview-number">{totalWeeks}</div>
        <div className="overview-label">Total Weeks</div>
      </div>
      <div className="overview-card">
        <div className="overview-number">{completedWeeks}</div>
        <div className="overview-label">Completed Weeks</div>
      </div>
      <div className="overview-card">
        <div className="overview-number">{Math.round(totalMileage)}</div>
        <div className="overview-label">Target Mileage (km)</div>
      </div>
      <div
        className="overview-card"
        style={{ background: completedBg, color: completedColor }}
      >
        <div className="overview-number">{Math.round(completedMileage)}</div>
        <div className="overview-label">Completed Mileage (km)</div>
        <div style={{ fontWeight: 500, fontSize: "1rem", marginTop: 4 }}>
          {Math.round(progress * 100)}% of target
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
