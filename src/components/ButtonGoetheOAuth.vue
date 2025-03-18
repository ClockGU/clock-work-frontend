<template>
  <v-btn :color="color" :loading="loading" v-bind="$attrs" @click="startOAuthFlow">
    <slot>Login</slot> <!-- Default slot content -->
  </v-btn>
</template>

<script setup>
import { ref } from "vue";
import OAuth2Service from "@/services/oauth2";

const props = defineProps({
  color: {
    type: String,
    default: "primary darken-1",
  },
});

const emit = defineEmits(["start", "error"]);

const loading = ref(false);

const startOAuthFlow = async () => {
  loading.value = true;

  try {
    // Fetch the CAS login URL from the backend (or construct it directly)
    const response = await OAuth2Service.getAuthorizationUrl();
    const { authorization_url } = response.data;

    console.log("Authorization URL:", authorization_url);

    // Redirect to the CAS login page
    window.location.href = authorization_url;
  } catch (error) {
    // Handle errors
    loading.value = false;
    console.error("OAuth2 Error:", error);
  }
};
</script>