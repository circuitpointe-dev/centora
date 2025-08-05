import React from "react";

interface RegistrationStepperProps {
  currentStep: number;
}

const RegistrationStepper = ({ currentStep }: RegistrationStepperProps) => {
  const steps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Modules" },
    { number: 3, title: "Pricing" },
    { number: 4, title: "Confirm" },
  ];

  return (
    <div className="flex items-center justify-between">
      {steps.map((step) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step.number
                  ? "bg-violet-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step.number}
            </div>
            <span className="text-xs mt-1 text-gray-600">{step.title}</span>
          </div>
          {step.number < steps.length && (
            <div
              className={`flex-1 h-0.5 mx-2 ${
                currentStep > step.number ? "bg-violet-600" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default RegistrationStepper;
