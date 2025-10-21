import { createStore, createLogger } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import auth from './modules/auth';
import snackbar from './modules/snackbar';

const debug = process.env.NODE_ENV !== 'production';

export default createStore({
  modules: {
    snackbar,
    auth,
  },
  actions: {
    clearAllStates({ dispatch }) {
      commit('snackbar/setResetting', true, { root: true });
      dispatch('auth/logout');
      dispatch('snackbar/removeAllSnacks');
      setTimeout(() => {
        commit('snackbar/setResetting', false, { root: true });
      }, 100);
    },
  },
  strict: debug,
  plugins: debug
    ? [createLogger(), createPersistedState()]
    : [createPersistedState()],
});
