'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useUsersStore } from '@/entities/user';
import { CATEGORIES_KO, CATEGORIES_ES } from '@/entities/content';
import LangDropdown from './LangDropdown';
import { Search, User } from 'lucide-react';
import { useLogout } from '@/features/auth';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ConfirmModal } from '@/shared/ui';

interface LangDropdownProps {
  language: string;
  isLangOpen: boolean;
  setIsLangOpen: (v: boolean) => void;
  setLanguage: (code: 'ko' | 'es') => void;
  selectLangLabel: string;
  langs: { code: 'ko' | 'es'; label: string }[];
  align?: 'right' | 'left';
}

interface DesktopHeaderProps {
  searchValue: string;
  setSearchValue: (val: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  langDropdownProps: LangDropdownProps;
  isHome: boolean;
  isKo: boolean;
  activeCategory: string;
  handleCategoryClick: (cat: string) => void;
}

const DesktopHeader = ({
  searchValue,
  setSearchValue,
  handleSearch,
  langDropdownProps,
  isHome,
  isKo,
  activeCategory,
  handleCategoryClick,
}: DesktopHeaderProps) => {
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { user, isLoggedIn } = useUsersStore();
  const { onLogout } = useLogout();

  return (
    <>
      <nav className="hidden lg:block sticky top-0 z-50 bg-white shadow-sm">
        {/* Top bar: 3-column Google News style */}
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-6 border-b border-gray-100">
          {/* Left: Logo */}
          <div className="flex-1 flex items-center">
            <Link
              href="/"
              className="flex items-center hover:opacity-70 transition-opacity flex-shrink-0"
            >
              <Image
                src="/images/logo/logo.svg"
                alt="Corea Hoy"
                width={120}
                height={48}
                style={{ objectFit: 'contain' }}
                priority
              />
            </Link>
          </div>

          {/* Center: Search Bar */}
          <form onSubmit={handleSearch} className="relative group flex-[2] min-w-0 max-w-2xl">
            <div className="relative flex items-center">
              <span
                className="absolute left-3.5 text-gray-400 text-sm group-focus-within:text-black transition-colors"
                aria-hidden="true"
              >
                <svg
                  focusable="false"
                  height="20px"
                  viewBox="0 0 24 24"
                  width="20px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <Search />
                </svg>
              </span>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={t('search')}
                aria-label={t('search')}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:bg-white focus:border-black transition-all outline-none placeholder:text-gray-400"
              />
            </div>
          </form>

          {/* Right: Lang + User */}
          <div className="flex-1 flex items-center justify-end gap-3">
            <LangDropdown {...langDropdownProps} />

            {isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                <Link href="/mypage" aria-label={t('mypage')}>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 transition-all cursor-pointer shadow-sm hover:scale-105 overflow-hidden ${pathname === '/mypage' ? 'border-black' : 'border-transparent'}`}
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-bold">{user.name?.[0] ?? '?'}</span>
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 text-sm font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                aria-label={t('login')}
                className="px-5 py-2 text-black transition-all"
              >
                <User />
              </Link>
            )}
          </div>
        </div>

        {/* Persistent Secondary Nav Bar */}
        <div className="bg-gray-50/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-screen-xl mx-auto px-6 h-12 flex items-center justify-between">
            {/* Left: Categories (Home only) */}
            <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide flex-1 min-w-0">
              {isHome &&
                CATEGORIES_KO.map((cat, i) => {
                  const label = isKo ? cat : CATEGORIES_ES[i];
                  const isActive =
                    cat === activeCategory || (activeCategory === '전체' && cat === '전체');
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      aria-pressed={isActive}
                      className={`relative flex-shrink-0 px-5 py-3 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        isActive ? 'text-black' : 'text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      {label}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                      )}
                    </button>
                  );
                })}
            </div>

            {/* 관리자 피드백 */}
            <div className="flex items-center gap-1 xl:gap-2 ml-4">
              {[
                { href: '/admin', label: t('admin'), icon: '⚙️' },
                { href: '/feedback', label: t('feedback'), icon: '💬' },
              ].map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[11px] transition-all whitespace-nowrap rounded-lg hover:bg-black/5 ${
                      isActive
                        ? 'text-black font-black'
                        : 'text-gray-500 font-bold hover:text-black'
                    }`}
                  >
                    <span className="text-sm opacity-80" aria-hidden="true">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      {typeof document !== 'undefined' &&
        showModal &&
        createPortal(
          <ConfirmModal
            show={showModal}
            text={isKo ? '로그아웃 하시겠어요?' : '¿Cerrar sesión?'}
            onConfirm={() => {
              setShowModal(false);
              onLogout();
            }}
            onClose={() => setShowModal(false)}
          />,
          document.body,
        )}
    </>
  );
};

export default DesktopHeader;
