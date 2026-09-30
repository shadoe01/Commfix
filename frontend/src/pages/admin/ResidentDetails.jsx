import { useParams, Link } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { findResident, reports } from "../../data/placeholder.js";
import StatusBadge from "../../components/StatusBadge.jsx";

export default function ResidentDetails() {
  const { id } = useParams();
  const resident = findResident(id);

  if (!resident) {
    return (
      <>
        <h1>Resident not found</h1>
        <Link to="/admin/residents" className="btn btn-secondary">Back to Resident Records</Link>
      </>
    );
  }

  const theirReports = reports.filter((r) => r.resident === resident.name);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{resident.name}</h1>
          <p>{resident.household}</p>
        </div>
        <span className="badge" style={{ background: "var(--color-success-light)", color: "var(--color-success)", textTransform: "capitalize" }}>
          {resident.status}
        </span>
      </div>

      <div className="card">
        <h3>Contact</h3>
        <p><strong>Contact number:</strong> {resident.contact}</p>
        <p><strong>Resident ID:</strong> {resident.id}</p>
        <p><strong>Reports submitted:</strong> {resident.reports}</p>
        <div className="quick-actions">
          <Button variant="secondary">Edit</Button>
          <Button variant="secondary" onClick={() => document.getElementById("resident-reports")?.scrollIntoView({ behavior: "smooth" })}>
            View Reports
          </Button>
        </div>
      </div>

      <div className="card" id="resident-reports">
        <h3>Reports</h3>
        <div className="table-wrap">
          <table className="list">
            <thead><tr><th>ID</th><th>Facility</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {theirReports.map((r) => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td>{r.facility}</td>
                  <td>{r.date}</td>
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
