import Button from "../../components/Button.jsx";
import { facilities } from "../../data/placeholder.js";

export default function FacilityManagement() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1>Facility Management</h1>
          <p>Facilities tracked by Commfix.</p>
        </div>
        <Button>+ Add Facility</Button>
      </div>
      <div className="table-wrap">
        <table className="list">
          <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Location</th><th>Status</th></tr></thead>
          <tbody>
            {facilities.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.name}</td>
                <td>{f.type}</td>
                <td>{f.location}</td>
                <td style={{ textTransform: "capitalize" }}>{f.status.replace("_", " ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
