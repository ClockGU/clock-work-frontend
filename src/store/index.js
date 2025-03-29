import { createStore, createLogger } from "vuex"; 
import createPersistedState from "vuex-persistedstate";
import i18n, { switchDateFnsLocale } from "@/plugins/i18n";
import AuthService from "@/services/auth";
import petitions from "@/store/modules/petitions";
import employeeData from "./modules/employeeData";
import auth from "./modules/auth";
import snackbar from "./modules/snackbar";

const debug = process.env.NODE_ENV !== "production";

export default createStore({
  state: {
    locale:
    localStorage.getItem("locale") === null
      ? "de"
      : localStorage.getItem("locale"),
    user: {
      first_name: ""
    },
    userLoading: false,
  },
  getters: {
    user: (state) => state.user,
    userLoading: (state) => state.userLoading,
    locale: (state) => state.locale
  },
  actions: {
    changeLocale({ commit }, locale) {
      i18n.global.locale.value = locale;
      switchDateFnsLocale(locale);
      commit("updateLocale", locale);
      localStorage.setItem("locale", locale);
    },
    GET_USER({ commit, dispatch, state }) {
      commit("setUserLoading", true);
      return AuthService.getUser()
        .then((response) => {
          commit("setUser", response.data);
          //dispatch("changeLocale", response.data.language);
          return Promise.resolve(response);
        })
        .finally(() => {
          commit("setUserLoading", false);
        });
    },
    setUser({ commit }, payload) {
      commit("setUser", payload);
    }
  },
  mutations: {
    setUserLoading(state, value) {
      state.userLoading = value;
    },
    setRoleSelectionSkipped(state, value) {
      state.roleSelectionSkipped = value;
    },
    updateLocale(state, locale) {
      state.locale = locale;
    },
    setUser(state, payload) {
      state.user = { ...payload };
    }
  },
  modules: {
    petitions,
    employeeData,
    snackbar,
    auth
  },
  strict: debug,
  plugins: debug
    ? [createLogger(), createPersistedState()] 
    : [createPersistedState()],
});