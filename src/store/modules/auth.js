import AuthService from "@/services/auth";
import ApiService from "@/services/api";
import router from "@/router";
import { log } from "@/utils/log";

const state = {
  accessToken: null,
  refreshToken: null,
  refreshTokenPromise: null,
  checkoutUser: ""
};

const getters = {
  loggedIn: (state) => state.accessToken !== null,
  accessToken: (state) => state.accessToken,
  refreshToken: (state) => state.refreshToken,
  checkoutUser: (state) => state.checkoutUser
};

const actions = {
  // Login using CAS token
  async LOGIN({ commit, dispatch }, { casToken }) {
    try {
      const response = await AuthService.login(casToken);
      log("AuthVuex.login: resolved");
      commit("LOGIN", { access: response.data.access_token, refresh: null }); // No refresh token in new API
      ApiService.setAccessToken(response.data.access_token);

      const resp = await dispatch("GET_USER", null, { root: true });
      return Promise.resolve(resp);
    } catch (error) {
      log("AuthVuex.login: error", error);
      return Promise.reject(error);
    }
  },

  // Login as a supervisor using CAS token
  async LOGIN_SUPERVISOR({ commit, dispatch }, { casToken }) {
    try {
      const response = await AuthService.loginSupervisor(casToken);
      log("AuthVuex.loginSupervisor: resolved");
      commit("LOGIN", { access: response.data.access_token, refresh: null }); // No refresh token in new API
      ApiService.setAccessToken(response.data.access_token);

      const resp = await dispatch("GET_USER", null, { root: true });
      return Promise.resolve(resp);
    } catch (error) {
      log("AuthVuex.loginSupervisor: error", error);
      return Promise.reject(error);
    }
  },

  // Logout the user
  async LOGOUT({ commit }) {
    window.location = "https://cas.rz.uni-frankfurt.de/cas/logout";
    AuthService.logout();

    commit("LOGOUT");
    // We need to catch errors here. Otherwise we get the "NavigationDuplicated" error.
    // See: https://github.com/vuejs/vue-router/issues/2872#issuecomment-519073998
    return router.push({ name: "landing" }).catch((error) => {
      log("Experienced error while logging out: ", error);
      return Promise.reject(error);
    });
  },

  // Refresh the access token
  async REFRESH_TOKEN({ commit, state }) {
    // If this is the first time the refreshToken has been called, make a request
    // otherwise return the same promise to the caller
    if (state.refreshTokenPromise !== null) {
      log("Returning pending token promise");
      return state.refreshTokenPromise;
    }

    try {
      const promise = AuthService.refreshToken(state.accessToken); // Use access token for refresh
      commit("SET_REFRESH_TOKEN_PROMISE", promise);

      const response = await promise;
      commit("LOGIN", { access: response.data.access_token, refresh: null }); // No refresh token in new API
      ApiService.setAccessToken(response.data.access_token);

      commit("SET_REFRESH_TOKEN_PROMISE", null);
      return Promise.resolve(response);
    } catch (error) {
      commit("SET_REFRESH_TOKEN_PROMISE", null);
      return Promise.reject(error);
    }
  }
};

const mutations = {
  LOGIN(state, { access: accessToken, refresh: refreshToken }) {
    state.accessToken = accessToken;

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!refreshToken) {
      // Set the refreshToken if it is provided in the response;
      state.refreshToken = refreshToken;
    }
  },
  LOGOUT(state) {
    state.accessToken = null;
    state.refreshToken = null;
  },
  SET_REFRESH_TOKEN_PROMISE(state, payload) {
    state.refreshTokenPromise = payload;
  },
  SET_CHECKOUT_USER(state, payload) {
    state.checkoutUser = payload;
  },
  CLEAR_CHECKOUT_USER(state) {
    state.checkoutUser = "";
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};