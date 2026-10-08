import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatCard from "../../components/StatCard.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import LoadingState from "../../components/LoadingState.jsx";
import ErrorState from "../../components/ErrorState.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getReports } from "../../services/api.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
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

  const pending = reports?.filter((r) => r.status === "pending").length ?? 0;
  const underReview = reports?.filter((r) => r.status === "under_review").length ?? 0;
  const resolved = reports?.filter((r) => r.status === "resolved").length ?? 0;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Hello, {user?.name?.split(" ")[0]}!</h1>
          <p>Report community problems easily.</p>
        </div>
      </div>

      <Link to="/report-damage" className="btn btn-primary btn-block" style={{ marginBottom: 24, maxWidth: 480 }}>
        + Report Damage
      </Link>

      <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", marginBottom: "24px" }}>
        <StatCard label="Pending" value={pending} />
        <StatCard label="Under Review" value={underReview} />
        <StatCard label="Resolved" value={resolved} />
      </div>

      <h3>Recent Reports</h3>
      {error ? (
        <ErrorState onRetry={load} />
      ) : reports === null ? (
        <LoadingState title="Loading your reports..." />
      ) : reports.length === 0 ? (
        <EmptyState title="You haven't submitted any reports yet" hint="Tap Report Damage to get started." />
      ) : (
        reports.map((r) => (
          <button
            key={r.report_id}
            className="report-card"
            style={{ width: "100%", textAlign: "left", border: "1px solid var(--color-border)", cursor: "pointer" }}
            onClick={() => navigate(`/my-reports/${r.report_id}`)}
          >
            <div className="report-card-top">
              <h3>{r.facility_name}</h3>
              <StatusBadge status={r.status} />
            </div>
            <p className="report-card-meta">{new Date(r.created_at).toLocaleDateString()}</p>
          </button>
        ))
      )}
    </>
  );
}
