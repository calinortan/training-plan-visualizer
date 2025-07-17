import React from "react";

export default function UploadArea({
  onFileInput,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
}) {
  return (
    <div className="card">
      <div
        className={`upload-area ${isDragging ? "dragover" : ""}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => document.getElementById("file-input").click()}
      >
        <div className="upload-icon">📁</div>
        <h3>Upload Training Plan</h3>
        <p>Drag and drop your CSV file here, or click to browse</p>
        <p style={{ fontSize: "0.9rem", marginTop: "10px", opacity: 0.7 }}>
          Expected columns: Week, Phase, Start, End, Long Run (km), Key Workout,
          Weekly Mileage (km), Long Run Pace
        </p>
      </div>
      <input
        id="file-input"
        type="file"
        accept=".csv"
        onChange={onFileInput}
        className="file-input"
      />
    </div>
  );
}
