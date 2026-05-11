interface WorkflowControlPanelProps {
  hasSelectedArticle: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
  onSaveDraft: () => void;
  saveStatus: 'idle' | 'saved' | 'dirty';
}

export function WorkflowControlPanel({
  hasSelectedArticle,
  isGenerating,
  onGenerate,
  onSaveDraft,
  saveStatus,
}: WorkflowControlPanelProps) {
  return (
    <aside className="mt-6 lg:mt-0">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <h2 className="mb-5 text-sm font-black text-black">워크플로우 제어</h2>
        <button
          type="button"
          disabled={!hasSelectedArticle || isGenerating}
          onClick={onGenerate}
          className="w-full rounded-xl bg-black py-3.5 text-sm font-bold text-white transition-[opacity,border-color,color,background-color] duration-150 cursor-pointer hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isGenerating ? 'AI 생성 중...' : 'AI 콘텐츠 생성'}
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={!hasSelectedArticle}
          className="mt-2 w-full rounded-xl border-2 border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-600 transition-[opacity,border-color,color,background-color] duration-150 cursor-pointer hover:border-gray-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
        >
          {saveStatus === 'saved' ? '저장됨' : '임시저장'}
        </button>
      </div>
    </aside>
  );
}
