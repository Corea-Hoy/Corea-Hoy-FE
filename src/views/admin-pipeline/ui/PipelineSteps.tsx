import type { PipelineStep } from '../model/mockArticles';

const PIPELINE_STEPS = [
  { id: 'select-article', number: 1, label: '기사 선택' },
  { id: 'review-content', number: 2, label: '콘텐츠 검수' },
  { id: 'review-translation', number: 3, label: '번역 검수' },
  { id: 'preview', number: 4, label: '미리보기' },
] satisfies { id: PipelineStep; number: number; label: string }[];

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
  const currentIndex = PIPELINE_STEPS.findIndex((step) => step.id === currentStep);

  return (
    <ol className="mb-7 flex gap-2 overflow-x-auto pb-1" aria-label="파이프라인 단계">
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
              {step.number}. {step.label}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
