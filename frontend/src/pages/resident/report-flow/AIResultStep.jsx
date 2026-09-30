import Button from "../../../components/Button.jsx";
import SeverityBadge from "../../../components/SeverityBadge.jsx";

// Fake AI output for the prototype. Real AI integration happens later
// (per the blueprint, well after the backend exists) -- for now this just
// demonstrates the UI a real result would fill in.
const MOCK_RESULT = { type: "Structural Damage", severity: "moderate", confidence: 87 };

export default function AIResultStep({ onNext }) {
  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>AI Assessment</h3>
        <div className="review-row"><span className="label">Detected damage</span><span className="value">{MOCK_RESULT.type}</span></div>
        <div className="review-row"><span className="label">Confidence</span><span className="value">{MOCK_RESULT.confidence}%</span></div>
        <div className="review-row"><span className="label">Possible severity</span><span className="value"><SeverityBadge severity={MOCK_RESULT.severity} /></span></div>
      </div>
      <p style={{ fontSize: "var(--text-sm)" }}>
        This assessment is preliminary and will be reviewed by authorized personnel before any action is taken.
      </p>
      <Button block onClick={() => onNext(MOCK_RESULT)}>Continue</Button>
    </>
  );
}
