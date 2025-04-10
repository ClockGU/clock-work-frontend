/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import { log } from "@/utils/log";
// Plugins
import { registerPlugins } from "@/plugins";
// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
//store
import store from "./store";

const app = createApp(App);
export const debugLogger= true;

import ApiService from "@/services/api";

ApiService.init(import.meta.env.VITE_API_URL);
ApiService.mountInterceptor();

const isLoggedIn = store.getters["auth/loggedIn"];
if (isLoggedIn) {
  const accessToken = store.getters["auth/accessToken"];
  ApiService.setAccessToken(accessToken);
}


registerPlugins(app);
log("App initialized");
app.mount("#app");
