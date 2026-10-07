import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from '../../locales/en/common.json';
import hi from '../../locales/hi/common.json';
import ta from '../../locales/ta/common.json';
import es from '../../locales/es/common.json';
import fr from '../../locales/fr/common.json';
import ar from '../../locales/ar/common.json';
import ja from '../../locales/ja/common.json';
import type { LanguageCode } from '../../types';

export const languages: { code: LanguageCode; nativeName: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', nativeName: 'English', dir: 'ltr' },
  { code: 'hi', nativeName: 'हिन्दी', dir: 'ltr' },
  { code: 'ta', nativeName: 'தமிழ்', dir: 'ltr' },
  { code: 'es', nativeName: 'Español', dir: 'ltr' },
  { code: 'fr', nativeName: 'Français', dir: 'ltr' },
  { code: 'ar', nativeName: 'العربية', dir: 'rtl' },
  { code: 'ja', nativeName: '日本語', dir: 'ltr' },
];

export const resources = {
  en: { translation: en },
  hi: { translation: hi },
  ta: { translation: ta },
  es: { translation: es },
  fr: { translation: fr },
  ar: { translation: ar },
  ja: { translation: ja },
};

void i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
});

export function dirFor(language: string): 'ltr' | 'rtl' {
  return languages.find((item) => item.code === language)?.dir ?? 'ltr';
}

export default i18n;
