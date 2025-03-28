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
import ApiService from "@/services/api";
import { log } from "@/utils/log";
const route = useRoute();
const router = useRouter();
const store = useStore();

onMounted(async () => {
  // Replace the history entry to remove the auth code form the browser address bar
  window.history.replaceState({}, null, "/");
  log("LoggingInView mounted");

  try{
  // Extract the CAS token from the query parameters
  const casToken = route.query.code 
  console.log("CAS token from query:", casToken);

  if (!casToken) {
    console.error("No CAS token found in query parameters");
    router.push({ name: "landing" });
    return;
  }

    console.log("Exchanging CAS token for JWT token...");

    // Step 1: Debug the AuthService request
    console.log("Calling AuthService.login with token:", casToken);
    const response = await AuthService.login(casToken);
    console.log("Login response:", response);

    // Step 2: Debug Vuex token commit
    console.log("Committing token to Vuex...");
    store.commit("auth/LOGIN", { 
      access: response.data.access_token, 
      refresh: null 
    });
    console.log("Redirecting to /roles...");
    router.push({ name: "roles" });
   } catch (error) {
     // Step 4: Debug the error
     console.error("Login failed. Error details:", error);
     console.log("Error response data:", error.response?.data);
     router.push({ name: "landing" });
   }
});
</script>