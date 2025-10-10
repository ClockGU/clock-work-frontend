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
import loginErrorHandler from '@/utils/loginErrorHandler';
import { ref } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: 'primary darken-1',
  },
});

const isLoading = ref(false);

const startOAuthFlow = async () => {
  isLoading.value = true;
  loginErrorHandler.clearLoginError();

  try {
    const response = await AuthApiService.getAuthorizationUrl();
    const { authorization_url } = response.data;
    window.location.href = authorization_url;
  } catch (error) {
    console.error(error);
    AuthApiService.logout();
    loginErrorHandler.setLoginError(
      'Error while connecting to the Goethe University Single Sign On. Please try again later.'
    );
  } finally {
    isLoading.value = false;
  }
};
</script>
