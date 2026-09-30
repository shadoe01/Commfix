export default function FlowProgress({ step, total }) {
  return (
    <div className="flow-progress">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={i < step ? "done" : ""} />
      ))}
    </div>
  );
}
