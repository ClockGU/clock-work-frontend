import { createStore, createLogger } from "vuex"; 
import petitions from "@/store/modules/petitions";
import createPersistedState from "vuex-persistedstate";
import employeeData from "./modules/employeeData";

const debug = process.env.NODE_ENV !== "production";

export default createStore({
  modules: {
    petitions,
    employeeData
  },
  strict: debug,
  plugins: debug
    ? [createLogger(), createPersistedState()] 
    : [createPersistedState()],
});