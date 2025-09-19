'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector).use(initReactI18next).init({
  defaultNS: 'common',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    lookupLocalStorage: 'preferredLanguage',
  },
  resources: {}, // Start empty, load dynamically
});

// Utility to fetch and add translations
export async function loadTranslations(lang: string) {
  try {
    const res = await fetch(`/api/tr/${lang}`);
    if (!res.ok) throw new Error(`Failed to load translations for ${lang}`);
    const data = await res.json();
    i18n.addResources(lang, 'common', data.common);
    i18n.changeLanguage(lang);
  } catch (err) {
    console.error(err);
  }
}

export default i18n;
