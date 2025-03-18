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
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

</script>
