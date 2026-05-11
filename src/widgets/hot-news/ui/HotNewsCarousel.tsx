'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Chip } from '@/shared/ui/chip/Chip';
import { Article } from '@/entities/content/model/articles';

interface HotNewsCarouselProps {
  isKo: boolean;
  articles: Article[];
}

const GAP = 20;
const INTERVAL = 5000;
const MIN_SWIPE = 40;

function getVisibleCount() {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth >= 1280) return 3;
  if (window.innerWidth >= 1024) return 2.5;
  if (window.innerWidth >= 640) return 1.5;
  return 1.1;
}

function SafeImage({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) {
  const [imgSrc, setImgSrc] = useState(src || '/images/characters/mascot-cheer.png');

  return (
    <Image
      unoptimized
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc('/images/characters/mascot-cheer.png')}
    />
  );
}

export default function HotNewsCarousel({ isKo, articles }: HotNewsCarouselProps) {
  const hotItems = articles;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [translateX, setTranslateX] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const maxIndex = Math.max(0, hotItems.length - Math.floor(visibleCount));

  const calcTranslate = useCallback((index: number, vc: number) => {
    if (!trackRef.current) return 0;
    const w = trackRef.current.offsetWidth;
    const cardW = (w - GAP * (Math.ceil(vc) - 1)) / vc;
    return index * (cardW + GAP);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, maxIndex));
      setCurrent(clamped);
      setTranslateX(calcTranslate(clamped, visibleCount));
    },
    [maxIndex, visibleCount, calcTranslate],
  );

  const next = useCallback(
    () => goTo(current >= maxIndex ? 0 : current + 1),
    [current, maxIndex, goTo],
  );
  const prev = useCallback(
    () => goTo(current <= 0 ? maxIndex : current - 1),
    [current, maxIndex, goTo],
  );

  useEffect(() => {
    const update = () => {
      const vc = getVisibleCount();
      setVisibleCount(vc);
      setCurrent((c) => {
        const max = Math.max(0, hotItems.length - Math.floor(vc));
        const clamped = Math.min(c, max);
        setTranslateX(calcTranslate(clamped, vc));
        return clamped;
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [calcTranslate, hotItems.length]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) >= MIN_SWIPE) {
      if (delta > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const cardStyle = {
    flexShrink: 0 as const,
    width: `calc((100% - ${GAP * (Math.ceil(visibleCount) - 1)}px) / ${visibleCount})`,
  };

  if (hotItems.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Navigation Arrows - Top Right */}
      <div className="flex items-center justify-end gap-2 mb-3 sm:mb-4">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition-all cursor-pointer hover:bg-gray-50 active:scale-90"
        >
          <span className="text-gray-600 text-xl">‹</span>
        </button>
        <button
          onClick={next}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition-all cursor-pointer hover:bg-gray-50 active:scale-90"
        >
          <span className="text-gray-600 text-xl">›</span>
        </button>
        <div className="ml-4 text-[11px] font-black text-gray-400 tracking-widest">
          {String(current + 1).padStart(2, '0')} /{' '}
          {String(hotItems.length - Math.floor(visibleCount) + 1).padStart(2, '0')}
        </div>
      </div>

      <section
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative"
      >
        <div
          ref={trackRef}
          className="overflow-hidden py-4 -my-4"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-700 cubic-bezier(0.23, 1, 0.32, 1)"
            style={{ gap: `${GAP}px`, transform: `translateX(-${translateX}px)` }}
          >
            {hotItems.map((item) => (
              <Link key={item.id} href={`/detail/${item.id}`} style={cardStyle}>
                <div className="group h-[360px] sm:h-[400px] lg:h-[460px] bg-black rounded-2xl overflow-hidden transition-all duration-500  hover:-translate-y-2 relative flex flex-col">
                  {/* Card Background Image */}
                  <SafeImage
                    src={item.thumbnailUrl}
                    alt={isKo ? item.titleKo : item.titleEs}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-90 transition-all duration-700 group-hover:scale-110"
                  />

                  {/* Category Chip - Top Left */}
                  <div className="absolute top-4 left-4 z-30">
                    <Chip
                      text={item.category.name}
                      color={
                        item.category.slug.includes('kpop')
                          ? 'pink'
                          : item.category.slug.includes('drama')
                            ? 'violet'
                            : item.category.slug.includes('news')
                              ? 'red'
                              : item.category.slug.includes('culture')
                                ? 'blue'
                                : 'blue'
                      }
                    />
                  </div>

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />

                  {/* Content Overlay - Bottom */}
                  <div className="relative z-20 p-5 sm:p-6 flex flex-col h-full justify-end items-start">
                    <h3 className="text-base sm:text-lg lg:text-xl font-black text-white leading-tight mb-2 drop-shadow-md group-hover:text-blue-400 transition-colors">
                      {isKo ? item.titleKo : item.titleEs}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-white/70 leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      {isKo ? `조회수: ${item.viewCount}회` : `Vistas: ${item.viewCount}`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
