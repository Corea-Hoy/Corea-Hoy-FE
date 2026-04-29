'use client';

// #TODO: Add slides to SLIDES array and implement the carousel UI in the return statement.

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

interface Slide {
  src: string;
  labelKo: string;
  labelEs: string;
}

const SLIDES: Slide[] = [];

const INTERVAL = 4000;
const MIN_SWIPE = 40;

export default function KoreaCarousel({
  isKo,
  fullHeight = false,
}: {
  isKo: boolean;
  fullHeight?: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);
  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);

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

  return <div></div>;
}
