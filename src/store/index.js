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
    loadingData: true,
    locale:
    localStorage.getItem("locale") === null
      ? "de"
      : localStorage.getItem("locale"),
    user: {
      first_name: ""
    },
    backendOffline: false,
    userLoading: false,
    roleSelectionSkipped: false
  },
  getters: {
    user: (state) => state.user,
    userLoading: (state) => state.userLoading,
    locale: (state) => state.locale
  },
  actions: {
    skipRoleSelection({ commit }) {
      commit("setRoleSelectionSkipped", true);
    },
    changeLocale({ commit }, locale) {
      i18n.global.locale.value = locale;
      switchDateFnsLocale(locale);
      commit("updateLocale", locale);
      localStorage.setItem("locale", locale);
    },
    toggleBackend({ commit }) {
      commit("toggleBackend");
    },
    GET_USER({ commit, dispatch, state }) {
      state.userLoading = true;
      return AuthService.getUser()
        .then((response) => {
          commit("SET_USER", response.data);
          //dispatch("changeLocale", response.data.language);

          return Promise.resolve(response);
        })
        .finally(() => {
          state.userLoading = false;
        });
    },
    startLoading({ commit }) {
      commit("startLoading");
    },
    stopLoading({ commit }) {
      commit("stopLoading");
    },
    setUser({ commit }, payload) {
      commit("setUser", payload);
    }
  },
  mutations: {
    setRoleSelectionSkipped(state, value) {
      state.roleSelectionSkipped = value;
    },
    updateLocale(state, locale) {
      state.locale = locale;
    },
    SET_USER(state, payload) {
      state.user = payload;
    },
    toggleBackend(state) {
      state.backendOffline = !state.backendOffline;
    },
    startLoading(state) {
      state.loadingData = true;
    },
    stopLoading(state) {
      state.loadingData = false;
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