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
        Einloggen...
      </v-row>
    </v-container>
  </template>

<script setup>
import OAuth2Service from "@/services/oauth2";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

onMounted(async () => {
  try {
    // Step 1: Redirect to CAS for login
    const response = await OAuth2Service.getAuthorizationUrl();
    const authorizationUrl = response.data.authorization_url;

    // Redirect to CAS login page
    window.location.href = authorizationUrl;
  } catch (error) {
    console.error("Error during CAS login redirection:", error);
    store.dispatch("snackbar/setSnack", {
      snack: "Something went wrong during login redirection. Please try again.",
      color: "error",
    });
    router.push({ name: "landing" }); // Redirect back to landing page on error
  }
});

</script>
