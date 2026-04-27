'use client';

import { useRef, useCallback, Suspense, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLanguageStore } from '@/shared/model';
import { MOCK_CONTENTS, type Category, CATEGORIES_KO, CATEGORIES_ES } from '@/entities/content';
import { ContentCard } from '@/entities/content';
import { KoreaCarousel } from '@/widgets/korea-carousel';

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
  const activeCategory = searchParams.get('category') as Category | null;
  const isMainLanding = !activeCategory && !searchQuery;

  const filtered = useMemo(
    () =>
      MOCK_CONTENTS.filter((c) => {
        const title = isKo ? c.title : c.titleEs;
        const summary = isKo ? c.summary : c.summaryEs;
        return (
          title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          summary.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }),
    [isKo, searchQuery],
  );

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        if (sortOrder === 'popular') return b.likes - a.likes;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }),
    [filtered, sortOrder],
  );

  // Top 4 by date for the editors' pick strip — unaffected by sort
  const editorsPick = useMemo(
    () =>
      [...MOCK_CONTENTS]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 4),
    [],
  );
  const editorsPickIds = useMemo(() => new Set(editorsPick.map((c) => c.id)), [editorsPick]);

  const categories: Category[] = ['K-POP', '드라마', '뉴스', '문화', '스포츠', '음식'];

  const scrollToContent = useCallback(() => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleCategoryViewMore = (cat: string) => {
    const params = new URLSearchParams();
    params.set('category', cat);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div>
      {/* ── Hero (main landing only) ── */}
      {isMainLanding && (
        <section className="relative overflow-hidden mt-3 sm:mt-6 rounded-2xl md:rounded-3xl mx-0 sm:mx-2 md:mx-6 h-56 sm:h-80 lg:h-[540px]">
          <KoreaCarousel isKo={isKo} fullHeight />

          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)',
            }}
          >
            <div className="mb-3 sm:mb-6">
              <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-red-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg">
                🔥 Hot Issue
              </span>
            </div>

            <h1
              className="text-2xl sm:text-4xl lg:text-6xl font-black text-white leading-tight mb-3 sm:mb-6 drop-shadow-2xl max-w-xs sm:max-w-2xl lg:max-w-4xl"
              style={{ letterSpacing: '-0.03em' }}
            >
              {isKo ? '지금 가장 뜨거운 한국의 이야기' : 'Lo más candente de Corea ahora'}
            </h1>

            <p className="hidden sm:block text-sm md:text-lg text-white/90 mb-6 sm:mb-10 leading-relaxed max-w-2xl drop-shadow-md font-medium">
              {isKo
                ? '트렌드부터 깊이 있는 문화 분석까지, Corea Hoy가 선별한 프리미엄 콘텐츠를 만나보세요.'
                : 'Desde tendencias hasta análisis culturales profundos, descubre el contenido premium seleccionado por Corea Hoy.'}
            </p>

            <button
              onClick={scrollToContent}
              className="group flex items-center gap-2 px-6 sm:px-10 py-2.5 sm:py-4 rounded-full bg-white text-black text-sm sm:text-base font-black hover:bg-gray-100 transition-all shadow-2xl hover:-translate-y-1 active:scale-95 cursor-pointer"
            >
              {t('heroCta')}
              <span className="transition-transform group-hover:translate-y-1">↓</span>
            </button>
          </div>
        </section>
      )}

      {/* ── Content area ── */}
      <div
        ref={contentRef}
        id="newsletter"
        className="max-w-screen-xl mx-auto pt-5 sm:pt-8 scroll-mt-20"
      >
        {/* Header row: title + sort tabs */}
        <div className="mb-5 sm:mb-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black">
              {activeCategory
                ? isKo
                  ? activeCategory
                  : (CATEGORIES_ES[
                      CATEGORIES_KO.indexOf(activeCategory as (typeof CATEGORIES_KO)[number])
                    ] ?? activeCategory)
                : t('newsletterTitle')}
            </h2>

            {/* Sort tabs — only on home/search, not single-category view */}
            {!activeCategory && (
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 flex-shrink-0 mt-1">
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

        {/* ── Single category view ── */}
        {activeCategory ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {sorted
              .filter((c) => c.category === activeCategory)
              .map((content) => (
                <ContentCard key={content.id} content={content} isKo={isKo} />
              ))}
          </div>
        ) : (
          <div className="flex flex-col gap-10 sm:gap-12">
            {/* ── Editors' pick (top 4 by date, ignores sort) ── */}
            {!searchQuery && (
              <section>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                  {isKo ? '편집자 추천' : 'Selección del editor'}
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {editorsPick.map((content) => (
                    <ContentCard key={content.id} content={content} isKo={isKo} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Category sections ── */}
            <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:gap-y-14">
              {categories.map((cat) => {
                const catItems = sorted
                  .filter((c) => c.category === cat && !editorsPickIds.has(c.id))
                  .slice(0, 2);
                if (catItems.length === 0) return null;

                const catLabel = isKo
                  ? cat
                  : (CATEGORIES_ES[CATEGORIES_KO.indexOf(cat as (typeof CATEGORIES_KO)[number])] ??
                    cat);

                return (
                  <section key={cat}>
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                      <h3 className="text-base sm:text-xl font-black text-black tracking-tight">
                        {catLabel}
                      </h3>
                      <button
                        onClick={() => handleCategoryViewMore(cat)}
                        className="text-xs font-black text-gray-400 hover:text-black transition-all cursor-pointer flex items-center gap-1"
                      >
                        {isKo ? '더보기' : 'Ver más'}
                        <span>→</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                      {catItems.map((content) => (
                        <ContentCard key={content.id} content={content} isKo={isKo} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {sorted.length === 0 && (
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
