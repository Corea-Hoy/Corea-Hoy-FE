import { type TranslatedContent } from '../model/mockArticles';

interface TranslationReviewStepProps {
  content: TranslatedContent;
  onChange: (content: TranslatedContent) => void;
  onSaveDraft: () => void;
  saveStatus: 'idle' | 'saved' | 'dirty';
  onNext: () => void;
  onPrev: () => void;
}

export function TranslationReviewStep({
  content,
  onChange,
  onSaveDraft,
  saveStatus,
  onNext,
  onPrev,
}: TranslationReviewStepProps) {
  return (
    <section className="animate-fade-in">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400">번역 검수</p>
        <h2 className="mt-1 text-xl font-black text-black">원문과 번역문을 확인하세요</h2>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-gray-500">
            한국어 원문
          </h3>
          <label className="block">
            <span className="mb-2 block text-xs font-bold text-gray-500">제목</span>
            <input
              value={content.koTitle}
              onChange={(event) => onChange({ ...content, koTitle: event.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold outline-none transition-colors focus:border-black"
            />
          </label>
          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-bold text-gray-500">본문</span>
            <textarea
              value={content.koBody}
              onChange={(event) => onChange({ ...content, koBody: event.target.value })}
              rows={14}
              className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 outline-none transition-colors focus:border-black"
            />
          </label>
        </div>

        <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-gray-700">
            스페인어 번역문
          </h3>
          <label className="block">
            <span className="mb-2 block text-xs font-bold text-gray-500">제목</span>
            <input
              value={content.esTitle}
              onChange={(event) => onChange({ ...content, esTitle: event.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold outline-none transition-colors focus:border-black"
            />
          </label>
          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-bold text-gray-500">본문</span>
            <textarea
              value={content.esBody}
              onChange={(event) => onChange({ ...content, esBody: event.target.value })}
              rows={14}
              className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm leading-7 outline-none transition-colors focus:border-black"
            />
          </label>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-xl border-2 border-gray-200 px-5 py-3 text-sm font-bold text-gray-500 transition-colors cursor-pointer hover:border-gray-400 hover:text-gray-700"
        >
          이전 단계
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          className="rounded-xl border-2 border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 transition-colors cursor-pointer hover:border-gray-400 hover:text-black"
        >
          {saveStatus === 'saved' ? '저장됨' : '임시저장'}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-black px-5 py-3 text-sm font-black text-white transition-opacity cursor-pointer hover:opacity-80"
        >
          다음 단계
        </button>
      </div>
    </section>
  );
}
