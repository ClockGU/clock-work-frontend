<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <EditCard role="student" />
      </v-col>
      <v-col cols="12" md="6">
        <OverviewCard role="student" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import EditCard from "@/components/dashboard/EditCard.vue";
import OverviewCard from "@/components/dashboard/OverviewCard.vue";
</script>