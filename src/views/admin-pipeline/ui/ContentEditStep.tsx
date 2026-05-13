'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { RichTextEditor } from '@/shared/ui/rich-text-editor/RichTextEditor';
import { getNewsDetail } from '@/features/article/api/article.api';

export interface EditFormData {
  titleKo: string;
  bodyKo: string;
  titleEs: string;
  bodyEs: string;
}

interface ContentEditStepProps {
  articleId: string;
  isSaving: boolean;
  onSave: (data: EditFormData) => Promise<void>;
  onCancel: () => void;
}

export function ContentEditStep({ articleId, isSaving, onSave, onCancel }: ContentEditStepProps) {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<EditFormData>({
    titleKo: '',
    bodyKo: '',
    titleEs: '',
    bodyEs: '',
  });

  const [prevArticleId, setPrevArticleId] = useState(articleId);

  if (articleId !== prevArticleId) {
    setPrevArticleId(articleId);
    setIsLoading(true);
    setError(null);
  }

  useEffect(() => {
    getNewsDetail(articleId)
      .then((data) => {
        setForm({
          titleKo: data.titleKo ?? '',
          bodyKo: data.bodyKo ?? '',
          titleEs: data.titleEs ?? '',
          bodyEs: data.bodyEs ?? '',
        });
      })
      .catch((err) => {
        console.error('Failed to fetch article detail:', err);
        setError(t('fetchError') ?? '콘텐츠를 불러오는 중 오류가 발생했습니다.');
      })
      .finally(() => setIsLoading(false));
  }, [articleId, t]);

  if (isLoading) {
    return (
      <div className="animate-fade-in flex flex-col gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="h-96 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="text-sm font-bold text-red-500">{error}</p>
        <button
          type="button"
          onClick={onCancel}
          className="mt-4 rounded-xl border border-red-200 px-6 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
        >
          {tCommon('cancel')}
        </button>
      </div>
    );
  }

  return (
    <section className="animate-fade-in">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            {t('editTitle')}
          </p>
          <h2 className="mt-1 text-xl font-black text-black">{t('editSubtitle')}</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-xl border-2 border-gray-200 px-5 py-3 text-sm font-bold text-gray-500 transition-colors cursor-pointer hover:border-gray-400 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {tCommon('cancel')}
          </button>
          <button
            type="button"
            onClick={() => onSave(form)}
            disabled={isSaving}
            className="rounded-xl bg-black px-5 py-3 text-sm font-black text-white transition-opacity cursor-pointer hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {isSaving ? t('editSaving') : t('editSave')}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-sm">
          <p className="mb-4 border-b border-gray-100 pb-3 text-xs font-black uppercase tracking-widest text-gray-700">
            {t('editLangKo')}
          </p>
          <div className="flex flex-col gap-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-gray-500">{t('titleLabel')}</span>
              <input
                value={form.titleKo}
                onChange={(e) => setForm((prev) => ({ ...prev, titleKo: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold outline-none transition-colors focus:border-black"
              />
            </label>
            <div>
              <span className="mb-2 block text-xs font-bold text-gray-500">{t('bodyLabel')}</span>
              <RichTextEditor
                value={form.bodyKo}
                onChange={(bodyKo) => setForm((prev) => ({ ...prev, bodyKo }))}
                minHeightClassName="min-h-[360px]"
                placeholder={t('koBodyPlaceholder')}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-4 border-b border-gray-100 pb-3 text-xs font-black uppercase tracking-widest text-gray-700">
            {t('editLangEs')}
          </p>
          <div className="flex flex-col gap-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-gray-500">{t('titleLabel')}</span>
              <input
                value={form.titleEs}
                onChange={(e) => setForm((prev) => ({ ...prev, titleEs: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold outline-none transition-colors focus:border-black"
              />
            </label>
            <div>
              <span className="mb-2 block text-xs font-bold text-gray-500">{t('bodyLabel')}</span>
              <RichTextEditor
                value={form.bodyEs}
                onChange={(bodyEs) => setForm((prev) => ({ ...prev, bodyEs }))}
                minHeightClassName="min-h-[360px]"
                placeholder={t('esTranslationPlaceholder')}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
