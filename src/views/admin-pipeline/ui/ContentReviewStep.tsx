import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type {
  AdminCandidateArticle,
  GeneratedContent,
  TranslationTargetLanguageSelection,
} from '../model/types';
import { RichTextEditor } from '@/shared/ui/rich-text-editor/RichTextEditor';

interface ContentReviewStepProps {
  article: AdminCandidateArticle;
  content: GeneratedContent;
  targetLanguage: TranslationTargetLanguageSelection;
  onTargetLanguageChange: (language: TranslationTargetLanguageSelection) => void;
  onChange: (content: GeneratedContent) => void;
  onSaveDraft: () => void;
  saveStatus: 'idle' | 'saved' | 'dirty';
  isTranslating: boolean;
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
  isTranslating,
  onNext,
  onPrev,
}: ContentReviewStepProps) {
  const t = useTranslations('admin');
  const canGoNext = Boolean(targetLanguage);

  return (
    <section className="animate-fade-in">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            {t('reviewContentHeading')}
          </p>
          <h2 className="mt-1 text-xl font-black text-black">{t('reviewContentTitle')}</h2>
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-full border border-gray-400 px-2.5 py-1 text-xs font-bold text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
        >
          원문 보기
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
        </a>
      </div>

      <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-widest text-gray-700">
              {t('aiContentLabel')}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">{t('aiContentHint')}</p>
          </div>

          <div className="sm:w-40 sm:flex-shrink-0">
            <label>
              <span className="mb-1 block text-[11px] font-bold text-gray-500">
                {t('translateLang')}
              </span>
              <select
                value={targetLanguage}
                disabled={isTranslating}
                onChange={(event) =>
                  onTargetLanguageChange(event.target.value as TranslationTargetLanguageSelection)
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold outline-none transition-colors cursor-pointer focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">-</option>
                <option value="es">{t('esLang')}</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="block">
            <span className="mb-2 block text-xs font-bold text-gray-500">{t('titleLabel')}</span>
            <input
              value={content.title}
              disabled={isTranslating}
              onChange={(event) => onChange({ ...content, title: event.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold outline-none transition-colors focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>

          <div className="block">
            <span className="mb-2 block text-xs font-bold text-gray-500">{t('bodyLabel')}</span>
            <RichTextEditor
              value={content.body}
              onChange={(body) => onChange({ ...content, body })}
              minHeightClassName="min-h-[360px]"
              placeholder={t('koBodyPlaceholder')}
              disabled={isTranslating}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-xl border-2 border-gray-200 px-5 py-3 text-sm font-bold text-gray-500 transition-colors cursor-pointer hover:border-gray-400 hover:text-gray-700"
        >
          {t('prevStep')}
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          className="rounded-xl border-2 border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 transition-colors cursor-pointer hover:border-gray-400 hover:text-black"
        >
          {saveStatus === 'saved' ? t('savedDraft') : t('saveDraft')}
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
                  {t('noLangWarning')}
                </p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext || isTranslating}
            className="w-full rounded-xl bg-black px-5 py-3 text-sm font-black text-white transition-opacity cursor-pointer hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30 sm:w-auto"
          >
            {isTranslating ? t('aiTranslating') : t('nextStep')}
          </button>
        </div>
      </div>
    </section>
  );
}
