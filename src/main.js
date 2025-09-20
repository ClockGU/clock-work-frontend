/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import { log } from '@/utils/log';
// Plugins
import { registerPlugins } from '@/plugins';
// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';
//store
import store from './store';

const app = createApp(App);
export const debugLogger = true;

import AuthApiService from '@/services/authApiService';
import ContentApiService from '@/services/contentApiService';
import { attachAuthInterceptor } from '@/interceptors/common';

const unmountAuthInterceptor = attachAuthInterceptor(
  AuthApiService.getAxiosInstance()
);
const unmountContentInterceptor = attachAuthInterceptor(
  ContentApiService.getAxiosInstance()
);

const isLoggedIn = store.getters['auth/loggedIn'];
if (isLoggedIn) {
  const accessToken = store.getters['auth/accessToken'];
  ContentApiService.setAccessToken(accessToken);
  AuthApiService.setAccessToken(accessToken);
}

registerPlugins(app);
log('App initialized');
app.mount('#app');
