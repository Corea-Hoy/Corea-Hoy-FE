'use client';

import { useArticles } from '@/features/article/model/useArticles';
import DOMPurify from 'isomorphic-dompurify';
import { useTranslations } from 'next-intl';

export function ArticleContent() {
  const { body, note } = useArticles();
  const t = useTranslations('content');

  return (
    <div className="py-12">
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body ?? '') }}></div>

      {/* 요약 */}
      <div className="my-8 p-4 border border-amber-200 rounded-xl bg-amber-50">
        <h3 className="text-amber-500 font-bold">{t('culturalNoteTitle')}</h3>
        <p className="mt-3 text-amber-500">{note ?? t('noSummary')}</p>
      </div>
    </div>
  );
}
