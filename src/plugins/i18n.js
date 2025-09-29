import { de, enUS as en } from 'date-fns/locale';
import { createI18n } from 'vue-i18n';
import deLocale from '../locales/de.json';
import enLocale from '../locales/en.json';

const LOCALES = {
  de: {
    messages: deLocale,
    dateFns: de,
  },
  en: {
    messages: enLocale,
    dateFns: en,
  },
};

// Get initial locale from localStorage or default to German
const getInitialLocale = () => {
  return localStorage.getItem('locale') || 'de';
};

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'de',
  messages: {
    de: deLocale,
    en: enLocale,
  },
  allowComposition: true,
});

// Export current date-fns locale
export let currentDateFnsLocale = LOCALES[i18n.global.locale.value].dateFns;

// Function to change locale
export const setLocale = (locale) => {
  if (!LOCALES[locale]) {
    console.warn(`Locale ${locale} not supported, falling back to German`);
    locale = 'de';
  }
  i18n.global.locale.value = locale;
  localStorage.setItem('locale', locale);
  currentDateFnsLocale = LOCALES[locale].dateFns;
};

// Helper to get current locale
export const getCurrentLocale = () => i18n.global.locale.value;

export default i18n;
