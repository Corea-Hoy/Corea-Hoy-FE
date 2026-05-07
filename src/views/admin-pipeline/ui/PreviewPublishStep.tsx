import { useMemo, useState } from 'react';
import { sanitizeRichTextHtml } from '@/shared/ui/rich-text-editor/sanitizeRichTextHtml';

interface PreviewData {
  koTitle: string;
  koBody: string;
  translatedTitle: string;
  translatedBody: string;
}

interface PreviewPublishStepProps {
  previewData: PreviewData;
  isPublished: boolean;
  onSaveDraft: () => void;
  saveStatus: 'idle' | 'saved' | 'dirty';
  onPublish: () => void;
  onPrev: () => void;
}

function getInitialPreviewLanguage(): 'ko' | 'translated' {
  if (typeof window === 'undefined') return 'translated';

  const saved = sessionStorage.getItem('coreahoy-preview-language');
  return saved === 'ko' || saved === 'translated' ? saved : 'translated';
}

export function PreviewPublishStep({
  previewData,
  isPublished,
  onSaveDraft,
  saveStatus,
  onPublish,
  onPrev,
}: PreviewPublishStepProps) {
  const [previewLanguage, setPreviewLanguage] = useState<'ko' | 'translated'>(
    getInitialPreviewLanguage,
  );

  const handlePreviewLanguageChange = (lang: 'ko' | 'translated') => {
    setPreviewLanguage(lang);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('coreahoy-preview-language', lang);
    }
  };
  const visibleTitle = previewLanguage === 'ko' ? previewData.koTitle : previewData.translatedTitle;
  const visibleBody = previewLanguage === 'ko' ? previewData.koBody : previewData.translatedBody;
  const sanitizedVisibleBody = useMemo(() => sanitizeRichTextHtml(visibleBody), [visibleBody]);

  return (
    <section className="animate-fade-in">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            미리보기 및 발행
          </p>
          <h2 className="mt-1 text-xl font-black text-black">발행 전 콘텐츠를 확인하세요</h2>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-bold text-gray-500">콘텐츠 언어 미리보기</p>
          <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => handlePreviewLanguageChange('ko')}
              className={`rounded-lg px-4 py-2 text-xs font-black transition-colors cursor-pointer ${
                previewLanguage === 'ko'
                  ? 'bg-black text-white'
                  : 'text-gray-400 hover:bg-white hover:text-gray-700'
              }`}
            >
              한국어 원문
            </button>
            <button
              type="button"
              onClick={() => handlePreviewLanguageChange('translated')}
              className={`rounded-lg px-4 py-2 text-xs font-black transition-colors cursor-pointer ${
                previewLanguage === 'translated'
                  ? 'bg-black text-white'
                  : 'text-gray-400 hover:bg-white hover:text-gray-700'
              }`}
            >
              번역본
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_1fr]">
        <div className="rounded-[2rem] border-8 border-gray-900 bg-white p-4 shadow-sm">
          <article className="min-h-[520px] rounded-2xl bg-white">
            <h3 className="text-2xl font-black leading-tight text-black">{visibleTitle}</h3>
            <div
              className="rich-text-renderer mt-5 text-sm leading-7 text-gray-700"
              dangerouslySetInnerHTML={{ __html: sanitizedVisibleBody }}
            />
          </article>
        </div>

        <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-3xl font-black leading-tight text-black">{visibleTitle}</h3>
          <div
            className="rich-text-renderer mt-6 text-sm leading-8 text-gray-700"
            dangerouslySetInnerHTML={{ __html: sanitizedVisibleBody }}
          />
        </article>
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
          onClick={onPublish}
          disabled={isPublished}
          className="rounded-xl bg-black px-5 py-3 text-sm font-black text-white transition-opacity cursor-pointer hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isPublished ? '발행 완료' : '발행하기'}
        </button>
      </div>
    </section>
  );
}
