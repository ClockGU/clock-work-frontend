import AuthApiService from "@/services/authApiService";
import ContentApiService from "@/services/contentApiService";
import i18n, { switchDateFnsLocale } from "@/plugins/i18n";

const initialState = () => ({
  locale:
    localStorage.getItem("locale") === null
      ? "de"
      : localStorage.getItem("locale"),
  accessToken: undefined,
  refreshToken: undefined,
  user: undefined,
  loginError: "",
});

const state = initialState;

const getters = {
  locale: (state) => state.locale,
  accessToken: (state) => state.accessToken,
  refreshToken: (state) => state.refreshToken,
  user: (state) => state.user,
  userRole: (state) => state.user? state.user.user_role:undefined,
  isLoggedIn: (state) => !!state.accessToken ,
  loginError: (state) => state.loginError,
};

const mutations = {
  setAccessToken: (state, value) => (state.accessToken = value),
  setRefreshToken: (state, value) => (state.refreshToken = value),
  unsetTokens: (state) => {
    state.accessToken = undefined;
    state.refreshToken = undefined;
  },
  setUser: (state, value) => {
    state.user = value;
  },
  setLoginError: (state, value) => (state.loginError = value),
  clearError: (state) => (state.loginError = ""),
  setLocale: (state, value) => (state.locale = value),
  resetState: (state) => {
    Object.assign(state, initialState());
  },
};

const actions = {
  login: ({ commit }, payload) => {
    commit("setAccessToken", payload.access_token);
    commit("setRefreshToken", payload.refresh_token);
    ContentApiService.setAccessToken(payload.access_token);
    AuthApiService.setAccessToken(payload.access_token);
  },
  logout: ({ commit }) => {
    AuthApiService.logout();
    commit("resetState");
    window.location = "https://cas.rz.uni-frankfurt.de/cas/logout";
  },
  setUser: ({ commit }, payload) => commit("setUser", payload),
  setLoginError: ({ commit }, error) => commit("setLoginError", error),
  clearError: ({ commit }) => commit("clearError"),
  async refreshTokens({ dispatch, getters }) {
    try {
      const response = await AuthApiService.refreshToken(getters.refreshToken);
      await dispatch("login", {
        access_token: response.data.access,
        refresh_token: response.data.refresh,
      });
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  changeLocale({ commit }, locale) {
    i18n.global.locale.value = locale;
    commit("setLocale", locale);
    switchDateFnsLocale(locale);
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};