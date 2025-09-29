import AuthApiService from '@/services/authApiService';

const initialState = () => ({
  accessToken: undefined,
  refreshToken: undefined,
  user: undefined,
  loginError: '',
});

const state = initialState;

const getters = {
  accessToken: (state) => state.accessToken,
  refreshToken: (state) => state.refreshToken,
  user: (state) => state.user,
  userRole: (state) => (state.user ? state.user.user_role : undefined),
  isLoggedIn: (state) => !!state.accessToken,
  loginError: (state) => state.loginError,
};

const mutations = {
  setAccessToken: (state, value) => (state.accessToken = value),
  setRefreshToken: (state, value) => (state.refreshToken = value),
  setUser: (state, value) => {
    state.user = value;
  },
  setLoginError: (state, value) => (state.loginError = value),
  clearError: (state) => (state.loginError = ''),
  resetState: (state) => {
    Object.assign(state, initialState());
  },
};

const actions = {
  login: ({ commit }, payload) => {
    commit('setAccessToken', payload.access_token);
    commit('setRefreshToken', payload.refresh_token);
  },
  logout: ({ commit }) => {
    commit('resetState');
    AuthApiService.logout();
    window.location = 'https://cas.rz.uni-frankfurt.de/cas/logout';
  },
  setUser: ({ commit }, payload) => commit('setUser', payload),
  setLoginError: ({ commit }, error) => commit('setLoginError', error),
  clearError: ({ commit }) => commit('clearError'),
  async refreshTokens({ dispatch, getters }) {
    try {
      const response = await AuthApiService.refreshToken(getters.refreshToken);
      await dispatch('login', {
        access_token: response.data.access,
        refresh_token: response.data.refresh,
      });
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
