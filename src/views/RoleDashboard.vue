<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <!-- EditCard with a ref to allow communication -->
        <EditCard :role="role" ref="editCardRef" />
      </v-col>
      <v-col cols="12" md="6">
        <!-- OverviewCard with event listener for select-petition -->
        <OverviewCard :role="role" @select-petition="handleSelectPetition" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import EditCard from "@/components/dashboard/EditCard.vue";
import OverviewCard from "@/components/dashboard/OverviewCard.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const role = route.params.role; // Get the role from the route

// Create a ref for the EditCard component
const editCardRef = ref(null);

// Handle the select-petition event from OverviewCard
const handleSelectPetition = (petition) => {
  // Pass the selected petition to the EditCard component
  if (editCardRef.value) {
    editCardRef.value.selectPetition(petition);
  }
};
</script>