<template>
  <v-btn :color="color" :loading="loading" v-bind="$attrs" @click="startOAuthFlow">
    <slot>Login</slot>
  </v-btn>
</template>

<script setup>
import AuthApiService from "@/services/authApiService";
import {computed} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const props = defineProps({
  color: {
    type: String,
    default: "primary darken-1",
  },
});

const store = useStore();
const router= useRouter();
const loading = computed(() => store.getters["auth/isLoading"]);

const startOAuthFlow = async () => {
  store.dispatch("auth/setIsLoading")
  store.dispatch("auth/clearError")

  try {
    // Fetch the authorization URL from the backend
    const response = await AuthApiService.getAuthorizationUrl();
    const { authorization_url } = response.data;
    // Redirect to the CAS login page
    window.location.href = authorization_url;
  } catch (error) {
    console.error(error);
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
