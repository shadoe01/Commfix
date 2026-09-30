export default function LoadingState({ title = "Loading...", hint }) {
  return (
    <div className="loading-state">
      <div className="spinner" aria-hidden="true" />
      <h3>{title}</h3>
      {hint && <p>{hint}</p>}
    </div>
  );
}
