import { useState } from "react";
import Button from "../../../components/Button.jsx";
import LoadingState from "../../../components/LoadingState.jsx";

export default function ReviewStep({ report, onEdit, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit() {
    setSubmitting(true);
    // Placeholder: will call services/api.js submitReport() once the backend exists.
    setTimeout(() => onSubmit(), 1000);
  }

  if (submitting) {
    return <LoadingState title="Submitting report..." hint="This will only take a moment." />;
  }

  return (
    <>
      <div className="photo-preview-box" style={{ aspectRatio: "16 / 9" }}>
        {report.photo ? <img src={report.photo} alt="Damage" /> : "No photo"}
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="review-row"><span className="label">Facility</span><span className="value">{report.facility}</span></div>
        <div className="review-row"><span className="label">Category</span><span className="value">{report.category}</span></div>
        <div className="review-row"><span className="label">Location</span><span className="value">{report.location}</span></div>
        <div className="review-row"><span className="label">Description</span><span className="value">{report.description}</span></div>
        <div className="review-row"><span className="label">AI assessment</span><span className="value">{report.ai?.type} · {report.ai?.confidence}%</span></div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <Button variant="secondary" block onClick={onEdit}>Edit</Button>
        <Button block onClick={handleSubmit}>Submit Report</Button>
      </div>
    </>
  );
}
