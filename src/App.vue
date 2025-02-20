<template>
  <v-app>
    <v-main :style="{ 'background-color': currentPath === '/' ? 'rgb(var(--v-theme-primary))' : '' }">
        <router-view class="pt-0 pb-0" style="height: 100vh; max-width: 1400px" />
      <LoadingOverlay />
    </v-main>
  </v-app>
</template>

<script setup>
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route= useRoute();
const currentPath = computed(() => route.path);  
</script>
