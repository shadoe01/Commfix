import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge.jsx";
import SeverityBadge from "../../components/SeverityBadge.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import LoadingState from "../../components/LoadingState.jsx";
import ErrorState from "../../components/ErrorState.jsx";
import AuthImage from "../../components/AuthImage.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getReports } from "../../services/api.js";

export default function MyReports() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [reports, setReports] = useState(null);
  const [error, setError] = useState(false);

  function load() {
    setError(false);
    setReports(null);
    getReports(token)
      .then(setReports)
      .catch(() => setError(true));
  }
  useEffect(load, [token]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>My Reports</h1>
          <p>Track the reports you've submitted.</p>
        </div>
      </div>
      {error ? (
        <ErrorState onRetry={load} />
      ) : reports === null ? (
        <LoadingState title="Loading your reports..." />
      ) : reports.length === 0 ? (
        <EmptyState title="No reports yet" hint="Reports you submit will show up here." />
      ) : (
        reports.map((r) => (
          <button
            key={r.report_id}
            className="report-card"
            style={{ width: "100%", textAlign: "left", border: "1px solid var(--color-border)", cursor: "pointer" }}
            onClick={() => navigate(`/my-reports/${r.report_id}`)}
          >
            <div className="report-card-row">
              <div className="report-thumb">
                {r.thumbnail_image_id ? (
                  <AuthImage reportId={r.report_id} imageId={r.thumbnail_image_id} alt={`Report ${r.report_id} photo`} failedText="No preview" />
                ) : (
                  <span className="photo-fallback">No photo</span>
                )}
              </div>
              <div className="report-card-body">
                <div className="report-card-top">
                  <h3>#{r.report_id} · {r.category || r.facility_name}</h3>
                  <StatusBadge status={r.status} />
                </div>
                <p className="report-card-meta">{r.facility_name} — {r.location}</p>
                <p className="report-card-meta">{new Date(r.created_at).toLocaleDateString()}</p>
                <div style={{ marginTop: 8 }}>
                  {r.severity ? (
                    <SeverityBadge severity={r.severity} />
                  ) : (
                    <span className="badge" style={{ background: "var(--color-bg)", color: "var(--color-text-muted)" }}>Not yet assessed</span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))
      )}
    </>
  );
}
