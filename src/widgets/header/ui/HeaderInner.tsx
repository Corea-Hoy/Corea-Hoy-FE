'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLanguageStore } from '@/shared/model';
import { useState, useEffect, useRef } from 'react';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import MobileTopBar from './MobileTopBar';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { getSuggestions } from '@/views/home/api/articles.api';

export function HeaderInner() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('nav');
  const { language, setLanguage } = useLanguageStore();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const mobileHeaderRef = useRef<HTMLElement>(null);

  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '');
  const debouncedSearch = useDebounce(searchValue, 300);

  const { data: suggestionsData } = useQuery({
    queryKey: ['suggestions', debouncedSearch],
    queryFn: async () => {
      const res = await getSuggestions(debouncedSearch);
      return res.data.data;
    },
    enabled: debouncedSearch.length >= 2,
  });

  const suggestions = suggestionsData || [];

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

  const langs: { code: 'ko' | 'es'; label: string }[] = [
    { code: 'ko', label: t('langKo') },
    { code: 'es', label: t('langEs') },
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
      <DesktopHeader
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
        langDropdownProps={langDropdownProps}
        isHome={isHome}
        isKo={isKo}
        activeCategory={activeCategory}
        handleCategoryClick={handleCategoryClick}
        suggestions={suggestions}
      />

      <MobileHeader
        mobileHeaderRef={mobileHeaderRef}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
        isKo={isKo}
        langDropdownProps={langDropdownProps}
        isHome={isHome}
        activeCategory={activeCategory}
        handleCategoryClick={handleCategoryClick}
        suggestions={suggestions}
      />

      <MobileTopBar isKo={isKo} />
    </>
  );
}
