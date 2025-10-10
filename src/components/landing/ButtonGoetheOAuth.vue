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
import { useI18n } from 'vue-i18n';

const props = defineProps({
  color: {
    type: String,
    default: 'primary darken-1',
  },
});

const { t } = useI18n();

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
    loginErrorHandler.setLoginError(t('errors.buttonGoethe.UrlFetch'));
  } finally {
    isLoading.value = false;
  }
};
</script>
