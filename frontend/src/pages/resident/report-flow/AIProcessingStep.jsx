import { useEffect } from "react";
import LoadingState from "../../../components/LoadingState.jsx";

export default function AIProcessingStep({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <LoadingState
      title="Analyzing image..."
      hint="Please wait while Commfix looks at the uploaded photo."
    />
  );
}
