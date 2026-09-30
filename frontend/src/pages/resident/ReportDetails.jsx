import { useParams, Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge.jsx";
import SeverityBadge from "../../components/SeverityBadge.jsx";
import StatusStepper from "../../components/StatusStepper.jsx";
import { findReport } from "../../data/placeholder.js";

export default function ReportDetails() {
  const { id } = useParams();
  const report = findReport(id);

  if (!report) {
    return (
      <>
        <h1>Report not found</h1>
        <Link to="/my-reports" className="btn btn-secondary">Back to My Reports</Link>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Report #{report.id}</h1>
          <p>Submitted {report.date}</p>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div className="card">
        <h3>Progress</h3>
        <StatusStepper status={report.status} />
      </div>

      <div className="card">
        <h3>Details</h3>
        <p><strong>Facility:</strong> {report.facility}</p>
        <p><strong>Location:</strong> {report.location}</p>
        <p><strong>Description:</strong> {report.description}</p>
      </div>

      <div className="card">
        <h3>Image</h3>
        <div className="file-drop">Image preview placeholder</div>
      </div>

      <div className="card">
        <h3>AI Assessment</h3>
        <p><strong>Damage type:</strong> {report.ai.type}</p>
        <p><strong>Severity:</strong> <SeverityBadge severity={report.ai.severity} /></p>
        <p><strong>Confidence:</strong> {report.ai.confidence}%</p>
      </div>
    </>
  );
}
