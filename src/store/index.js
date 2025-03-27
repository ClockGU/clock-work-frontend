import { createStore, createLogger } from "vuex"; 
import petitions from "@/store/modules/petitions";
import createPersistedState from "vuex-persistedstate";
import employeeData from "./modules/employeeData";
import general from "./modules/general";
import snackbar from "./modules/snackbar";
const debug = process.env.NODE_ENV !== "production";

export default createStore({
  modules: {
    petitions,
    employeeData,
    snackbar,
    general
  },
  strict: debug,
  plugins: debug
    ? [createLogger(), createPersistedState()] 
    : [createPersistedState()],
});