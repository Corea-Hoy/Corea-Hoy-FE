'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function MobileFooter() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="lg:hidden mt-6 border-t border-gray-100 bg-white pb-16">
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* 왼쪽 영역: 링크 + 구분선 + 저작권 (말줄임 적용) */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link
            href="/privacy"
            className="text-xs text-gray-500 hover:text-black transition-colors whitespace-nowrap flex-shrink-0"
          >
            {t('privacy')}
          </Link>

          {/* 구분선 */}
          <span className="text-gray-200 text-[10px] flex-shrink-0">|</span>

          {/* 화면이 좁아지면 ...으로 변하는 저작권 부분 */}
          <span className="text-xs text-gray-400 truncate">© {year} Corea Hoy</span>
        </div>

        {/* 오른쪽 영역: 베타 서비스 뱃지 */}
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 border border-amber-200 rounded-full flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] text-amber-600 font-semibold whitespace-nowrap">
            {t('demo')}
          </span>
        </div>
      </div>
    </footer>
  );
}
