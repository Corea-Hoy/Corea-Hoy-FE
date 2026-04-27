import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'ko' | 'es';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'ko',
      setLanguage: (language) => set({ language }),
    }),
    { name: 'coreahoy-language' },
  ),
);
