import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "../../components/Button.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import SeverityBadge from "../../components/SeverityBadge.jsx";
import StatusStepper from "../../components/StatusStepper.jsx";
import LoadingState from "../../components/LoadingState.jsx";
import ErrorState from "../../components/ErrorState.jsx";
import AuthImage from "../../components/AuthImage.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getReport, uploadReportImage, deleteReportImage } from "../../services/api.js";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGES_PER_REPORT, validateImageFile } from "../../utils/imageRules.js";

export default function ReportDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [busy, setBusy] = useState(false); // an upload or removal is in flight
  const inputRef = useRef(null);

  // silent = refresh the data without flashing the whole page back to "Loading..."
  function load(silent = false) {
    setError("");
    if (!silent) setReport(null);
    getReport(id, token)
      .then(setReport)
      .catch((err) => setError(err.message || "Couldn't load this report."));
  }
  useEffect(() => { load(); }, [id, token]);

  async function handleAddPhoto(e) {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = ""; // allow re-picking the same file after an error
    if (!file) return;

    const problem = validateImageFile(file);
    if (problem) {
      setPhotoError(problem);
      return;
    }

    setPhotoError("");
    setBusy(true);
    try {
      await uploadReportImage(report.report_id, file, token);
      load(true);
    } catch (err) {
      // Includes "This photo is already attached to the report." if the
      // same file is picked twice -- the backend refuses the duplicate.
      setPhotoError(err.message || "Photo upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemovePhoto(imageId) {
    if (!window.confirm("Remove this photo?")) return;
    setPhotoError("");
    setBusy(true);
    try {
      await deleteReportImage(report.report_id, imageId, token);
      load(true);
    } catch (err) {
      setPhotoError(err.message || "Couldn't remove the photo. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // The backend refuses these once the report leaves "pending" -- hiding
  // the buttons here is just so residents aren't offered something that
  // will be rejected. The backend rule is what actually enforces it.
  const canEditPhotos = report?.status === "pending";
  const atPhotoLimit = (report?.images?.length ?? 0) >= MAX_IMAGES_PER_REPORT;

  if (error && !report) {
    return <ErrorState onRetry={() => load()} title="Couldn't load this report." hint={error} />;
  }
  if (!report) {
    return <LoadingState title="Loading report..." />;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Report #{report.report_id}</h1>
          <p>Submitted {new Date(report.created_at).toLocaleString()}</p>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div className="card">
        <h3>Progress</h3>
        <StatusStepper status={report.status} />
      </div>

      <div className="card">
        <h3>Details</h3>
        <p><strong>Facility:</strong> {report.facility_name}</p>
        <p><strong>Category:</strong> {report.category || "—"}</p>
        <p><strong>Location:</strong> {report.location}</p>
        <p><strong>Description:</strong> {report.description}</p>
      </div>

      <div className="card">
        <h3>Attached Photos</h3>
        {photoError && <div className="form-banner-error">{photoError}</div>}

        {report.images?.length > 0 ? (
          report.images.map((img, i) => (
            <div key={img.image_id}>
              <div className="photo-preview-box">
                <AuthImage reportId={report.report_id} imageId={img.image_id} alt={`Damage photo ${i + 1}`} failedText={`Photo ${i + 1} could not be loaded`} />
              </div>
              {canEditPhotos && (
                <div className="photo-actions">
                  <Button variant="secondary" disabled={busy} onClick={() => handleRemovePhoto(img.image_id)}>
                    Remove photo {i + 1}
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No photos attached.</p>
        )}

        {canEditPhotos && !atPhotoLimit && (
          <div className="field" style={{ marginTop: 16 }}>
            <label htmlFor="add-photo">{report.images?.length ? "Add another photo" : "Add a photo"}</label>
            <input
              id="add-photo"
              ref={inputRef}
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(",")}
              disabled={busy}
              onChange={handleAddPhoto}
            />
            <div className="field-hint">
              {busy ? "Working..." : `JPEG, PNG, or WebP, up to 5 MB. Up to ${MAX_IMAGES_PER_REPORT} photos per report.`}
            </div>
          </div>
        )}
        {canEditPhotos && atPhotoLimit && <p className="field-hint">This report has the maximum of {MAX_IMAGES_PER_REPORT} photos.</p>}
        {!canEditPhotos && <p className="field-hint">Photos can't be changed once a report is under review.</p>}
      </div>

      <div className="card">
        <h3>AI Assessment</h3>
        {report.severity ? (
          <p><strong>Severity:</strong> <SeverityBadge severity={report.severity} /></p>
        ) : (
          <p>Not yet analyzed. AI assessment is a later phase of the project.</p>
        )}
      </div>

      <Link to="/my-reports" className="btn btn-secondary">Back to My Reports</Link>
    </>
  );
}
