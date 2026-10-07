import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CurrencyCode, LanguageCode } from '../types';

interface UiState {
  language: LanguageCode;
  currency: CurrencyCode;
  dark: boolean;
  localTime: boolean;
  setLanguage: (language: LanguageCode) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setDark: (dark: boolean) => void;
  setLocalTime: (localTime: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      language: 'en',
      currency: 'USD',
      dark: window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
      localTime: false,
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setDark: (dark) => set({ dark }),
      setLocalTime: (localTime) => set({ localTime }),
    }),
    { name: 'assembly-ui' },
  ),
);
