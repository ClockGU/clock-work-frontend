/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

export const REFERENCE_FIELD_NAME = "supervised_references";
export const debugLogger= true;
const app = createApp(App);

registerPlugins(app);

app.mount("#app");
