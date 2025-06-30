
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
    <div className="w-[600px] h-[68px] relative mx-auto">
      {/* Progress steps without connecting lines */}
      <div className="flex justify-between items-center h-full">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-3">
            <div
              className={`flex items-center justify-center w-[38px] h-[38px] rounded-full ${
                step.active ? 'bg-violet-600' : 'bg-[#38383859]'
              }`}
            >
              <span className="font-semibold text-white text-sm">
                {step.id}
              </span>
            </div>
            <span
              className={`text-sm text-center ${
                step.active ? 'text-violet-600' : 'text-[#38383859]'
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
