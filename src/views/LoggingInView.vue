<template>
  <v-container>
    <v-row justify="center">
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-row>
    <v-row class="mt-10" justify="center">
      {{ $t('app.loggingin') }}
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import AuthApiService from '@/services/authApiService';
import loginErrorHandler from '@/utils/loginErrorHandler';
import { setLocale } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const store = useStore();
const { t } = useI18n();

onMounted(async () => {
  // Clean the browser address bar by removing auth code from URL
  window.history.replaceState({}, null, '/');

  try {
    const casToken = route.query.code;
    if (!casToken) {
      loginErrorHandler.setLoginError(t('errors.loggingin.NoCasToken'));
      return;
    }

    // Step 1: Authenticate with CAS token
    const loginResponse = await AuthApiService.login(casToken);

    if (!loginResponse.data?.access_token) {
      loginErrorHandler.setLoginError(t('errors.loggingin.NoAccessToken'));
      return;
    }

    // Step 2: Store authentication tokens in Vuex
    await store.dispatch('auth/setTokens', {
      access_token: loginResponse.data.access_token,
      refresh_token: null,
    });

    // Step 3: Fetch user profile data and set language
    const userResponse = await AuthApiService.getUser();
    await store.dispatch('auth/setUser', userResponse.data);
    const locale = userResponse.data.language || 'de';
    setLocale(locale);

    // Authentication flow complete - redirect based on user_role
    const userRole = userResponse.data.user_role;
    if (userRole === 2) {
      router.push({ path: '/clerk' });
    } else if (userRole === 1) {
      router.push({ path: '/dashboard/supervisor' });
    } else if (userRole === 0) {
      router.push({ path: '/dashboard/student' });
    } else {
      router.push({ name: 'roles' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    loginErrorHandler.setLoginError(t('errors.loggingin.generic'));
  }
});
</script>
