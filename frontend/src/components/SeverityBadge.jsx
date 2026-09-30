const STYLES = {
  low: { bg: "var(--color-success-light)", fg: "var(--color-success)", label: "Low" },
  moderate: { bg: "var(--color-warning-light)", fg: "#9A5B12", label: "Moderate" },
  severe: { bg: "var(--color-danger-light)", fg: "var(--color-danger)", label: "Severe" },
};

export default function SeverityBadge({ severity }) {
  const s = STYLES[severity] || STYLES.low;
  return (
    <span className="badge" style={{ background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}
