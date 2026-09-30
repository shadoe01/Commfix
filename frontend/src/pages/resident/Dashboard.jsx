import { Link, useNavigate } from "react-router-dom";
import StatCard from "../../components/StatCard.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { reports, currentResident } from "../../data/placeholder.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const mine = reports.filter((r) => r.resident === currentResident.name);
  const pending = mine.filter((r) => r.status === "pending").length;
  const underReview = mine.filter((r) => r.status === "under_review").length;
  const resolved = mine.filter((r) => r.status === "resolved").length;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Hello, {currentResident.name.split(" ")[0]}!</h1>
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
      {mine.length === 0 ? (
        <EmptyState title="You haven't submitted any reports yet" hint="Tap Report Damage to get started." />
      ) : (
        mine.map((r) => (
          <button
            key={r.id}
            className="report-card"
            style={{ width: "100%", textAlign: "left", border: "1px solid var(--color-border)", cursor: "pointer" }}
            onClick={() => navigate(`/my-reports/${r.id}`)}
          >
            <div className="report-card-top">
              <h3>{r.facility}</h3>
              <StatusBadge status={r.status} />
            </div>
            <p className="report-card-meta">{r.date}</p>
          </button>
        ))
      )}
    </>
  );
}
