import ApiService from "@/services/api";
import i18n, { switchDateFnsLocale } from "@/plugins/i18n";


const state = ()=>({
  locale:
    localStorage.getItem("locale") === null
      ? "de"
      : localStorage.getItem("locale"),
})

const getters = {
  locale: (state) => state.locale,
};
const mutations = {
  changeLocale(state, locale) {
    state.locale = locale;
  },
};

const actions = {
  changeLocale({ commit }, locale) {
    commit("changeLocale", locale);
    localStorage.setItem("locale", locale);
    switchDateFnsLocale(locale);
    i18n.global.locale.value = locale;
  },
};