<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <EditCard :role="role" />
      </v-col>
      <v-col cols="12" md="6">
        <OverviewCard :role="role" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import EditCard from "@/components/dashboard/EditCard.vue";
import OverviewCard from "@/components/dashboard/OverviewCard.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const role = route.params.role; // Get the role from the route
</script>