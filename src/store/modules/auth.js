import ApiService from "@/services/api";
import AuthService from "@/services/auth";
import i18n, { switchDateFnsLocale } from "@/plugins/i18n";
const state = () => ({
  locale:
  localStorage.getItem("locale") === null
    ? "de"
    : localStorage.getItem("locale"),
  loading: false,
  accessToken: undefined,
  refreshToken: undefined,
  user: undefined,
  isLoggedIn: undefined,
  loginError: ""
});

const getters = {
  locale: (state) => state.locale,
  isLoading: (state) => state.loading,
  accessToken: (state) => state.accessToken,
  refreshToken: (state) => state.refreshToken,
  user: (state) => state.user,
  isLoggedIn: (state) => state.user !== undefined,
  loginError: (state) => state.loginError
};

const mutations = {
  setLoading: (state, value) => (state.loading = value),
  setAccessToken: (state, value) => (state.accessToken = value),
  setRefreshToken: (state, value) => (state.refreshToken = value),
  unsetTokens: (state) => {
    state.accessToken = undefined;
    state.refreshToken = undefined;
  },
  setUser: (state, value) => {
    state.user = value;
  },
  setError: (state, value) => state.loginError = value,
  clearError: (state) => (state.loginError = ""),
  setLocale: (state, value) => (state.locale = value)
};

const actions = {
  setIsLoading: ({ commit }) => commit("setLoading", true),
  unsetLoading: ({ commit }) => commit("setLoading", false),
  login: ({ commit }, payload) => {
    commit("setAccessToken", payload.access_token);
    commit("setRefreshToken", payload.refresh_token);
    ApiService.setAccessToken(payload.access_token);
  },
  logout: ({ commit }) => {
    AuthService.logout();
    commit("unsetTokens")
  },
  setUser: ({ commit }, payload) => commit("setUser", payload),
  setError: ({ commit }, error) => commit("setError", error),
  clearError: ({ commit }) => commit("clearError"),
  async refreshTokens({dispatch, getters }) {
    try {
      const response = await AuthService.refreshToken(getters.refreshToken);    
      await dispatch("login", {
        access_token: response.data.access,
        refresh_token: response.data.refresh
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
  mutations
};
