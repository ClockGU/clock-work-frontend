<template>
  <v-app class="ma-0">
    <h1 class="sr-only">Clock Work</h1>
    <NavigationDrawer
      v-if="showAppBarAndFooter"
      class="hidden-md-and-up"
      :drawer="drawer"
      @close-drawer="closeDrawer"
    />

    <AppBar @toggle="toggleDrawer" v-if="showAppBarAndFooter" />

    <v-main
      :style="{
        'background-color':
          currentPath === '/' ? 'rgb(var(--v-theme-primary))' : '',
      }"
    >
      <v-container
        class="d-flex flex-column align-center justify-center pt-0 pb-0"
        style="min-height: 100vh; max-width: 1400px"
      >
        <router-view />
      </v-container>
      <LoadingOverlay />
    </v-main>

    <SnackBar />
    <AppFooter v-if="showAppBarAndFooter" class="mt-8" />
  </v-app>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import AppBar from '@/components/app-bar/AppBar.vue';
import NavigationDrawer from './components/app-bar/NavigationDrawer.vue';
import AppFooter from '@/components/AppFooter.vue';
import SnackBar from '@/components/SnackBar';
const drawer = ref(false);
const route = useRoute();

const currentPath = computed(() => route.path);
const showAppBarAndFooter = computed(
  () => currentPath.value !== '/' && currentPath.value !== '/logging-in'
);

const toggleDrawer = () => (drawer.value = !drawer.value);
const closeDrawer = () => (drawer.value = false);
</script>
<style>
/* Style for visually hidden elements */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
