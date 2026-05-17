'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useUsersStore } from '@/entities/user';
import { useCategories, CATEGORY_ES_MAP } from '@/entities/content';
import { LogOut, Search, User } from 'lucide-react';
import LangDropdown from './LangDropdown';
import { useLogout } from '@/features/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { ConfirmModal } from '@/shared/ui';
import { Article } from '@/entities/content/model/articles';

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
  suggestions?: Article[];
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
  suggestions = [],
}: MobileHeaderProps) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const t = useTranslations('nav');
  const { isLoggedIn } = useUsersStore();
  const { onLogout } = useLogout();

  const { data: categoryData } = useCategories();
  const apiCategories = categoryData?.data || [];
  const categoriesList = [
    { id: 0, name: '전체', slug: 'all', esName: 'Todos' },
    ...apiCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      esName: CATEGORY_ES_MAP[c.slug] || c.name,
    })),
  ];

  return (
    <>
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
                    <Search />
                  </svg>
                </button>
                <LangDropdown align="right" {...langDropdownProps} />
                {isLoggedIn ? (
                  <>
                    <button type="button" aria-label="로그아웃" onClick={() => setShowModal(true)}>
                      <LogOut color="#4a5565" />
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center hover:opacity-70 transition-opacity flex-shrink-0"
                  >
                    <User />
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center w-full gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex-1 relative">
                <form onSubmit={handleSearch}>
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
                      <Search />
                    </svg>
                  </span>
                </form>
                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 py-1">
                    {suggestions.map((article) => (
                      <li key={article.id}>
                        <button
                          type="button"
                          onClick={() => {
                            router.push(`/article/${article.id}`);
                            setIsSearchOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                        >
                          <Search size={14} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-800 line-clamp-1">
                            {isKo ? article.titleKo : article.titleEs}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                aria-label={isKo ? '검색 닫기' : 'Cerrar búsqueda'}
                className="text-xs font-bold text-gray-500 px-2 cursor-pointer"
              >
                {isKo ? '취소' : 'Cancelar'}
              </button>
            </div>
          )}
        </div>

        {/* Mobile category scroll row */}
        {isHome && (
          <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-hide border-t border-gray-100">
            {categoriesList.map((cat) => {
              const label = isKo ? cat.name : cat.esName;
              const isActive =
                cat.name === activeCategory || (activeCategory === '전체' && cat.name === '전체');
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryClick(cat.name)}
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

export default MobileHeader;
