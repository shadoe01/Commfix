import { useRef, useState } from "react";
import Button from "../../../components/Button.jsx";

/**
 * Combines "Image Capture/Upload" and "Photo Preview" from the Day 5 plan
 * into one step: pick a file, see a preview, Retake clears it, Use Photo
 * moves on. There's no real camera access here -- <input type="file"
 * accept="image/*" capture="environment"> opens the camera app on a phone
 * and a file picker on desktop, which is as close as a browser gets without
 * native code.
 */
export default function PhotoStep({ photo, onNext, onBack }) {
  const [preview, setPreview] = useState(photo);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG or PNG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image is larger than 5 MB. Choose a smaller photo.");
      return;
    }
    setError("");
    setPreview(URL.createObjectURL(file));
  }

  function retake() {
    setPreview(null);
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
            <Button block onClick={() => onNext(preview)}>Use Photo</Button>
          </div>
        </>
      ) : (
        <>
          <div className="file-drop" style={{ marginBottom: 16 }}>
            📷 Add a photo of the damage
            <div className="field-hint">JPG or PNG, up to 5 MB</div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
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
