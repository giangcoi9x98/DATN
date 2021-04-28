import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from "./common_en.json";
import vi from "./common_vi.json";

const resources = {
  en: {
  common: en
  },
  vi: {
    common : vi
  }
}

export const defaultLanguage = "vi";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: resources,
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false
    }
  });

export const lang = [
  { value: "en", name: "English" },
  { value: "vi", name: "Vietnamese" },
];

export default i18n;