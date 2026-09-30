import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge.jsx";
import SeverityBadge from "../../components/SeverityBadge.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { reports, currentResident } from "../../data/placeholder.js";

export default function MyReports() {
  const navigate = useNavigate();
  const mine = reports.filter((r) => r.resident === currentResident.name);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>My Reports</h1>
          <p>Track the reports you've submitted.</p>
        </div>
      </div>
      {mine.length === 0 ? (
        <EmptyState title="No reports yet" hint="Reports you submit will show up here." />
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
            <div style={{ marginTop: 8 }}><SeverityBadge severity={r.severity} /></div>
          </button>
        ))
      )}
    </>
  );
}
