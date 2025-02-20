<template>
  <v-app>
    <NavigationDrawer
      class="hidden-md-and-up"
      :drawer="drawer"
      @close-drawer="closeDrawer"
    />

    <AppBar @toggle="toggleDrawer" />
    <v-main :style="{ 'background-color': currentPath === '/' ? 'rgb(var(--v-theme-primary))' : '' }">
      <v-container class="d-flex flex-column align-center justify-center pt-0 pb-0" style="height: 100vh; max-width: 1400px"  >
        <router-view />
      </v-container>
      <LoadingOverlay />
      <AppFooter />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed,ref } from "vue";
import { useRoute } from "vue-router";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import AppBar from '@/components/app-bar/AppBar.vue';
import NavigationDrawer from "./components/app-bar/NavigationDrawer.vue";
import AppFooter from '@/components/AppFooter.vue';

const drawer = ref(false);

const toggleDrawer = () => {
  drawer.value = !drawer.value
}
const closeDrawer = () => drawer.value = false
const route= useRoute();
const currentPath = computed(() => route.path);  
</script>
