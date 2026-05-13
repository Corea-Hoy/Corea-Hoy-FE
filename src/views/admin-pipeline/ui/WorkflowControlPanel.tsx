import { useTranslations } from 'next-intl';

interface WorkflowControlPanelProps {
  hasSelectedArticle: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function WorkflowControlPanel({
  hasSelectedArticle,
  isGenerating,
  onGenerate,
}: WorkflowControlPanelProps) {
  const t = useTranslations('admin');

  return (
    <aside className="mt-6 lg:mt-0">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <h2 className="mb-5 text-sm font-black text-black">{t('workflowTitle')}</h2>
        <button
          type="button"
          disabled={!hasSelectedArticle || isGenerating}
          onClick={onGenerate}
          className="w-full rounded-xl bg-black py-3.5 text-sm font-bold text-white transition-[opacity,border-color,color,background-color] duration-150 cursor-pointer hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isGenerating ? t('aiGenerating') : t('aiGenerate')}
        </button>
      </div>
    </aside>
  );
}
