'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLanguageStore } from '@/shared/model';
import { useUserStore } from '@/entities/user';
import { useState, Suspense, useEffect, useRef } from 'react';
import { CATEGORIES_KO, CATEGORIES_ES } from '@/entities/content';

/* ─── LangDropdown (외부 선언으로 렌더 중 재생성 방지) ─── */
function LangDropdown({
  align = 'right',
  language,
  isLangOpen,
  setIsLangOpen,
  setLanguage,
  selectLangLabel,
  langs,
}: {
  align?: 'right' | 'left';
  language: string;
  isLangOpen: boolean;
  setIsLangOpen: (v: boolean) => void;
  setLanguage: (code: 'ko' | 'es') => void;
  selectLangLabel: string;
  langs: { code: 'ko' | 'es'; label: string }[];
}) {
  return (
    <div className="relative">
      <button
        onClick={() => setIsLangOpen(!isLangOpen)}
        aria-expanded={isLangOpen}
        aria-haspopup="listbox"
        aria-label={selectLangLabel}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer group"
      >
        <span className="text-base leading-none">🌐</span>
        <span className="leading-none">{language.toUpperCase()}</span>
        <span
          className={`text-[10px] text-gray-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </button>

      {isLangOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
          <div
            role="listbox"
            aria-label={selectLangLabel}
            className={`absolute top-full mt-2 z-50 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl min-w-[180px] p-2 animate-in fade-in zoom-in-95 duration-200 ${align === 'right' ? 'right-0' : 'left-0'}`}
          >
            <div className="px-3 py-1.5 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
              {selectLangLabel}
            </div>
            <hr className="my-1 border-gray-100" />
            {langs.map(({ code, label }) => (
              <button
                key={code}
                role="option"
                aria-selected={language === code}
                onClick={() => {
                  setLanguage(code);
                  setIsLangOpen(false);
                }}
                className={`w-full flex justify-between items-center px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                  language === code
                    ? 'bg-black text-white font-bold'
                    : 'text-gray-600 hover:bg-gray-50 font-medium'
                }`}
              >
                {label}
                {language === code && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── HeaderInner ─── */
function HeaderInner() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('nav');
  const { language, setLanguage } = useLanguageStore();
  const { user, isLoggedIn, logout } = useUserStore();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const mobileHeaderRef = useRef<HTMLElement>(null);

  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '');

  // Close search on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (mobileHeaderRef.current && !mobileHeaderRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
    }
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  // Close lang dropdown on Escape
  useEffect(() => {
    if (!isLangOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsLangOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLangOpen]);

  const isHome = pathname === '/';
  const isKo = language === 'ko';
  const activeCategory = searchParams.get('category') ?? '전체';

  function handleCategoryClick(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === '전체') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue.trim()) {
      params.set('q', searchValue.trim());
    } else {
      params.delete('q');
    }
    router.push(`/?${params.toString()}`);
    setIsSearchOpen(false);
  }

  function handleLogout() {
    logout();
    router.push('/');
  }

  const langs: { code: 'ko' | 'es'; label: string }[] = [
    { code: 'ko', label: t('langKo') },
    { code: 'es', label: t('langEs') },
  ];

  const bottomTabs = [
    { href: '/', label: t('home'), icon: '🏠' },
    { href: '/labs', label: t('labs'), icon: '✨' },
    { href: '/feedback', label: t('feedback'), icon: '💬' },
    {
      href: isLoggedIn ? '/mypage' : '/login',
      label: isLoggedIn ? t('mypage') : t('login'),
      icon: '👤',
    },
  ];

  const langDropdownProps = {
    language,
    isLangOpen,
    setIsLangOpen,
    setLanguage,
    selectLangLabel: t('selectLang'),
    langs,
  };

  return (
    <>
      {/* ─────────────────────────────────────────
          Desktop GNB  (lg and above)
      ───────────────────────────────────────── */}
      <nav className="hidden lg:block sticky top-0 z-50 bg-white shadow-sm">
        {/* Top bar */}
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between border-b border-gray-100">
          <Link
            href="/"
            className="flex items-center hover:opacity-70 transition-opacity flex-shrink-0"
          >
            <Image
              src="/logo.png"
              alt="Corea Hoy"
              width={120}
              height={48}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative group">
              <div className="relative flex items-center">
                <span
                  className="absolute left-3.5 text-gray-400 text-sm group-focus-within:text-black transition-colors"
                  aria-hidden="true"
                >
                  🔍
                </span>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t('search')}
                  aria-label={t('search')}
                  className="w-48 xl:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs focus:bg-white focus:border-black transition-all outline-none placeholder:text-gray-400"
                />
              </div>
            </form>

            <div className="flex items-center gap-4">
              <LangDropdown {...langDropdownProps} />

              {isLoggedIn && user ? (
                <div className="flex items-center gap-3">
                  <Link href="/mypage">
                    <div
                      aria-label={t('mypage')}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 transition-all cursor-pointer shadow-sm hover:scale-105 ${
                        pathname === '/mypage' ? 'border-black' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: user.avatarColor }}
                    >
                      {user.avatarEmoji}
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2 text-sm font-black text-black bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                >
                  {t('login')}
                </Link>
              )}
            </div>
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

            {/* Right: Utility Links */}
            <div className="flex items-center gap-1 xl:gap-2 ml-4">
              {[
                { href: '/admin', label: t('admin'), icon: '⚙️' },
                { href: '/labs', label: t('labs'), icon: '✨' },
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

      {/* ─────────────────────────────────────────
          Mobile Top Header  (below lg)
      ───────────────────────────────────────── */}
      <header
        ref={mobileHeaderRef}
        className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm shadow-gray-200/20"
      >
        <div className="flex items-center justify-between px-4 h-14 relative">
          {!isSearchOpen ? (
            <>
              <Link href="/" className="hover:opacity-70 transition-opacity">
                <Image
                  src="/logo.png"
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
                  🔍
                </button>
                <LangDropdown align="right" {...langDropdownProps} />
                {isLoggedIn && user ? (
                  <Link href="/mypage">
                    <div
                      aria-label={t('mypage')}
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
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    {t('login')}
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
                  🔍
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

      {/* ─────────────────────────────────────────
          Mobile Bottom Tab Bar  (below lg)
      ───────────────────────────────────────── */}
      <nav
        aria-label={isKo ? '주요 메뉴' : 'Menú principal'}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-100/50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center justify-around h-16 pb-safe">
          {bottomTabs.map(({ href, label, icon }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className="flex flex-col items-center gap-1 flex-1 py-2 min-w-0 transition-all active:scale-95"
              >
                <span
                  className={`text-xl transition-all duration-300 ${isActive ? 'scale-110 opacity-100' : 'opacity-30 grayscale'}`}
                  aria-hidden="true"
                >
                  {icon}
                </span>
                <span
                  className={`text-[10px] font-bold truncate max-w-full px-1 transition-colors ${isActive ? 'text-black' : 'text-gray-400'}`}
                >
                  {label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 bg-black rounded-full mt-0.5 animate-in zoom-in duration-300" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={null}>
      <HeaderInner />
    </Suspense>
  );
}
