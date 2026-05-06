import Image from 'next/image';
import {
  createMockArticleOriginalText,
  TRANSLATION_TARGET_LANGUAGES,
  type AdminCandidateArticle,
  type GeneratedContent,
  type TranslationTargetLanguageSelection,
} from '../model/mockArticles';
import { CATEGORIES_KO } from '@/entities/content';
import { RichTextEditor } from '@/shared/ui/rich-text-editor/RichTextEditor';

interface ContentReviewStepProps {
  article: AdminCandidateArticle;
  content: GeneratedContent;
  targetLanguage: TranslationTargetLanguageSelection;
  onTargetLanguageChange: (language: TranslationTargetLanguageSelection) => void;
  onChange: (content: GeneratedContent) => void;
  onSaveDraft: () => void;
  saveStatus: 'idle' | 'saved' | 'dirty';
  onNext: () => void;
  onPrev: () => void;
}

export function ContentReviewStep({
  article,
  content,
  targetLanguage,
  onTargetLanguageChange,
  onChange,
  onSaveDraft,
  saveStatus,
  onNext,
  onPrev,
}: ContentReviewStepProps) {
  const originalText = createMockArticleOriginalText(article);
  const canGoNext = Boolean(content.category && targetLanguage);

  return (
    <section className="animate-fade-in">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400">콘텐츠 검수</p>
        <h2 className="mt-1 text-xl font-black text-black">원문과 AI 생성 콘텐츠를 비교하세요</h2>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 lg:max-h-[720px] lg:overflow-y-auto">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">
              뉴스 원문
            </h3>
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-gray-400">
              읽기 전용
            </span>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-gray-200 px-2 py-1 text-xs font-bold text-gray-600">
              {article.source}
            </span>
            <span className="self-center text-xs text-gray-400">{article.date}</span>
          </div>

          <h3 className="mb-4 text-base font-black leading-snug text-black">{article.title}</h3>
          <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">{originalText}</p>
        </div>

        <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-sm lg:max-h-[720px] lg:overflow-y-auto">
          <div className="mb-5 flex flex-col gap-4 border-b border-gray-100 pb-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-gray-700">
                AI 생성 콘텐츠
              </p>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">
                원문과 같은 문장 구조나 표현이 반복되지 않도록 재구성하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:w-[320px] xl:flex-shrink-0">
              <label>
                <span className="mb-1 block text-[11px] font-bold text-gray-500">카테고리</span>
                <select
                  value={content.category}
                  onChange={(event) => onChange({ ...content, category: event.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold outline-none transition-colors cursor-pointer focus:border-black"
                >
                  <option value="">선택 없음</option>
                  {CATEGORIES_KO.filter((category) => category !== '전체').map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1 block text-[11px] font-bold text-gray-500">번역 언어</span>
                <select
                  value={targetLanguage}
                  onChange={(event) =>
                    onTargetLanguageChange(event.target.value as TranslationTargetLanguageSelection)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold outline-none transition-colors cursor-pointer focus:border-black"
                >
                  <option value="">선택 없음</option>
                  {TRANSLATION_TARGET_LANGUAGES.map((language) => (
                    <option key={language.code} value={language.code}>
                      {language.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-gray-500">제목</span>
              <input
                value={content.title}
                onChange={(event) => onChange({ ...content, title: event.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold outline-none transition-colors focus:border-black"
              />
            </label>

            <div className="block">
              <span className="mb-2 block text-xs font-bold text-gray-500">본문</span>
              <RichTextEditor
                value={content.body}
                onChange={(body) => onChange({ ...content, body })}
                minHeightClassName="min-h-[360px]"
                placeholder="한국어 콘텐츠 본문"
              />
            </div>
          </div>
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
        <div className="group relative">
          {!canGoNext && (
            <div className="mb-2 rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-sm sm:pointer-events-none sm:absolute sm:bottom-full sm:right-0 sm:z-20 sm:mb-3 sm:w-64 sm:translate-y-1 sm:opacity-0 sm:shadow-lg sm:transition-all sm:duration-150 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/characters/mascot-cheer.png"
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 flex-shrink-0 object-contain"
                />
                <p className="text-xs font-bold leading-relaxed text-gray-700">
                  카테고리와 번역할 언어를 모두 선택해주세요.
                </p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="w-full rounded-xl bg-black px-5 py-3 text-sm font-black text-white transition-opacity cursor-pointer hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30 sm:w-auto"
          >
            다음 단계
          </button>
        </div>
      </div>
    </section>
  );
}
