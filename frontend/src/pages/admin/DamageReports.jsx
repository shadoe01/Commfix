import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge.jsx";
import SeverityBadge from "../../components/SeverityBadge.jsx";
import LoadingState from "../../components/LoadingState.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import ErrorState from "../../components/ErrorState.jsx";
import { reports, damageCategories } from "../../data/placeholder.js";

const STATUS_OPTIONS = ["all", "pending", "under_review", "verified", "in_progress", "resolved", "rejected"];
const DATE_OPTIONS = ["Any time", "Today", "This week", "This month"];

export default function DamageReports() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [dateRange, setDateRange] = useState(DATE_OPTIONS[0]);

  // Simulates fetching from the backend so the loading state is visible.
  // The "Simulate error" button below exists only to demonstrate the error
  // state for this prototype -- there's no real failure condition yet since
  // there's no real API call.
  function load() {
    setLoading(true);
    setError(false);
    setTimeout(() => setLoading(false), 500);
  }
  useEffect(load, []);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (category !== "all" && r.category !== category) return false;
      if (search && !`${r.facility} ${r.resident} ${r.id}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
      // Date filtering is left as a UI-only control for now (see DATE_OPTIONS) --
      // wiring it up needs real timestamps from the backend to be meaningful.
    });
  }, [status, category, search]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Damage Reports</h1>
          <p>Review, verify, and update reports submitted by residents.</p>
        </div>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by resident, facility, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All statuses" : s.replace("_", " ")}</option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {damageCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
          {DATE_OPTIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingState title="Loading reports..." />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No damage reports found." hint="Try a different search or filter." />
      ) : (
        <div className="table-wrap">
          <table className="list">
            <thead>
              <tr><th>ID</th><th>Resident</th><th>Facility</th><th>Category</th><th>Date</th><th>Severity</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="clickable" onClick={() => navigate(`/admin/reports/${r.id}`)}>
                  <td>#{r.id}</td>
                  <td>{r.resident}</td>
                  <td>{r.facility}</td>
                  <td>{r.category || "—"}</td>
                  <td>{r.date}</td>
                  <td><SeverityBadge severity={r.severity} /></td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        type="button"
        className="btn btn-secondary"
        style={{ marginTop: 16 }}
        onClick={() => setError(true)}
      >
        Simulate error (Day 6 state demo)
      </button>
    </>
  );
}
