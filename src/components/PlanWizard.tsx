import React, { useState, useEffect } from "react";

export type PlanWizardAnswers = {
  raceDistance: string;
  raceDate: string;
  targetTime: string;
  recentRaceDistance: string;
  recentRaceTime: string;
  currentMileage: string;
  longRun: string;
  easyPace: string;
  experience: string;
  daysPerWeek: string;
  constraints: string;
};

const defaultAnswers: PlanWizardAnswers = {
  raceDistance: "",
  raceDate: "",
  targetTime: "",
  recentRaceDistance: "",
  recentRaceTime: "",
  currentMileage: "",
  longRun: "",
  easyPace: "",
  experience: "",
  daysPerWeek: "",
  constraints: "",
};

const LOCAL_KEY = "planWizardAnswers";

const steps = [
  "raceDistance",
  "raceDate",
  "targetTime",
  "recentRace",
  "currentMileage",
  "longRun",
  "easyPace",
  "experience",
  "daysPerWeek",
  "constraints",
  "summary",
] as const;

type Step = (typeof steps)[number];

const labels: Record<Step, string> = {
  raceDistance: "What is your goal race distance?",
  raceDate: "When is your target race date?",
  targetTime: "What is your target finish time for this event? (hh:mm:ss)",
  recentRace: "Do you have a recent all-out race result?",
  currentMileage: "What is your current weekly mileage (km)?",
  longRun: "What is your current long run distance (km)?",
  easyPace: "What is your current easy run pace? (e.g. 6:00/km or 9:40/mi)",
  experience: "What is your running experience level?",
  daysPerWeek: "How many days per week can you run?",
  constraints: "Any special constraints or notes? (optional)",
  summary: "Review your answers",
};

const experienceOptions = ["Beginner", "Intermediate", "Advanced"];
const raceOptions = ["10K", "Half Marathon", "Marathon", "Custom"];
const recentRaceOptions = [
  "None",
  "5K",
  "10K",
  "Half Marathon",
  "Marathon",
  "Custom",
];

export type PlanWizardProps = {
  onPlanGenerated: (plan: any) => void;
};

const PlanWizard: React.FC<PlanWizardProps> = ({ onPlanGenerated }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<PlanWizardAnswers>(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved) : defaultAnswers;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(answers));
  }, [answers]);

  const step = steps[stepIdx];

  const handleChange = (field: keyof PlanWizardAnswers, value: string) => {
    setAnswers((a) => ({ ...a, [field]: value }));
  };

  const next = () => setStepIdx((i) => Math.min(i + 1, steps.length - 1));
  const prev = () => setStepIdx((i) => Math.max(i - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok) throw new Error("Failed to generate plan");
      const data = await res.json();
      onPlanGenerated(data);
      // Do NOT clear localStorage here
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setAnswers(defaultAnswers);
    setStepIdx(0);
    localStorage.removeItem(LOCAL_KEY);
  };

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.92)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="loader-spinner"
            style={{
              width: 64,
              height: 64,
              border: "8px solid #eee",
              borderTop: "8px solid #007bff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: 24,
            }}
          />
          <div style={{ fontSize: 22, fontWeight: 600, color: "#333" }}>
            Generating your plan...
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      <form
        className="card"
        onSubmit={handleSubmit}
        style={{ maxWidth: 480, margin: "40px auto" }}
      >
        <h2 style={{ marginBottom: 24 }}>Personalized Training Plan Wizard</h2>
        {step !== "summary" && (
          <>
            <label
              style={{ fontWeight: 600, marginBottom: 8, display: "block" }}
            >
              {labels[step]}
            </label>
            {step === "raceDistance" && (
              <>
                <select
                  className="form-control"
                  value={answers.raceDistance}
                  onChange={(e) => handleChange("raceDistance", e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select distance
                  </option>
                  {raceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {answers.raceDistance === "Custom" && (
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter custom distance (e.g. 25K)"
                    value={answers.constraints}
                    onChange={(e) =>
                      handleChange("constraints", e.target.value)
                    }
                    style={{ marginTop: 8 }}
                  />
                )}
              </>
            )}
            {step === "raceDate" && (
              <input
                className="form-control"
                type="date"
                value={answers.raceDate}
                onChange={(e) => handleChange("raceDate", e.target.value)}
                required
              />
            )}
            {step === "targetTime" && (
              <input
                className="form-control"
                type="text"
                pattern="^\\d{1,2}:\\d{2}:\\d{2}$"
                placeholder={`e.g. 1:45:00 for ${
                  answers.raceDistance || "your event"
                }`}
                value={answers.targetTime}
                onChange={(e) => handleChange("targetTime", e.target.value)}
                required
              />
            )}
            {step === "recentRace" && (
              <>
                <select
                  className="form-control"
                  value={answers.recentRaceDistance}
                  onChange={(e) =>
                    handleChange("recentRaceDistance", e.target.value)
                  }
                  required
                >
                  <option value="" disabled>
                    Select distance
                  </option>
                  {recentRaceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {answers.recentRaceDistance !== "None" &&
                  answers.recentRaceDistance !== "" && (
                    <input
                      className="form-control"
                      type="text"
                      pattern="^\\d{1,2}:\\d{2}:\\d{2}$"
                      placeholder="e.g. 0:48:00 for 10K"
                      value={answers.recentRaceTime}
                      onChange={(e) =>
                        handleChange("recentRaceTime", e.target.value)
                      }
                      required
                      style={{ marginTop: 8 }}
                    />
                  )}
              </>
            )}
            {step === "currentMileage" && (
              <input
                className="form-control"
                type="number"
                min={0}
                value={answers.currentMileage}
                onChange={(e) => handleChange("currentMileage", e.target.value)}
                required
              />
            )}
            {step === "longRun" && (
              <input
                className="form-control"
                type="number"
                min={0}
                value={answers.longRun}
                onChange={(e) => handleChange("longRun", e.target.value)}
                required
              />
            )}
            {step === "easyPace" && (
              <input
                className="form-control"
                type="text"
                pattern="^\d{1,2}:\d{2}\s*/\s*(km|mi)$|^\d{1,2}:\d{2}$"
                placeholder="e.g. 6:00/km or 9:40/mi"
                value={answers.easyPace}
                onChange={(e) => handleChange("easyPace", e.target.value)}
                required
              />
            )}
            {step === "experience" && (
              <select
                className="form-control"
                value={answers.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                required
              >
                <option value="" disabled>
                  Select experience
                </option>
                {experienceOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
            {step === "daysPerWeek" && (
              <input
                className="form-control"
                type="number"
                min={2}
                max={7}
                value={answers.daysPerWeek}
                onChange={(e) => handleChange("daysPerWeek", e.target.value)}
                required
              />
            )}
            {step === "constraints" && (
              <textarea
                className="form-control"
                placeholder="E.g. I can't run on Sundays, recovering from injury, etc."
                value={answers.constraints}
                onChange={(e) => handleChange("constraints", e.target.value)}
                rows={3}
              />
            )}
          </>
        )}
        {step === "summary" && (
          <div style={{ marginBottom: 16 }}>
            <h3>Review your answers:</h3>
            <ul style={{ paddingLeft: 20 }}>
              <li>
                <b>Race distance:</b> {answers.raceDistance}
              </li>
              <li>
                <b>Race date:</b> {answers.raceDate}
              </li>
              <li>
                <b>Target finish time:</b> {answers.targetTime}
              </li>
              <li>
                <b>Recent race result:</b>{" "}
                {answers.recentRaceDistance === "None" ||
                !answers.recentRaceDistance
                  ? "None"
                  : `${answers.recentRaceDistance} in ${answers.recentRaceTime}`}
              </li>
              <li>
                <b>Current weekly mileage:</b> {answers.currentMileage} km
              </li>
              <li>
                <b>Long run distance:</b> {answers.longRun} km
              </li>
              <li>
                <b>Easy pace:</b> {answers.easyPace}
              </li>
              <li>
                <b>Experience:</b> {answers.experience}
              </li>
              <li>
                <b>Days per week:</b> {answers.daysPerWeek}
              </li>
              {answers.constraints && (
                <li>
                  <b>Constraints:</b> {answers.constraints}
                </li>
              )}
            </ul>
            <button
              type="button"
              className="btn btn-danger"
              style={{ marginTop: 12 }}
              onClick={handleRestart}
            >
              Restart Wizard
            </button>
          </div>
        )}
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 24,
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={prev}
            disabled={stepIdx === 0}
          >
            Back
          </button>
          {step !== "summary" ? (
            <button
              type="button"
              className="btn"
              onClick={next}
              disabled={
                (step === "raceDistance" && !answers.raceDistance) ||
                (step === "raceDate" && !answers.raceDate) ||
                (step === "targetTime" && !answers.targetTime) ||
                (step === "recentRace" &&
                  (!answers.recentRaceDistance ||
                    (answers.recentRaceDistance !== "None" &&
                      !answers.recentRaceTime))) ||
                (step === "currentMileage" && !answers.currentMileage) ||
                (step === "longRun" && !answers.longRun) ||
                (step === "easyPace" && !answers.easyPace) ||
                (step === "experience" && !answers.experience) ||
                (step === "daysPerWeek" && !answers.daysPerWeek)
              }
            >
              Next
            </button>
          ) : (
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Generating..." : "Generate Plan"}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default PlanWizard;
