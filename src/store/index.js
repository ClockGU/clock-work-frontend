import { createStore, createLogger } from "vuex"; 
import petitions from "@/store/modules/petitions";
import createPersistedState from "vuex-persistedstate";

const debug = process.env.NODE_ENV !== "production";

export default createStore({
  modules: {
    petitions,
  },
  strict: debug,
  plugins: debug
    ? [createLogger(), createPersistedState()] 
    : [createPersistedState()],
});