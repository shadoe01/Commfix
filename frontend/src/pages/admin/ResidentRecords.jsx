import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingState from "../../components/LoadingState.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { residents } from "../../data/placeholder.js";

export default function ResidentRecords() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(
    () => residents.filter((r) => `${r.name} ${r.id}`.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Resident Records</h1>
          <p>Residents registered on Commfix.</p>
        </div>
      </div>

      <div className="filter-bar">
        <input type="text" placeholder="Search resident..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <LoadingState title="Loading residents..." />
      ) : filtered.length === 0 ? (
        <EmptyState title="No residents found." hint="Try a different search." />
      ) : (
        <div className="table-wrap">
          <table className="list">
            <thead><tr><th>ID</th><th>Name</th><th>Household</th><th>Contact</th><th>Reports</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="clickable" onClick={() => navigate(`/admin/residents/${r.id}`)}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.household}</td>
                  <td>{r.contact}</td>
                  <td>{r.reports}</td>
                  <td style={{ textTransform: "capitalize" }}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
