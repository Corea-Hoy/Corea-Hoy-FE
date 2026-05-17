import { useEffect, useState } from 'react';

interface Args extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Intersection Observer를 사용하여 요소의 가시성을 감지하는 훅입니다.
 * Callback Ref 패턴을 사용하여 조건부 렌더링에서도 안정적으로 동작합니다.
 */
export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0%',
  freezeOnceVisible = false,
}: Args) {
  const [element, setElement] = useState<Element | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const hasIOSupport = !!window.IntersectionObserver;
    if (!hasIOSupport || frozen || !element) return;

    const observer = new IntersectionObserver(([entry]) => setEntry(entry), {
      threshold,
      root,
      rootMargin,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, threshold, root, rootMargin, frozen]);

  return [setElement, entry] as const;
}
