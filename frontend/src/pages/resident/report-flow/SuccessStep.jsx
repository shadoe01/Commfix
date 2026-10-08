import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button.jsx";

export default function SuccessStep({ reportId, photoFailed }) {
  const navigate = useNavigate();

  return (
    <div className="success-screen">
      <div className="success-check">✓</div>
      <h2>Report Submitted!</h2>
      <p>Your report has been successfully submitted for review.</p>
      {photoFailed && (
        <div className="form-banner-error" style={{ maxWidth: 320, margin: "0 auto 16px", textAlign: "left" }}>
          Your report was saved, but the photo couldn't be uploaded. Open the report and use “Add a photo” to try again — you won't create a duplicate report.
        </div>
      )}
      <div className="card" style={{ maxWidth: 280, margin: "0 auto 24px" }}>
        <div className="review-row"><span className="label">Report ID</span><span className="value">#{reportId}</span></div>
        <div className="review-row"><span className="label">Status</span><span className="value">Pending</span></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 280, margin: "0 auto" }}>
        <Button onClick={() => navigate(`/my-reports/${reportId}`)}>View Report</Button>
        <Button variant="secondary" onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    </div>
  );
}
