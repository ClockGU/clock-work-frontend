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
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import AuthService from "@/services/auth";

const route = useRoute();
const router = useRouter();
const store = useStore();
const handleError = (error) => {
  store.dispatch("auth/unsetLoading");
  store.dispatch("auth/setError",error)
  store.dispatch("auth/logout");
  router.push({ name: "landing" });
  return ;
};

onMounted(async () => {
  // Clean the browser address bar by removing auth code from URL
  window.history.replaceState({}, null, "/");
  console.log("LoggingInView component mounted");
  store.dispatch("auth/setIsLoading");
  try {
    const casToken = route.query.code;
    console.log("Extracted CAS token from URL:", casToken);
    if (!casToken) return handleError("No CAS token found in URL parameters");

    // Step 1: Authenticate with CAS token
    console.log("Initiating authentication with CAS token...");
    const loginResponse = await AuthService.login(casToken);
    console.log("Received authentication response:", loginResponse);

    if (!loginResponse.data?.access_token) {
      return handleError("No access token in authentication response");
    }

    // Step 2: Store authentication tokens in Vuex
    try {
      console.log("Storing authentication tokens in Vuex store...");
      await store.dispatch("auth/login", {
        access_token: loginResponse.data.access_token,
        refresh_token: null
      });
      console.log("Authentication tokens successfully stored");
    } catch (error) {
      return handleError(`Failed to store authentication tokens: ${error.message}`);
    }

    // Step 3: Fetch user profile data
    try {
      console.log("Fetching user profile data...");
      const userResponse = await AuthService.getUser();
      console.log("Received user profile:", userResponse.data);

      await store.dispatch("auth/setUser", userResponse.data);
      console.log("User profile successfully stored in Vuex");
      store.dispatch("auth/unsetLoading");
      // Authentication flow complete - redirect to roles selection
      router.push({ name: "roles" });
    } catch (error) {
      return handleError(`Failed to fetch user profile: ${error.message}`);
    }

  } catch (error) {
    return handleError(error.message);
  }
});
</script>