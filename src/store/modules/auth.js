import AuthApiService from "@/services/authApiService";
import ContentApiService from "@/services/contentApiService";
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
  isRoleSelected: false,
  isLoggedIn: undefined,
  loginError: ""
});

const getters = {
  locale: (state) => state.locale,
  isLoading: (state) => state.loading,
  accessToken: (state) => state.accessToken,
  refreshToken: (state) => state.refreshToken,
  user: (state) => state.user,
  userRole: (state) => state.user.user_role,
  isLoggedIn: (state) => state.user !== undefined,
  loginError: (state) => state.loginError,
  isRoleSelected:(state) => state.isRoleSelected
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
  setLocale: (state, value) => (state.locale = value),
  setIsRoleSelected: (state, value) => (state.isRoleSelected = value)
};

const actions = {
  setIsLoading: ({ commit }) => commit("setLoading", true),
  unsetLoading: ({ commit }) => commit("setLoading", false),
  setIsRoleSelected: ({ commit }, value) => commit("setIsRoleSelected", value),
  login: ({ commit }, payload) => {
    commit("setAccessToken", payload.access_token);
    commit("setRefreshToken", payload.refresh_token);
    ContentApiService.setAccessToken(payload.access_token);
    AuthApiService.setAccessToken(payload.access_token);
  },
  logout: ({ commit }) => {
    AuthApiService.logout();
    commit("unsetTokens")
  },
  setUser: ({ commit }, payload) => commit("setUser", payload),
  setError: ({ commit }, error) => commit("setError", error),
  clearError: ({ commit }) => commit("clearError"),
  async refreshTokens({dispatch, getters }) {
    try {
      const response = await AuthApiService.refreshToken(getters.refreshToken);
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
