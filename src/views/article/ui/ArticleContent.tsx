'use client';

import { useArticles } from '@/features/article/model/useArticles';
import DOMPurify from 'isomorphic-dompurify';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export function ArticleContent() {
  const { body, note, url } = useArticles();
  const t = useTranslations('content');

  return (
    <div className="py-12">
      {/* 컨텐츠 */}
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body ?? '') }}></div>

      {/* 요약 */}
      <div className="flex items-center gap-2 my-8 pl-0 pr-2 sm:pl-3 sm:pr-5 pt-5 pb-4 border-l-6 border-l-amber-500 rounded-xl rounded-tl-none rounded-bl-none bg-amber-50">
        <img
          className="relative top-[-0.3rem] w-[5rem]"
          src="/images/characters/mascot-impact.svg"
          alt=""
        ></img>
        <div>
          <h3 className="text-[1.15rem] text-amber-600 font-bold">{t('culturalNoteTitle')}</h3>
          <p className="mt-2 text-amber-600">{note ?? t('noSummary')}</p>
        </div>
      </div>

      {/* 출처 */}
      <p className="mt-12">
        <b className="whitespace-nowrap">출처:</b>
        <a
          className="pl-1.5 underline !underline break-words"
          href={url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url}
        </a>
      </p>
    </div>
  );
}
