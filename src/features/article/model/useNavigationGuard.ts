'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type NavigateEvent = Event & {
  hashChange: boolean;
  navigationType: string;
  destination: { url: string };
  canIntercept: boolean;
  intercept: (options: { handler: () => Promise<void> }) => void;
};

type NavigationObject = {
  addEventListener: (type: string, handler: (e: NavigateEvent) => void, capture?: boolean) => void;
  removeEventListener: (
    type: string,
    handler: (e: NavigateEvent) => void,
    capture?: boolean,
  ) => void;
};

type PendingNav =
  | { type: 'push'; url: string }
  | { type: 'back' }
  | { type: 'intercept'; resolve: () => void; reject: () => void };

export function useNavigationGuard() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const pendingNavRef = useRef<PendingNav | null>(null);
  const allowRef = useRef(false);
  const editUrlRef = useRef('');
  const sentinelActiveRef = useRef(false);

  useEffect(() => {
    editUrlRef.current = window.location.href;
    const editPath = window.location.pathname;

    /**
     * 이탈 시 확인 모달
     * @param nav 이탈 유형 및 이동 정보
     */
    const guard = (nav: PendingNav) => {
      pendingNavRef.current = nav;
      queueMicrotask(() => setShowModal(true));
    };

    /**
     * <a> 태그 클릭을 capture phase에서 가로채 가드 발동
     * @param e
     */
    const onLinkClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href')!;
      if (!href || /^(#|mailto:|tel:)/.test(href)) return;
      try {
        const { origin, pathname } = new URL(href, location.origin);
        if (origin !== location.origin || pathname === editPath) return;
      } catch {
        return;
      }
      if (allowRef.current) {
        allowRef.current = false;
        return;
      }
      e.preventDefault();
      guard({ type: 'push', url: href });
    };

    /**
     * 새로고침 및 탭 닫기를 브라우저 기본 확인 다이얼로그로 막음
     * @param e
     */
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();

    document.addEventListener('click', onLinkClick, true);
    window.addEventListener('beforeunload', onBeforeUnload);

    if ('navigation' in window) {
      const nav = (window as Window & { navigation: NavigationObject }).navigation;

      window.history.pushState({ __editGuard: true }, ''); // sentinel
      sentinelActiveRef.current = true;

      /**
       * 페이지 이동 시 수정 이탈 여부 확인
       * - 뒤로가기: 모달 표시
       * - push/replace: 이동 보류
       * @param e
       */
      const onNavigate = (e: NavigateEvent) => {
        if (e.hashChange) return;
        if (allowRef.current) {
          allowRef.current = false;
          return;
        }

        const destPath = new URL(e.destination.url).pathname;

        if (e.navigationType === 'traverse' && destPath === editPath && sentinelActiveRef.current) {
          sentinelActiveRef.current = false;
          if (e.canIntercept) e.intercept({ handler: async () => {} });
          guard({ type: 'back' });
          return;
        }

        if (destPath === editPath || !e.canIntercept) return;

        let resolve!: () => void, reject!: () => void;
        const promise = new Promise<void>((res, rej) => {
          resolve = res;
          reject = rej;
        });
        promise.catch(() => {});
        e.intercept({ handler: () => promise });
        guard({ type: 'intercept', resolve, reject });
      };

      nav.addEventListener('navigate', onNavigate, true);

      return () => {
        document.removeEventListener('click', onLinkClick, true);
        window.removeEventListener('beforeunload', onBeforeUnload);
        nav.removeEventListener('navigate', onNavigate, true);
        // sentinel이 소비되지 않은 채 언마운트될 경우(HMR, 즉시 언마운트 등) history에서 제거
        if (sentinelActiveRef.current && window.location.pathname === editPath) {
          sentinelActiveRef.current = false;
          history.go(-1);
        }
      };
    }

    const origPushState = window.history.pushState.bind(window.history);

    /**
     * pushState를 오버라이드하여 페이지 이동을 가로챔 (Firefox / Safari)
     * Link 클릭은 onLinkClick, router.push 등은 여기서 처리
     */
    window.history.pushState = function (data, title, url) {
      if (allowRef.current) {
        allowRef.current = false;
        return origPushState(data, title, url);
      }
      if (url != null) {
        try {
          if (new URL(String(url), location.origin).pathname !== editPath) {
            guard({ type: 'push', url: String(url) });
            return;
          }
        } catch {
          return origPushState(data, title, url);
        }
      }
      return origPushState(data, title, url);
    };

    /**
     * popstate를 가로채 뒤로가기를 막음 (Firefox / Safari)
     * Next.js의 popstate를 차단하고 URL을 복원
     * @param e
     */
    const onPopState = (e: PopStateEvent) => {
      if (allowRef.current) {
        allowRef.current = false;
        return;
      }
      const target = window.location.href;
      if (new URL(target).pathname === editPath) return;
      e.stopImmediatePropagation();
      origPushState(null, '', editUrlRef.current);
      guard({ type: 'push', url: target });
    };

    window.addEventListener('popstate', onPopState, true);

    return () => {
      document.removeEventListener('click', onLinkClick, true);
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.history.pushState = origPushState;
      window.removeEventListener('popstate', onPopState, true);
    };
  }, []);

  /**
   * 이탈 확인: 이동 유형에 따라 intercept resolve / router.back / router.push를 실행
   */
  const onNavGuardConfirm = () => {
    const nav = pendingNavRef.current;
    pendingNavRef.current = null;
    setShowModal(false);
    if (!nav) return;

    if (nav.type === 'intercept') nav.resolve();
    else if (nav.type === 'back') {
      allowRef.current = true;
      router.back();
    } else {
      allowRef.current = true;
      router.push(nav.url);
    }
  };

  /**
   * 페이지 이탈을 취소하고 뒤로가기를 다시 가드
   */
  const onNavGuardCancel = () => {
    const nav = pendingNavRef.current;
    pendingNavRef.current = null;
    setShowModal(false);

    if (nav?.type === 'intercept') {
      nav.reject();
    } else if (nav?.type === 'back') {
      // sentinel 재추가 → 다음 뒤로가기도 가드
      allowRef.current = true;
      window.history.pushState({ __editGuard: true }, '');
      sentinelActiveRef.current = true;
    }
  };

  /**
   * 의도적인 페이지 이동 전 navigation 가드를 우회
   */
  const allowNextNavigation = () => {
    allowRef.current = true;
  };

  return { showNavGuardModal: showModal, onNavGuardConfirm, onNavGuardCancel, allowNextNavigation };
}
