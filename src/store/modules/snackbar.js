import { v4 as uuidv4 } from 'uuid';

const defaultState = {
  snack: null,
  timeout: 5000,
  color: 'success',
};

const state = {
  snackbar: {
    ...defaultState,
  },
  snacks: [],
};

const getters = {
  snacks: (state) => state.snacks,
};
const defaultSnackPayload = {
  message: 'Snack Message',
  timeout: 4000,
  color: 'success',
  timePassed: 0,
  show: true,
};

const actions = {
  setSnack({ commit }, payload) {
    payload.uuid = uuidv4();
    commit('setSnack', { ...defaultSnackPayload, ...payload });
  },
  setErrorSnacks(
    { commit },
    errorPayload,
    options = { timeout: 4000, color: 'error', timePassed: 0, show: true }
  ) {
    for (const [key, value] of Object.entries(errorPayload)) {
      let snackMsg =
        key !== 'non_field_errors' ? `Field ${key}:` : `Context Errors:`;
      if (Array.isArray(value)) {
        snackMsg = snackMsg + value.join('\n');
      } else {
        snackMsg = snackMsg + value;
      }
      const payload = { ...options, message: snackMsg };
      commit('setSnack', payload);
    }
  },
  removeSnack({ commit }, uuid) {
    commit('removeSnack', uuid);
  },
};
const mutations = {
  setSnack(state, payload) {
    state.snacks.push(payload);
  },
  removeSnack(state, uuid) {
    state.snacks = state.snacks.filter((snack) => snack.uuid !== uuid);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
