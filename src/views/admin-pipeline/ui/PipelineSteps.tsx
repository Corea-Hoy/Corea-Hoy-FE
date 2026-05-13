import { useTranslations } from 'next-intl';
import { PIPELINE_STEPS } from '../model/labels';
import type { PipelineStep } from '../model/types';

interface PipelineStepsProps {
  currentStep: PipelineStep;
  canNavigateToStep: (step: PipelineStep) => boolean;
  onStepChange: (step: PipelineStep) => void;
}

export function PipelineSteps({
  currentStep,
  canNavigateToStep,
  onStepChange,
}: PipelineStepsProps) {
  const t = useTranslations('admin');
  const currentIndex = PIPELINE_STEPS.findIndex((step) => step.id === currentStep);

  const stepLabels: Record<PipelineStep, string> = {
    'select-article': t('step1Label'),
    'review-content': t('step2Label'),
    'review-translation': t('step3Label'),
    preview: t('step4Label'),
  };

  return (
    <ol className="mb-7 flex gap-2 overflow-x-auto pb-1" aria-label={t('pipelineStepsAriaLabel')}>
      {PIPELINE_STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isComplete = index < currentIndex;
        const canNavigate = canNavigateToStep(step.id);

        return (
          <li key={step.id} className="flex-shrink-0">
            <button
              type="button"
              aria-current={isActive ? 'step' : undefined}
              disabled={!canNavigate}
              onClick={() => onStepChange(step.id)}
              className={`rounded-xl border px-4 py-2 text-xs font-extrabold whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-black bg-black text-white'
                  : isComplete
                    ? 'border-gray-300 bg-gray-50 text-gray-700 hover:border-black hover:text-black'
                    : canNavigate
                      ? 'border-gray-200 bg-white text-gray-500 hover:border-black hover:text-black'
                      : 'border-gray-100 bg-white text-gray-300'
              } ${canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              {step.number}. {stepLabels[step.id]}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
