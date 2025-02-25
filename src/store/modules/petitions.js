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
    //currently update if eos_number is the same
    updatePetition(state, updatedPetition) {
      const index = state.petitions.findIndex(p => p.eos_number === updatedPetition.eos_number);
      if (index > -1) {
        state.petitions[index] = { ...state.petitions[index], ...updatedPetition };
      }
    },
    removePetition(state, petition) {
      const index = state.petitions.indexOf(petition);
      if (index > -1) {
        state.petitions.splice(index, 1);
      }
    },
  },
  getters: {
    petitions: state => state.petitions,
  }
};
