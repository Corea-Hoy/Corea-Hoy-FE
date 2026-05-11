'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useLikedContents } from '@/entities/user';

export function LikedContentList() {
  const t = useTranslations('mypage');
  const locale = useLocale();
  const isKo = locale === 'ko';
  const { likedContents, isLoading, isError } = useLikedContents();
  console.log(likedContents);
  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">♥ {t('likedTitle')}</h2>
        <p className="text-center text-gray-300 py-12 border border-dashed border-gray-200 rounded-2xl text-sm">
          불러오는 중...
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">♥ {t('likedTitle')}</h2>
        <p className="text-center text-gray-300 py-12 border border-dashed border-gray-200 rounded-2xl text-sm">
          불러오기에 실패했습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">♥ {t('likedTitle')}</h2>
      {likedContents.length === 0 ? (
        <p className="text-center text-gray-300 py-12 border border-dashed border-gray-200 rounded-2xl text-sm">
          {t('emptyLike')}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {likedContents.map((c) => (
            <Link
              key={c.id}
              href={`/article/${c.id}`}
              className="group flex gap-3 border border-gray-100 bg-white rounded-xl overflow-hidden hover:border-black transition-all duration-200"
            >
              <div className="relative w-24 h-20 flex-shrink-0">
                <Image
                  src={`https://picsum.photos/seed/${c.id}/240/160`}
                  alt={isKo ? c.title : (c.titleEs ?? c.title)}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center gap-1 py-3 pr-3 min-w-0">
                <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-semibold text-gray-500 self-start">
                  {c.category}
                </span>
                <p className="font-bold text-sm leading-snug group-hover:underline line-clamp-2">
                  {isKo ? c.title : (c.titleEs ?? c.title)}
                </p>
                <span className="text-xs text-gray-300">{c.publishedAt}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
