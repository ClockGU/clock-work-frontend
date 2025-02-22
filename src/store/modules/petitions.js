export default {
  namespaced: true,
  state: {
    petitions: []
  },
  actions: {
    setPetitions({ commit }, petitions) {
      commit("setPetitions", petitions);
    },
    addPetition({ commit }, petition) {
      commit("addPetition", petition);
    },
    updatePetition({ commit }, petition) {
      commit("updatePetition", petition);
    },
    removePetition({ commit }, petition) {
      commit("removePetition", petition);
    }
  },
  mutations: {
    setPetitions(state, petitions) {
      state.petitions = petitions;
    },
    addPetition(state, petition) {
      state.petitions.push(petition);
    },
    updatePetition(state, petition) {
      const index = state.petitions.findIndex(p => p.eos_number === petition.eos_number);
      if (index > -1) {
        state.petitions.splice(index, 1, { ...petition }); // Create a new object
      }
    },
    removePetition(state, petition) {
      const index = state.petitions.indexOf(petition);
      if (index > -1) {
        state.petitions.splice(index, 1);
      }
    }
  },
  getters: {
    petitions: state => state.petitions
  }
};
