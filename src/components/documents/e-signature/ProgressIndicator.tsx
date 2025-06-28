
import React from 'react';

interface ProgressStep {
  id: number;
  label: string;
  active: boolean;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ steps }) => {
  return (
    <div className="w-full max-w-2xl relative">
      {/* Progress steps */}
      <div className="flex justify-between items-center relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 -translate-y-1/2 z-0"></div>
        
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center gap-3 relative z-10">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white ${
                step.active 
                  ? "border-violet-600 bg-violet-600" 
                  : "border-gray-300"
              }`}
            >
              <span className={`font-semibold text-sm ${
                step.active ? "text-white" : "text-gray-500"
              }`}>
                {step.id}
              </span>
            </div>
            <span
              className={`text-sm text-center max-w-24 ${
                step.active ? "text-violet-600 font-medium" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
