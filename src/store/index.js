import { createStore, createLogger } from "vuex"; 
import createPersistedState from "vuex-persistedstate";
import petitions from "@/store/modules/petitions";
import employeeData from "./modules/employeeData";
import auth from "./modules/auth";
import snackbar from "./modules/snackbar";

const debug = process.env.NODE_ENV !== "production";

export default createStore({
  modules: {
    petitions,
    employeeData,
    snackbar,
    auth
  },
  strict: debug,
  plugins: debug
    ? [createLogger(), createPersistedState()] 
    : [createPersistedState()],
});