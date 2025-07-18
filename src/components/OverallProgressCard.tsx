import React from "react";

type OverallProgressCardProps = {
  progress: number;
};

const OverallProgressCard: React.FC<OverallProgressCardProps> = ({
  progress,
}) => (
  <div className="card">
    <h3>Overall Progress</h3>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
    </div>
    <p style={{ marginTop: "10px", textAlign: "center" }}>
      {Math.round(progress)}% Complete
    </p>
  </div>
);

export default OverallProgressCard;
