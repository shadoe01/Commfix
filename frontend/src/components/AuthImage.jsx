import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchReportImage } from "../services/api.js";

/**
 * Shows a report photo. The backend only serves photos to logged-in users
 * who are allowed to see that report, so a plain <img src> won't work --
 * this fetches the image with the login token first.
 * Renders just the <img> (or a short text message while loading / on
 * failure); the parent supplies the sized container.
 */
export default function AuthImage({ reportId, imageId, alt, failedText = "Photo could not be loaded" }) {
  const { token } = useAuth();
  const [src, setSrc] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = null;
    setSrc(null);
    setFailed(false);

    fetchReportImage(reportId, imageId, token)
      .then((url) => {
        if (cancelled) URL.revokeObjectURL(url);
        else { objectUrl = url; setSrc(url); }
      })
      .catch(() => { if (!cancelled) setFailed(true); });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl); // free the temporary blob URL
    };
  }, [reportId, imageId, token]);

  if (failed) return <span className="photo-fallback">{failedText}</span>;
  if (!src) return <span className="photo-fallback">Loading photo...</span>;
  return <img src={src} alt={alt} />;
}
