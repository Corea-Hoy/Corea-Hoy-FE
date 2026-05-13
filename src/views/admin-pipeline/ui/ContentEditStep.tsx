'use client';

import { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<EditFormData>({
    titleKo: '',
    bodyKo: '',
    titleEs: '',
    bodyEs: '',
  });

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
      .finally(() => setIsLoading(false));
  }, [articleId]);

  if (isLoading) {
    return (
      <div className="animate-fade-in flex flex-col gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="h-96 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <section className="animate-fade-in">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">콘텐츠 수정</p>
          <h2 className="mt-1 text-xl font-black text-black">발행된 콘텐츠를 수정합니다</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-xl border-2 border-gray-200 px-5 py-3 text-sm font-bold text-gray-500 transition-colors cursor-pointer hover:border-gray-400 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => onSave(form)}
            disabled={isSaving}
            className="rounded-xl bg-black px-5 py-3 text-sm font-black text-white transition-opacity cursor-pointer hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {isSaving ? '저장 중...' : '수정 저장'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-sm">
          <p className="mb-4 border-b border-gray-100 pb-3 text-xs font-black uppercase tracking-widest text-gray-700">
            한국어
          </p>
          <div className="flex flex-col gap-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-gray-500">제목</span>
              <input
                value={form.titleKo}
                onChange={(e) => setForm((prev) => ({ ...prev, titleKo: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold outline-none transition-colors focus:border-black"
              />
            </label>
            <div>
              <span className="mb-2 block text-xs font-bold text-gray-500">본문</span>
              <RichTextEditor
                value={form.bodyKo}
                onChange={(bodyKo) => setForm((prev) => ({ ...prev, bodyKo }))}
                minHeightClassName="min-h-[360px]"
                placeholder="한국어 본문"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-4 border-b border-gray-100 pb-3 text-xs font-black uppercase tracking-widest text-gray-700">
            스페인어
          </p>
          <div className="flex flex-col gap-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-gray-500">제목</span>
              <input
                value={form.titleEs}
                onChange={(e) => setForm((prev) => ({ ...prev, titleEs: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold outline-none transition-colors focus:border-black"
              />
            </label>
            <div>
              <span className="mb-2 block text-xs font-bold text-gray-500">본문</span>
              <RichTextEditor
                value={form.bodyEs}
                onChange={(bodyEs) => setForm((prev) => ({ ...prev, bodyEs }))}
                minHeightClassName="min-h-[360px]"
                placeholder="스페인어 본문"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
