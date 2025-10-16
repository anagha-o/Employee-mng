import React from 'react';

interface StepperProgressProps {
  steps: string[];
  currentStep: number; // 1-based index
}

export const StepperProgress: React.FC<StepperProgressProps> = ({ steps, currentStep }) => {
  const total = steps.length;
  const clampedCurrent = Math.min(Math.max(currentStep, 1), total);
  const progressPercent = ((clampedCurrent - 1) / (total - 1)) * 100;

  return (
    <div className="space-y-3">
      <div className="relative h-2 w-full rounded-full bg-muted">
        <div
          className="absolute left-0 top-0 h-2 rounded-full bg-primary transition-all"
          style={{ width: `${isFinite(progressPercent) ? progressPercent : 0}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {steps.map((label, index) => {
          const stepIndex = index + 1;
          const isActive = stepIndex === clampedCurrent;
          const isCompleted = stepIndex < clampedCurrent;
          return (
            <div key={label} className="flex min-w-0 flex-col items-center gap-1">
              <div
                className={
                  "flex h-6 w-6 items-center justify-center rounded-full border text-[11px] " +
                  (isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isActive
                    ? "border-primary text-primary"
                    : "border-muted-foreground/30 text-muted-foreground")
                }
              >
                {stepIndex}
              </div>
              <div className={"truncate " + (isActive ? "text-foreground" : "")}>{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepperProgress;


