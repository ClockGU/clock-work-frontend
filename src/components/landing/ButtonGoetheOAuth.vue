<template>
  <v-btn
    :color="color"
    :loading="isLoading"
    v-bind="$attrs"
    @click="startOAuthFlow"
  >
    <slot>Login</slot>
  </v-btn>
</template>

<script setup>
import AuthApiService from '@/services/authApiService';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const props = defineProps({
  color: {
    type: String,
    default: 'primary darken-1',
  },
});

const store = useStore();
const router = useRouter();

const isLoading = ref(false);

const startOAuthFlow = async () => {
  isLoading.value = true;
  store.dispatch('auth/clearError');

  try {
    // Fetch the authorization URL from the backend
    const response = await AuthApiService.getAuthorizationUrl();
    const { authorization_url } = response.data;
    // Redirect to the CAS login page
    window.location.href = authorization_url;
  } catch (error) {
    console.error(error);
    AuthApiService.logout();
    store.dispatch(
      'auth/setLoginError',
      'Error while connecting to the Goethe University Single Sign On. Please try again later.'
    );
    router.push({ name: 'landing' });
    return;
  } finally {
    isLoading.value = false;
  }
};
</script>
