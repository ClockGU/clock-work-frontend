/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import ApiService from "@/services/api";
import { log } from "@/utils/log";
// Plugins
import { registerPlugins } from "@/plugins";
// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
//store
import store from "./store";

export const debugLogger= true;

ApiService.init(import.meta.env.VITE_API_URL);
ApiService.mountInterceptor();

const isLoggedIn = store.getters["auth/loggedIn"];
if (isLoggedIn) {
  const accessToken = store.getters["auth/accessToken"];
  ApiService.setAccessToken(accessToken);
}

const app = createApp(App);

registerPlugins(app);
log("App initialized");
app.mount("#app");
