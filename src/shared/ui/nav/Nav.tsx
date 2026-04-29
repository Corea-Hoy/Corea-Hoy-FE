'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, Suspense, useEffect, useRef } from 'react';

// ── Category data (mirrored from page.tsx) ──────────────────────────────────
const CATEGORIES_KO = ['전체', 'K-POP', '드라마', '뉴스', '문화', '스포츠', '음식'] as const;
const CATEGORIES_ES = ['Todos', 'K-POP', 'Drama', 'Noticias', 'Cultura', 'Deportes', 'Comida'];

// ── LangDropdown ─────────────────────────────────────────────────────────────
interface LangDropdownProps {
  align?: 'right' | 'left';
  isLangOpen: boolean;
  setIsLangOpen: (v: boolean) => void;
  language: 'ko' | 'es';
  setLanguage: (v: 'ko' | 'es') => void;
  langs: { code: 'ko' | 'es'; label: string }[];
  selectLangLabel: string;
}

function LangDropdown({
  align = 'right',
  isLangOpen,
  setIsLangOpen,
  language,
  setLanguage,
  langs,
  selectLangLabel,
}: LangDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={() => setIsLangOpen(!isLangOpen)}
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
            className={`absolute top-full mt-2 z-50 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl min-w-[180px] p-2 animate-in fade-in zoom-in-95 duration-200 ${align === 'right' ? 'right-0' : 'left-0'}`}
          >
            <div className="px-3 py-1.5 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
              {selectLangLabel}
            </div>
            <hr className="my-1 border-gray-100" />
            {langs.map(({ code, label }) => (
              <button
                key={code}
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

// ── Inner component that reads searchParams ─────────────────────────────────
function NavInner() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('nav');
  const [language, setLanguage] = useState<'ko' | 'es'>('ko');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const mobileHeaderRef = useRef<HTMLElement>(null);

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

  const isHome = pathname === '/';
  const isKo = language === 'ko';

  const activeCategory = searchParams.get('category') ?? '전체';

  function handleCategoryClick(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === '전체' || cat === 'Todos') {
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
    router.push('/');
  }

  const langs = [
    { code: 'ko' as const, label: t('langKo') },
    { code: 'es' as const, label: t('langEs') },
  ];

  const langDropdownProps = {
    isLangOpen,
    setIsLangOpen,
    language,
    setLanguage,
    langs,
    selectLangLabel: t('selectLang'),
  };

  const bottomTabs = [
    { href: '/labs', label: t('labs'), icon: '✨' },
    { href: '/feedback', label: t('feedback'), icon: '💬' },
    { href: '/admin', label: t('admin'), icon: '⚙️' },
    { href: '/mypage', label: t('mypage'), icon: '👤' },
  ];

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
              src="/images/logo/logo.svg"
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
                <span className="absolute left-3.5 text-gray-400 text-sm group-focus-within:text-black transition-colors">
                  🔍
                </span>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t('search')}
                  className="w-48 xl:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs focus:bg-white focus:border-black transition-all outline-none placeholder:text-gray-400"
                />
              </div>
            </form>

            <div className="flex items-center gap-4">
              <LangDropdown {...langDropdownProps} />

              <div className="flex items-center gap-3">
                <Link href="/mypage">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 transition-all cursor-pointer shadow-sm hover:scale-105 ${
                      pathname === '/mypage' ? 'border-black' : 'border-transparent'
                    }`}
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Persistent Secondary Nav Bar (Colored for distinction) */}
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

            {/* Right: Utility Links (Always visible) */}
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
                    <span className="text-sm opacity-80">{link.icon}</span>
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
                  className="text-xl p-1 text-gray-600 cursor-pointer"
                >
                  🔍
                </button>
                <LangDropdown {...langDropdownProps} align="right" />
                <Link href="/mypage">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-base border-2 cursor-pointer ${
                      pathname === '/mypage' ? 'border-black' : 'border-transparent'
                    }`}
                  />
                </Link>
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
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm outline-none"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  🔍
                </span>
              </form>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-xs font-bold text-gray-500 px-2"
              >
                {isKo ? '취소' : 'Cancelar'}
              </button>
            </div>
          )}
        </div>

        {/* Mobile category scroll row — always visible on home */}
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-100/50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-around h-16 pb-safe">
          {bottomTabs.map(({ href, label, icon }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 flex-1 py-2 min-w-0 transition-all active:scale-95"
              >
                <span
                  className={`text-xl transition-all duration-300 ${isActive ? 'scale-110 opacity-100' : 'opacity-30 grayscale'}`}
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

export default function Nav() {
  return (
    <Suspense fallback={null}>
      <NavInner />
    </Suspense>
  );
}
