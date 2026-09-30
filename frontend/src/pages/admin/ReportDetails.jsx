import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "../../components/Button.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import SeverityBadge from "../../components/SeverityBadge.jsx";
import LoadingState from "../../components/LoadingState.jsx";
import { findReport } from "../../data/placeholder.js";

const STATUS_OPTIONS = ["pending", "under_review", "verified", "in_progress", "resolved", "rejected"];

// Commfix's full status set (from the Day 2/3 requirements) has more steps
// than the simplified Pending -> Under Review -> Resolved (+Rejected) flow
// this Day 6 plan sketches. The quick actions below cover the common
// transitions the plan calls out; the dropdown further down still exposes
// the full set for anything more specific (Verified, In Progress).
const QUICK_ACTIONS = [
  { to: "under_review", label: "Mark Under Review" },
  { to: "resolved", label: "Mark Resolved" },
];

export default function AdminReportDetails() {
  const { id } = useParams();
  const report = findReport(id);
  const [status, setStatus] = useState(report?.status);
  const [remark, setRemark] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  if (!report) {
    return (
      <>
        <h1>Report not found</h1>
        <Link to="/admin/reports" className="btn btn-secondary">Back to Damage Reports</Link>
      </>
    );
  }

  function save(nextStatus) {
    if (nextStatus === "rejected" && !remark.trim()) {
      setRejecting(true);
      return;
    }
    setSaving(true);
    setSuccess(false);
    // Placeholder: will call services/api.js updateReportStatus() once the backend exists.
    setTimeout(() => {
      setStatus(nextStatus);
      setSaving(false);
      setSuccess(true);
      setRejecting(false);
    }, 700);
  }

  if (saving) {
    return <LoadingState title="Updating status..." />;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Report #{report.id}</h1>
          <p>Submitted by {report.resident} on {report.date}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {success && <div className="form-banner-success">Report status successfully updated.</div>}

      <div className="card">
        <h3>Details</h3>
        <p><strong>Facility:</strong> {report.facility}</p>
        <p><strong>Category:</strong> {report.category || "—"}</p>
        <p><strong>Location:</strong> {report.location}</p>
        <p><strong>Description:</strong> {report.description}</p>
      </div>

      <div className="card">
        <h3>Image</h3>
        <div className="file-drop">Image preview placeholder</div>
      </div>

      <div className="card">
        <div className="page-header" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>AI Assessment</h3>
          <Link to={`/admin/reports/${report.id}/ai`} className="btn btn-secondary">View full assessment</Link>
        </div>
        <p><strong>Damage type:</strong> {report.ai.type}</p>
        <p><strong>Suggested severity:</strong> <SeverityBadge severity={report.ai.severity} /></p>
        <p style={{ fontSize: "var(--text-sm)" }}>Preliminary assessment — human verification required.</p>
      </div>

      <div className="card">
        <h3>Update status</h3>
        <div className="quick-actions" style={{ marginBottom: 16 }}>
          {QUICK_ACTIONS.map((a) => (
            <Button key={a.to} variant="secondary" disabled={status === a.to} onClick={() => save(a.to)}>
              {a.label}
            </Button>
          ))}
          <Button variant="secondary" disabled={status === "rejected"} onClick={() => setRejecting(true)}>
            Reject
          </Button>
        </div>

        {rejecting && (
          <div className="field" style={{ maxWidth: 420 }}>
            <label>Remarks (required to reject)</label>
            <textarea rows={3} value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Explain why this report is being rejected" />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Button disabled={!remark.trim()} onClick={() => save("rejected")}>Confirm Reject</Button>
              <Button variant="secondary" onClick={() => setRejecting(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <details style={{ marginTop: 16 }}>
          <summary style={{ cursor: "pointer", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
            Advanced: set an exact status
          </summary>
          <div className="field" style={{ maxWidth: 260, marginTop: 12 }}>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <Button onClick={() => save(status)}>Save Status</Button>
        </details>
      </div>
    </>
  );
}
