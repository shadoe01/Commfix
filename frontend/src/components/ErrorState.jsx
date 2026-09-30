import Button from "./Button.jsx";

export default function ErrorState({ title = "Something went wrong.", hint = "Please try again.", onRetry }) {
  return (
    <div className="empty-state error-state">
      <h3>{title}</h3>
      <p>{hint}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Retry</Button>}
    </div>
  );
}
