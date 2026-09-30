const STYLES = {
  pending: { bg: "var(--color-info-light)", fg: "var(--color-info)", label: "Pending" },
  under_review: { bg: "var(--color-warning-light)", fg: "#9A5B12", label: "Under Review" },
  verified: { bg: "var(--color-primary-light)", fg: "var(--color-primary-dark)", label: "Verified" },
  in_progress: { bg: "var(--color-warning-light)", fg: "#9A5B12", label: "In Progress" },
  resolved: { bg: "var(--color-success-light)", fg: "var(--color-success)", label: "Resolved" },
  rejected: { bg: "var(--color-danger-light)", fg: "var(--color-danger)", label: "Rejected" },
};

export default function StatusBadge({ status }) {
  const s = STYLES[status] || STYLES.pending;
  return (
    <span className="badge" style={{ background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}
