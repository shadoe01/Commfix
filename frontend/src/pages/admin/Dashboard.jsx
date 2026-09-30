import { Link } from "react-router-dom";
import StatCard from "../../components/StatCard.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { reports, residents, facilities } from "../../data/placeholder.js";

function countBy(list, key) {
  const counts = {};
  list.forEach((item) => {
    const k = item[key] || "Uncategorized";
    counts[k] = (counts[k] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

export default function AdminDashboard() {
  const pending = reports.filter((r) => r.status === "pending").length;
  const underReview = reports.filter((r) => r.status === "under_review").length;
  const resolved = reports.filter((r) => r.status === "resolved").length;
  const byCategory = countBy(reports, "category");
  const bySeverity = countBy(reports, "severity");

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Overview of Commfix activity across the barangay.</p>
        </div>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", marginBottom: "24px" }}>
        <StatCard label="Total residents" value={residents.length} />
        <StatCard label="Total reports" value={reports.length} />
        <StatCard label="Pending" value={pending} />
        <StatCard label="Under review" value={underReview} />
        <StatCard label="Resolved" value={resolved} />
        <StatCard label="Facilities tracked" value={facilities.length} />
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: "24px" }}>
        <div className="card">
          <h3>Reports by category</h3>
          {byCategory.map(([label, count]) => (
            <div key={label} className="review-row"><span className="label">{label}</span><span className="value">{count}</span></div>
          ))}
        </div>
        <div className="card">
          <h3>Reports by severity</h3>
          {bySeverity.map(([label, count]) => (
            <div key={label} className="review-row" style={{ textTransform: "capitalize" }}><span className="label">{label}</span><span className="value">{count}</span></div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="page-header" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Recent reports</h3>
          <Link to="/admin/reports" className="btn btn-secondary">View all</Link>
        </div>
        <div className="table-wrap">
          <table className="list">
            <thead><tr><th>ID</th><th>Resident</th><th>Facility</th><th>Status</th></tr></thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td>{r.resident}</td>
                  <td>{r.facility}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
