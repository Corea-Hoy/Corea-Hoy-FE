'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { type Content } from '../model/mock-data';
import { CATEGORY_ES_MAP } from '../model/categories';
import { Chip } from '@/shared/ui/chip/Chip';
import { Article } from '../model/articles';

interface ContentCardProps {
  content: Article;
  isKo: boolean;
}

export default function ContentCard({ content, isKo }: ContentCardProps) {
  const [imgSrc, setImgSrc] = useState(
    content.thumbnailUrl || '/images/characters/mascot-cheer.png',
  );

  const categoryLabel = isKo
    ? content.category.name
    : (CATEGORY_ES_MAP[content.category.slug] ?? content.category.name);

  return (
    <Link
      href={`/detail/${content.id}`}
      className="group block rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden bg-white hover:-translate-y-0.5 sm:hover:-translate-y-1 hover:shadow-md sm:hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
    >
      {/* Thumbnail */}
      <div className="relative h-36 sm:h-44 md:h-48 w-full">
        <Image
          src={imgSrc}
          alt={isKo ? content.titleKo : content.titleEs}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
          onError={() => setImgSrc('/images/characters/mascot-cheer.png')}
        />
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
          <Chip
            text={categoryLabel}
            color={
              content.category.slug.includes('kpop')
                ? 'pink'
                : content.category.slug.includes('drama')
                  ? 'violet'
                  : content.category.slug.includes('news')
                    ? 'red'
                    : content.category.slug.includes('culture')
                      ? 'blue'
                      : 'gray'
            }
          />
        </div>
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col gap-1 sm:gap-2">
        {/* <div className="text-[10px] sm:text-xs text-gray-400 font-semibold">
          {content.publishedAt}
        </div> */}
        <h2 className="text-xs sm:text-sm md:text-base font-bold leading-snug text-black line-clamp-2">
          {isKo ? content.titleKo : content.titleEs}
        </h2>
        {/* <p className="hidden sm:block text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {isKo ? content.summary : content.summaryEs}
        </p> */}
        {/* <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
          <svg
            className="w-3 h-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>{content.likes}</span>
        </div> */}
      </div>
    </Link>
  );
}
