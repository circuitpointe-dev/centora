
import React from "react";

interface ProgressStepsProps {
  currentStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Upload or Paste Donor Call" },
    { number: 2, label: "Select Base Proposal" },
    { number: 3, label: "Proposal Generation" },
    { number: 4, label: "Review & Finalize" }
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((stepItem, index) => (
        <div key={stepItem.number} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= stepItem.number
                  ? "bg-violet-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {stepItem.number}
            </div>
            <p className={`text-xs text-center max-w-[120px] ${
              currentStep >= stepItem.number ? "text-violet-600" : "text-gray-400"
            }`}>
              {stepItem.label}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-[150px] h-px mx-4 ${
                currentStep > stepItem.number ? "bg-violet-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;
