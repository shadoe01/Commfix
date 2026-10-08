import { useState } from "react";
import FlowProgress from "./report-flow/FlowProgress.jsx";
import DetailsStep from "./report-flow/DetailsStep.jsx";
import PhotoStep from "./report-flow/PhotoStep.jsx";
import AIProcessingStep from "./report-flow/AIProcessingStep.jsx";
import AIResultStep from "./report-flow/AIResultStep.jsx";
import ReviewStep from "./report-flow/ReviewStep.jsx";
import SuccessStep from "./report-flow/SuccessStep.jsx";

// The steps described in the Day 5 plan (details -> photo -> AI processing ->
// AI result -> review -> success) are UI states within ONE screen, not
// separate routes -- matching the blueprint's note that these don't need to
// be ten completely separate pages.
const STEPS = ["details", "photo", "analyzing", "result", "review", "success"];

const EMPTY_REPORT = { facility: "", category: "", location: "", description: "", photo: null, photoFile: null, ai: null };

export default function ReportDamage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [report, setReport] = useState(EMPTY_REPORT);
  const step = STEPS[stepIndex];

  function goTo(index) {
    setStepIndex(index);
  }

  function handleDetailsNext(form) {
    setReport((r) => ({ ...r, ...form }));
    goTo(1);
  }

  function handlePhotoNext(photoFile, photo) {
    setReport((r) => ({ ...r, photo, photoFile }));
    goTo(2);
  }

  function handleAIDone() {
    goTo(3);
  }

  function handleAIResultNext(ai) {
    setReport((r) => ({ ...r, ai }));
    goTo(4);
  }

  function handleSubmitted(reportId, photoFailed) {
    setReport((r) => ({ ...r, id: reportId, photoFailed }));
    goTo(5);
  }

  const titles = {
    details: "Report Community Facility Damage",
    photo: "Add Damage Photo",
    analyzing: "",
    result: "AI Assessment",
    review: "Review Your Report",
    success: "",
  };

  const showProgress = step !== "success";
  // Steps up to and including "review" count toward the progress bar;
  // "analyzing" is a brief transition, not something the resident acts on.
  const progressStep = { details: 1, photo: 2, analyzing: 2, result: 3, review: 4 }[step] || 0;

  return (
    <>
      {titles[step] && (
        <div className="page-header">
          <h1>{titles[step]}</h1>
        </div>
      )}
      {showProgress && <FlowProgress step={progressStep} total={4} />}

      <div style={{ maxWidth: 480 }}>
        {step === "details" && <DetailsStep data={report} onNext={handleDetailsNext} />}
        {step === "photo" && <PhotoStep photo={report.photo} photoFile={report.photoFile} onNext={handlePhotoNext} onBack={() => goTo(0)} />}
        {step === "analyzing" && <AIProcessingStep onDone={handleAIDone} />}
        {step === "result" && <AIResultStep onNext={handleAIResultNext} />}
        {step === "review" && <ReviewStep report={report} onEdit={() => goTo(0)} onSubmit={handleSubmitted} />}
        {step === "success" && <SuccessStep reportId={report.id} photoFailed={report.photoFailed} />}
      </div>
    </>
  );
}
