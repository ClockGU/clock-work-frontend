<template>
  <v-btn :color="color" :loading="loading" v-bind="$attrs" @click="startOAuthFlow">
    <slot>Login</slot>
  </v-btn>
</template>

<script setup>
import OAuth2Service from "@/services/oauth2";
import {computed} from "vue";
import { useStore } from "vuex";

const props = defineProps({
  color: {
    type: String,
    default: "primary darken-1",
  },
});

const store = useStore();
const loading = computed(() => store.getters["auth/isLoading"]);

const startOAuthFlow = async () => {
  store.dispatch("auth/setIsLoading")
  store.dispatch("auth/clearError")

  try {
    // Fetch the authorization URL from the backend
    const response = await OAuth2Service.getAuthorizationUrl();
    const { authorization_url } = response.data;
    // Redirect to the CAS login page
    window.location.href = authorization_url;
  } catch (error) {
    store.dispatch("auth/setError","Error while connecting to the Goethe University Single Sign On. Please try again later.")
    store.dispatch("auth/logout");
    router.push({ name: "landing" });
    return ;
  }
  finally {
    store.dispatch("auth/unsetLoading")
  }
};
</script>