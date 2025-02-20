<template>
  <v-app>
    <v-main :style="{ 'background-color': currentPath === '/' ? 'rgb(var(--v-theme-primary))' : '' }">
      <AppBar />
      <v-container class="d-flex flex-column align-center justify-center pt-0 pb-0" style="height: 100vh; max-width: 1400px"  >
        <router-view />
      </v-container>
      <LoadingOverlay />
      <AppFooter />
    </v-main>
  </v-app>
</template>

<script setup>
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppBar from '@/components/app-bar/AppBar.vue';
import AppFooter from '@/components/AppFooter.vue';

const route= useRoute();
const currentPath = computed(() => route.path);  
</script>
