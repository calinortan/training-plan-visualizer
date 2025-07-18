import React from "react";

type ClearDataButtonProps = {
  onClear: () => void;
};

const ClearDataButton: React.FC<ClearDataButtonProps> = ({ onClear }) => {
  const handleClick = () => {
    window.localStorage.removeItem("trainingPlan");
    window.localStorage.removeItem("completedEvents");
    window.localStorage.removeItem("actualMileage");
    onClear();
  };
  return (
    <button
      className="btn btn-secondary"
      style={{ marginBottom: 8 }}
      onClick={handleClick}
    >
      Clear All Data
    </button>
  );
};

export default ClearDataButton;
