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

import AuthApiService from '@/services/authApiService';
import setupInterceptors  from '@/services/axiosInterceptor';

const app = createApp(App);
export const debugLogger = true;

// Setup axios interceptors for automatic token handling
setupInterceptors();

// Centralized token initialization
const initializeToken = () => {
  const isLoggedIn = store.getters['auth/isLoggedIn'];
  if (isLoggedIn) {
    const accessToken = store.getters['auth/accessToken'];
    if (accessToken) {
      AuthApiService.setAccessToken(accessToken);
      log('Token initialized from store');
    }
  }
};

//  Initialize token on app start
initializeToken();

// Enhanced store subscription for reliable token synchronization
store.subscribe((mutation, state) => {
  switch (mutation.type) {
    case 'auth/setAccessToken':
    case 'auth/login':
      if (state.auth.accessToken) {
        AuthApiService.setAccessToken(state.auth.accessToken);
        log('Token synchronized from mutation:', mutation.type);
      }
      break;
      
    case 'auth/resetState':
      AuthApiService.removeHeader();
      log('Token headers cleared on logout');
      break;
      
    default:
      break;
  }
});

registerPlugins(app);
log('App initialized');
app.mount('#app');