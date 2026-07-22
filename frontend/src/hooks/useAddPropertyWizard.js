import { useState } from 'react';

export const useAddPropertyWizard = (initialStep = 1, maxSteps = 5) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, maxSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const goToStep = (step) => setCurrentStep(Math.max(1, Math.min(step, maxSteps)));

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === maxSteps,
  };
};
