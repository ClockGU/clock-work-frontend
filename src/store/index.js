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
      dispatch('auth/logout'); 
      dispatch('snackbar/removeAllSnacks');
    },
  },
  strict: debug,
  plugins: debug
    ? [createLogger(), createPersistedState()]
    : [createPersistedState()],
});