import { useParams, Link } from "react-router-dom";
import SeverityBadge from "../../components/SeverityBadge.jsx";
import Button from "../../components/Button.jsx";
import { findReport } from "../../data/placeholder.js";

export default function AIAssessment() {
  const { id } = useParams();
  const report = findReport(id);

  if (!report) {
    return (
      <>
        <h1>Report not found</h1>
        <Link to="/admin/reports" className="btn btn-secondary">Back to Damage Reports</Link>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>AI Assessment — Report #{report.id}</h1>
          <p>Decision support only. Final verification is always made by an administrator.</p>
        </div>
      </div>

      <div className="card">
        <h3>Result</h3>
        <p><strong>Damage type:</strong> {report.ai.type}</p>
        <p><strong>Severity:</strong> <SeverityBadge severity={report.ai.severity} /></p>
        <p><strong>Confidence:</strong> {report.ai.confidence}%</p>
      </div>

      <div className="card">
        <h3>Admin decision</h3>
        <p>Confirm the AI's suggestion, or override it based on your own review.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <Button>Confirm AI severity</Button>
          <Button variant="secondary">Override severity</Button>
        </div>
      </div>
    </>
  );
}
