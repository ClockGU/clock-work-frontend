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
      {{ $t("app.loggingin") }}
    </v-row>

  </v-container>
</template>

<script setup>
import {computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import AuthApiService from "@/services/authApiService";

const route = useRoute();
const router = useRouter();
const store = useStore();
const isRoleSelected = computed(() => store.getters["auth/isRoleSelected"]);
const handleError = (error) => {
  AuthApiService.logout();
  store.dispatch("auth/setLoginError",error)
  router.push({ name: "landing" });
  return ;
};

onMounted(async () => {
  // Clean the browser address bar by removing auth code from URL
  window.history.replaceState({}, null, "/");
  try {
    const casToken = route.query.code;
    if (!casToken) return handleError("No CAS token found in URL parameters");

    // Step 1: Authenticate with CAS token
    const loginResponse = await AuthApiService.login(casToken);

    if (!loginResponse.data?.access_token) {
      return handleError("No access token in authentication response");
    }

    // Step 2: Store authentication tokens in Vuex
    try {
      await store.dispatch("auth/login", {
        access_token: loginResponse.data.access_token,
        refresh_token: null
      });
    } catch (error) {
      return handleError(`Failed to store authentication tokens: ${error.message}`);
    }
    // Step 3: Fetch user profile data
    try {
      const userResponse = await AuthApiService.getUser();
      await store.dispatch("auth/setUser", userResponse.data);
      // Authentication flow complete - redirect based on user_role
      const userRole= userResponse.data.user_role;
      if (userRole === 2){
        router.push({path:"/clerk"});
      }else if (userRole === 1){
        router.push({path:"/dashboard/supervisor"});
      }else if(isRoleSelected.value && userRole === 0){
        router.push({path:"/dashboard/student"});
      }else{
        router.push({ name: "roles" });
      }
    } catch (error) {
      return handleError(`Failed to fetch user profile: ${error.message}`);
    }
  } catch (error) {
    console.error(JSON.stringify(error));
    return handleError(error.message);
  }
});
</script>
