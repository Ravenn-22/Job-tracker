import { useState } from "react";
import "./OnboardingModal.css";

const steps = [
  {
    icon: "▤",
    title: "Track every application",
    desc: "Add jobs you've applied to and move them across your Kanban board as you progress through each stage.",
  },
  {
    icon: "◎",
    title: "Log your interviews",
    desc: "Record every interview round, who you spoke with, and the outcome — all attached to the application.",
  },
  {
    icon: "◷",
    title: "Never miss a follow-up",
    desc: "Set follow-up dates and deadlines on any application and Georn will email you a reminder automatically.",
  },
];

const OnboardingModal = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const current = steps[step];

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <div className="onboarding-icon">{current.icon}</div>
        <h2 className="onboarding-title">{current.title}</h2>
        <p className="onboarding-desc">{current.desc}</p>

        <div className="onboarding-dots">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`onboarding-dot ${i === step ? "onboarding-dot--active" : ""}`}
            />
          ))}
        </div>

        <div className="onboarding-actions">
          <button className="onboarding-skip" onClick={onClose}>
            Skip
          </button>
          <button className="onboarding-next" onClick={handleNext}>
            {step < steps.length - 1 ? "Next →" : "Get started →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;