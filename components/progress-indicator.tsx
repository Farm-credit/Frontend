"use client";

/**
 * Progress Indicator - Multi-step donation flow progress tracker
 */

import React from "react";

interface Step {
  label: string;
  status: "complete" | "current" | "upcoming";
}

interface ProgressIndicatorProps {
  currentStep: number; // 1-4
}

export default function ProgressIndicator({
  currentStep,
}: ProgressIndicatorProps) {
  const steps: Step[] = [
    {
      label: "Amount",
      status:
        currentStep > 1
          ? "complete"
          : currentStep === 1
            ? "current"
            : "upcoming",
    },
    {
      label: "Confirm",
      status:
        currentStep > 2
          ? "complete"
          : currentStep === 2
            ? "current"
            : "upcoming",
    },
    {
      label: "Processing",
      status:
        currentStep > 3
          ? "complete"
          : currentStep === 3
            ? "current"
            : "upcoming",
    },
    {
      label: "Success",
      status: currentStep === 4 ? "complete" : "upcoming",
    },
  ];

  return (
    <div className="w-full py-6">
      <div className="max-w-3xl mx-auto">
        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.label}>
                {/* Step */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step.status === "complete"
                        ? "bg-green-600 text-white"
                        : step.status === "current"
                          ? "bg-green-600 text-white ring-4 ring-green-200"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.status === "complete" ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      step.status === "current"
                        ? "text-green-600"
                        : step.status === "complete"
                          ? "text-gray-900"
                          : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition-all ${
                      steps[index + 1].status === "complete" ||
                      step.status === "complete"
                        ? "bg-green-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div
                key={step.label}
                className={`flex-1 h-2 rounded-full transition-all ${
                  step.status === "complete"
                    ? "bg-green-600"
                    : step.status === "current"
                      ? "bg-green-400"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mt-3">
            Step {currentStep} of {steps.length}:{" "}
            {steps[currentStep - 1]?.label}
          </p>
        </div>
      </div>
    </div>
  );
}