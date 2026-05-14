'use client';

import { useRef, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLanguageStore } from '@/shared/model';
import { ContentCard, useCategories, CATEGORY_ES_MAP } from '@/entities/content';
import { HotNewsCarousel } from '@/widgets/hot-news';
import { useHomeArticles } from '../model/useHomeArticles';
import { useCategoryArticles } from '../model/useCategoryArticles';
import { useSearchArticles } from '../model/useSearchArticles';
import { useArticlesQuery } from '../model/useArticlesQuery';
import { useIntersectionObserver } from '@/shared/lib/hooks/useIntersectionObserver';
import { Loading } from '@/shared/ui/loading/Loading';
import { useEffect } from 'react';

function CategoryPreviewSection({
  catObj,
  isKo,
  onMoreClick,
}: {
  catObj: { name: string; slug: string; esName: string };
  isKo: boolean;
  onMoreClick: () => void;
}) {
  const { data: articles = [], isLoading } = useArticlesQuery({
    category: catObj.slug,
    sort: 'latest',
    limit: 2,
  });

  if (isLoading) return <div className="animate-pulse h-40 bg-gray-100 rounded-xl" />;
  if (articles.length === 0) return null;

  const catLabel = isKo ? catObj.name : catObj.esName;

  return (
    <section>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <h3 className="text-base sm:text-xl font-black text-black tracking-tight">{catLabel}</h3>
        <button
          onClick={onMoreClick}
          className="text-xs font-black text-gray-400 hover:text-black transition-all cursor-pointer flex items-center gap-1"
        >
          {isKo ? '더보기' : 'Ver más'}
          <span>→</span>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {articles.map((content) => (
          <ContentCard key={content.id} content={content} isKo={isKo} />
        ))}
      </div>
    </section>
  );
}

const SORT_OPTIONS = [
  { id: 'latest' as const, ko: '최신순', es: 'Reciente' },
  { id: 'popular' as const, ko: '좋아요순', es: 'Popular' },
];

function HomePageInner() {
  const t = useTranslations('home');

  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguageStore();
  const isKo = language === 'ko';

  const [sortOrder, setSortOrder] = useState<'latest' | 'popular'>('latest');
  const contentRef = useRef<HTMLDivElement>(null);

  const searchQuery = searchParams.get('q') ?? '';
  const activeCategory = searchParams.get('category');
  const isMainLanding = !activeCategory && !searchQuery;

  const { sorted, hasFetched } = useHomeArticles({
    searchQuery,
    sortOrder,
    isKo,
  });

  const { data: popularArticles = [] } = useArticlesQuery({ sort: 'popular', limit: 6 });
  const { data: latestApiArticles = [] } = useArticlesQuery({ sort: 'latest', limit: 4 });

  const {
    data: categoryInfiniteData,
    fetchNextPage: fetchCategoryNext,
    hasNextPage: hasCategoryNext,
    isFetchingNextPage: isFetchingCategoryNext,
    isLoading: isCategoryLoading,
  } = useCategoryArticles({
    categoryName: activeCategory || '',
    limit: 15,
    sortOrder,
  });

  const {
    data: searchInfiniteData,
    fetchNextPage: fetchSearchNext,
    hasNextPage: hasSearchNext,
    isFetchingNextPage: isFetchingSearchNext,
    isLoading: isSearchLoading,
  } = useSearchArticles({
    query: searchQuery,
    limit: 15,
    sortOrder,
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(loadMoreRef, { rootMargin: '200px' });
  const inView = entry?.isIntersecting;

  useEffect(() => {
    if (inView) {
      if (activeCategory && hasCategoryNext && !isFetchingCategoryNext) {
        fetchCategoryNext();
      } else if (searchQuery && hasSearchNext && !isFetchingSearchNext) {
        fetchSearchNext();
      }
    }
  }, [
    inView,
    activeCategory,
    hasCategoryNext,
    isFetchingCategoryNext,
    fetchCategoryNext,
    searchQuery,
    hasSearchNext,
    isFetchingSearchNext,
    fetchSearchNext,
  ]);

  // Merge infinite scroll pages
  const sortedCategoryArticles = categoryInfiniteData?.pages.flatMap((p) => p.articles) || [];
  const sortedSearchArticles = searchInfiniteData?.pages.flatMap((p) => p.articles) || [];

  const isAnyLoading = activeCategory ? isCategoryLoading : searchQuery ? isSearchLoading : false;
  const isFetchingAnyNext = isFetchingCategoryNext || isFetchingSearchNext;

  const { data: categoryData } = useCategories();
  const apiCategories = categoryData?.data || [];

  // Filter out the '전체' category if it comes from API just in case, though API usually doesn't return 'all'.
  const categoriesList = apiCategories.map((c) => ({
    name: c.name,
    slug: c.slug,
    esName: CATEGORY_ES_MAP[c.slug] || c.name,
  }));

  const handleCategoryViewMore = (cat: string) => {
    const params = new URLSearchParams();
    params.set('category', cat);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div>
      {/* ── Hero (main landing only) ── */}
      {isMainLanding && popularArticles.length > 0 && (
        <section className="bg-white py-6 sm:py-10 ">
          <div className="max-w-screen-xl mx-auto relative z-10">
            <HotNewsCarousel isKo={isKo} articles={popularArticles} />
          </div>
        </section>
      )}

      {/* ── Content area ── */}
      <div ref={contentRef} id="newsletter" className="max-w-screen-xl mx-auto pt-10  scroll-mt-20">
        {/* Header row: title + sort tabs */}
        <div className="mb-5 sm:mb-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black">
              {activeCategory
                ? isKo
                  ? activeCategory
                  : categoriesList.find((c) => c.name === activeCategory)?.esName || activeCategory
                : searchQuery
                  ? isKo
                    ? `'${searchQuery}' 검색 결과`
                    : `Resultados para '${searchQuery}'`
                  : t('newsletterTitle')}
            </h2>

            {/* 정렬 버튼 */}
            {activeCategory && (
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 flex-shrink-0 mt-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSortOrder(opt.id)}
                    className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                      sortOrder === opt.id
                        ? 'bg-black text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-800 hover:bg-white/60'
                    }`}
                  >
                    {isKo ? opt.ko : opt.es}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Infinite list view (Category or Search) ── */}
        {activeCategory || searchQuery ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {(activeCategory ? sortedCategoryArticles : sortedSearchArticles).map((content) => (
                <ContentCard key={content.id} content={content} isKo={isKo} />
              ))}
            </div>
            {/* 무한 스크롤 옵저버 타겟 */}
            <div ref={loadMoreRef} className="h-10 w-full mt-4 flex items-center justify-center">
              {isFetchingAnyNext && <div className="text-gray-400 text-sm">로딩 중...</div>}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-10 sm:gap-12">
            {/* ── Latest News (top 4 by date) ── */}
            {!searchQuery && (
              <section>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                  {isKo ? '최신 뉴스' : 'Últimas noticias'}
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {latestApiArticles.map((content) => (
                    <ContentCard key={content.id} content={content} isKo={isKo} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Category sections ── */}
            <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:gap-y-14">
              {categoriesList.map((catObj) => (
                <CategoryPreviewSection
                  key={catObj.slug}
                  catObj={catObj}
                  isKo={isKo}
                  onMoreClick={() => handleCategoryViewMore(catObj.name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {isAnyLoading && <Loading />}
        {!isAnyLoading &&
          (activeCategory || searchQuery) &&
          (activeCategory ? sortedCategoryArticles : sortedSearchArticles).length === 0 && (
            <div className="py-24 text-center">
              <span className="text-5xl mb-4 block">🔍</span>
              <p className="text-lg font-bold text-gray-300 mb-6">{t('noResults')}</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:opacity-80 transition-opacity cursor-pointer"
              >
                {isKo ? '검색 초기화' : 'Limpiar búsqueda'}
              </button>
            </div>
          )}
        {!searchQuery && !activeCategory && hasFetched && sorted.length === 0 && (
          <div className="py-24 text-center">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-lg font-bold text-gray-300 mb-6">{t('noResults')}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:opacity-80 transition-opacity cursor-pointer"
            >
              {isKo ? '검색 초기화' : 'Limpiar búsqueda'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="h-56 sm:h-80 lg:h-[540px] mt-3 sm:mt-6 mx-0 sm:mx-2 md:mx-6 rounded-2xl bg-gray-100 animate-pulse" />
      }
    >
      <HomePageInner />
    </Suspense>
  );
}
