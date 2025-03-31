import { reactive } from "vue";
import { de, enUS as en } from "date-fns/locale";
import { createI18n } from "vue-i18n";
import deLocale from "../locales/de.json";
import enLocale from "../locales/en.json";

const LOCALES = { de, en };

const localeMessages = {
  de: deLocale,
  en: enLocale
};
export const switchDateFnsLocale = (locale) => {
  currentLocale.locale = LOCALES[locale];
};
export const currentLocale = reactive({ locale: de });

const i18n = createI18n({  
  legacy: false,
  locale:"de",   
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",  
  messages: localeMessages,  
  allowComposition: true,  
});  

export default i18n;  