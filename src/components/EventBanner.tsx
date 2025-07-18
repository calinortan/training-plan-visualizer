import React from "react";

type EventBannerProps = {
  raceDistance: string;
  raceDate: string;
};

const EventBanner: React.FC<EventBannerProps> = ({
  raceDistance,
  raceDate,
}) => {
  if (!raceDistance || !raceDate) return null;
  return (
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
        Target Event: {raceDistance} on {raceDate}
      </h2>
    </div>
  );
};

export default EventBanner;
