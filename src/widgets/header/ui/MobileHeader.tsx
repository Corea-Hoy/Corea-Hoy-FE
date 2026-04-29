'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useUserStore } from '@/entities/user';
import { CATEGORIES_KO, CATEGORIES_ES } from '@/entities/content';
import LangDropdown from './LangDropdown';

interface LangDropdownProps {
  language: string;
  isLangOpen: boolean;
  setIsLangOpen: (v: boolean) => void;
  setLanguage: (code: 'ko' | 'es') => void;
  selectLangLabel: string;
  langs: { code: 'ko' | 'es'; label: string }[];
  align?: 'right' | 'left';
}

interface MobileHeaderProps {
  mobileHeaderRef: React.RefObject<HTMLElement | null>;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  searchValue: string;
  setSearchValue: (val: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  isKo: boolean;
  langDropdownProps: LangDropdownProps;
  isHome: boolean;
  activeCategory: string;
  handleCategoryClick: (cat: string) => void;
}

const MobileHeader = ({
  mobileHeaderRef,
  isSearchOpen,
  setIsSearchOpen,
  searchValue,
  setSearchValue,
  handleSearch,
  isKo,
  langDropdownProps,
  isHome,
  activeCategory,
  handleCategoryClick,
}: MobileHeaderProps) => {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { user, isLoggedIn } = useUserStore();

  return (
    <header
      ref={mobileHeaderRef}
      className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm shadow-gray-200/20"
    >
      <div className="flex items-center justify-between px-4 h-14 relative">
        {!isSearchOpen ? (
          <>
            <Link href="/" className="hover:opacity-70 transition-opacity">
              <Image
                src="/images/logo/logo.svg"
                alt="Corea Hoy"
                width={96}
                height={38}
                style={{ objectFit: 'contain' }}
                priority
              />
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label={isKo ? '검색' : 'Buscar'}
                className="text-xl p-1 text-gray-600 cursor-pointer"
              >
                <svg
                  focusable="false"
                  height="25px"
                  viewBox="0 0 24 24"
                  width="25px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.49,19l-5.73-5.73C15.53,12.2,16,10.91,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5C3,13.09,5.91,16,9.5,16 c1.41,0,2.7-0.47,3.77-1.24L19,20.49L20.49,19z M5,9.5C5,7.01,7.01,5,9.5,5S14,7.01,14,9.5S11.99,14,9.5,14S5,11.99,5,9.5z" />
                  <path d="M0,0h24v24H0V0z" fill="none" />
                </svg>
              </button>
              <LangDropdown align="right" {...langDropdownProps} />
              {isLoggedIn && user ? (
                <Link href="/mypage" aria-label={t('mypage')}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-base border-2 cursor-pointer ${
                      pathname === '/mypage' ? 'border-black' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {user.avatarEmoji}
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center hover:opacity-70 transition-opacity flex-shrink-0"
                >
                  <Image
                    src="/images/user.png"
                    alt=""
                    aria-hidden="true"
                    width={20}
                    height={48}
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center w-full gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <input
                type="text"
                autoFocus
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={t('search')}
                aria-label={t('search')}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm outline-none"
              />
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                aria-hidden="true"
              >
                <svg
                  focusable="false"
                  height="20px"
                  viewBox="0 0 24 24"
                  width="20px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.49,19l-5.73-5.73C15.53,12.2,16,10.91,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5C3,13.09,5.91,16,9.5,16 c1.41,0,2.7-0.47,3.77-1.24L19,20.49L20.49,19z M5,9.5C5,7.01,7.01,5,9.5,5S14,7.01,14,9.5S11.99,14,9.5,14S5,11.99,5,9.5z" />
                  <path d="M0,0h24v24H0V0z" fill="none" />
                </svg>
              </span>
            </form>
            <button
              onClick={() => setIsSearchOpen(false)}
              aria-label={isKo ? '검색 닫기' : 'Cerrar búsqueda'}
              className="text-xs font-bold text-gray-500 px-2"
            >
              {isKo ? '취소' : 'Cancelar'}
            </button>
          </div>
        )}
      </div>

      {/* Mobile category scroll row */}
      {isHome && (
        <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-hide border-t border-gray-100">
          {CATEGORIES_KO.map((cat, i) => {
            const label = isKo ? cat : CATEGORIES_ES[i];
            const isActive =
              cat === activeCategory || (activeCategory === '전체' && cat === '전체');
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                aria-pressed={isActive}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-white border-black shadow-md shadow-black/10'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
