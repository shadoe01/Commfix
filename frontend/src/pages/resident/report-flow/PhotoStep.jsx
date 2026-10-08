import { useRef, useState } from "react";
import Button from "../../../components/Button.jsx";
import { ALLOWED_IMAGE_TYPES, validateImageFile } from "../../../utils/imageRules.js";

/**
 * Combines "Image Capture/Upload" and "Photo Preview" from the Day 5 plan
 * into one step. Day 12 change: this now hands the real File object up
 * to the parent (via onNext(file, previewUrl)), not just a preview
 * string -- the actual upload happens later, in ReviewStep, once the
 * report has been created and has a real id to attach the photo to.
 */
export default function PhotoStep({ photo, photoFile, onNext, onBack }) {
  const [preview, setPreview] = useState(photo);
  const [file, setFile] = useState(photoFile || null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  function handleFile(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    // Same rules the backend enforces again (utils/imageRules.js) -- this
    // is just the faster, friendlier first line of defense.
    const problem = validateImageFile(selected);
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function retake() {
    setPreview(null);
    setFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <>
      {preview ? (
        <>
          <div className="photo-preview-box">
            <img src={preview} alt="Selected damage" />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Button variant="secondary" block onClick={retake}>Retake</Button>
            <Button block onClick={() => onNext(file, preview)}>Use Photo</Button>
          </div>
        </>
      ) : (
        <>
          <div className="file-drop" style={{ marginBottom: 16 }}>
            📷 Add a photo of the damage
            <div className="field-hint">JPEG, PNG, or WebP, up to 5 MB</div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            capture="environment"
            onChange={handleFile}
            style={{ marginBottom: 16 }}
          />
          {error && <div className="form-banner-error">{error}</div>}
          <Button variant="secondary" block onClick={onBack}>Back</Button>
        </>
      )}
    </>
  );
}
