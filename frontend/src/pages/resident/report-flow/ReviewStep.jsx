import { useState } from "react";
import Button from "../../../components/Button.jsx";
import LoadingState from "../../../components/LoadingState.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { submitReport, uploadReportImage } from "../../../services/api.js";

export default function ReviewStep({ report, onEdit, onSubmit }) {
  const { token } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    // Step 1: create the report. If THIS fails, nothing was saved, so it's
    // safe to show the error and let the resident try again.
    let saved;
    try {
      // No resident_id/user_id sent -- the backend derives who's
      // submitting from the auth token, never from the client.
      saved = await submitReport(
        {
          facility: report.facility,
          category: report.category,
          location: report.location,
          description: report.description,
        },
        token
      );
    } catch (err) {
      setError(err.message || "Something went wrong while saving your report. Please try again.");
      setSubmitting(false);
      return;
    }

    // Step 2: attach the photo to the report we just created. If THIS
    // fails, the report itself is already saved -- retrying the whole
    // submit would create a duplicate report, so instead we move on and
    // flag the photo problem on the success screen (photoFailed).
    let photoFailed = false;
    if (report.photoFile) {
      try {
        await uploadReportImage(saved.report_id, report.photoFile, token);
      } catch (err) {
        photoFailed = true;
      }
    }

    onSubmit(saved.report_id, photoFailed);
  }

  if (submitting) {
    return <LoadingState title="Submitting report..." hint="Saving your report and photo. This will only take a moment." />;
  }

  return (
    <>
      <div className="photo-preview-box" style={{ aspectRatio: "16 / 9" }}>
        {report.photo ? <img src={report.photo} alt="Damage" /> : "No photo"}
      </div>
      {error && <div className="form-banner-error">{error}</div>}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="review-row"><span className="label">Facility</span><span className="value">{report.facility}</span></div>
        <div className="review-row"><span className="label">Category</span><span className="value">{report.category}</span></div>
        <div className="review-row"><span className="label">Location</span><span className="value">{report.location}</span></div>
        <div className="review-row"><span className="label">Description</span><span className="value">{report.description}</span></div>
        <div className="review-row"><span className="label">AI assessment</span><span className="value">Not yet analyzed</span></div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <Button variant="secondary" block onClick={onEdit}>Edit</Button>
        <Button block onClick={handleSubmit}>Submit Report</Button>
      </div>
    </>
  );
}
