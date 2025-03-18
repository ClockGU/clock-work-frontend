<template>
    <v-btn :color="color" :loading="loading" v-bind="$attrs" @click="startOAuthFlow">
      <slot></slot>
    </v-btn>
  </template>
  
  <script setup>
  import { log } from "@/utils/log";
  import { ref } from "vue";
  import OAuth2Service from "@/services/oauth2";
  
  const props = defineProps({
    color: {
      type: String,
      default: "primary darken-1"
    },

  });
  
  const loading = ref(false);
  
  const startOAuthFlow = async () => {
    loading.value = true;
    try {
      const response = await OAuth2Service.getAuthorizationUrl();
      const { authorization_url } = response.data;
  
      window.location = authorization_url;
  
      setTimeout(() => {
        loading.value = false;
      }, 5000);
    } catch (error) {
      // TODO: Put component into error state
      loading.value = false;
      log(error);
    }
  };
  </script>

