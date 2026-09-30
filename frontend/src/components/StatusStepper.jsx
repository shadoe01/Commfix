const STEPS = [
  { key: "pending", label: "Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "verified", label: "Verified" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
];

/**
 * Visual ✓ / current / ○ progression for a report's status.
 * If the report was rejected, show that as a terminal state instead.
 */
export default function StatusStepper({ status }) {
  if (status === "rejected") {
    return (
      <div className="stepper stepper-rejected">
        <span className="stepper-dot rejected">✕</span>
        <span>Rejected — this report was not accepted. See staff remarks below.</span>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <ol className="stepper">
      {STEPS.map((step, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming";
        return (
          <li key={step.key} className={`stepper-step ${state}`}>
            <span className="stepper-dot">{state === "done" ? "✓" : ""}</span>
            <span className="stepper-label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
