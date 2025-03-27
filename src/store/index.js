import { createStore, createLogger } from "vuex"; 
import petitions from "@/store/modules/petitions";
import createPersistedState from "vuex-persistedstate";
import employeeData from "./modules/employeeData";
import snackbar from "./modules/snackbar";
const debug = process.env.NODE_ENV !== "production";

export default createStore({
  modules: {
    petitions,
    employeeData,
    snackbar
  },
  strict: debug,
  plugins: debug
    ? [createLogger(), createPersistedState()] 
    : [createPersistedState()],
});