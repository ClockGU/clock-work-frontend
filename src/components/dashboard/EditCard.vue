<template>
  <v-card class="pa-4">
    <v-card-title v-if="!selectedPetition" class="text-h5 font-weight-bold">
      {{ role === "supervisor" ? 'Create Petition' : 'Manage Personal Information' }}
    </v-card-title>
    <v-card-text>
      <!-- Button to open the form dialog -->
      <v-btn
        color="primary"
        class="mb-4"
        @click="openDialog"
      >
        {{ role === "supervisor" ? 'Create Petition' : 'Edit Personal Information' }}
      </v-btn>

      <!-- Petition Details Table -->
      <div v-if="selectedPetition" class="mt-4">
  
        <PetitionDetailsTable
          :petition="selectedPetition"
          @close="selectPetition(null)"
        />
        <v-btn
          color="error"
          text
          class="mt-3"
          variant="text"
          @click="selectPetition(null)"
        >
          Close Details
        </v-btn>
      </div>

      <!-- Placeholder when no petition is selected -->
      <p v-else class="mt-4 ml-1 text-body-1">
        You can select a petition from the overview table to view its details.
      </p>

      <!-- PetitionFormDialog -->
      <PetitionFormDialog
        v-if="role === 'supervisor'"
        v-model="dialog"
        :role="role"
        :petition="selectedPetition"
        @close="dialog = false"
      />
      <StudentDataManagementDialog
        v-else
        v-model="dialog"
        @close="dialog = false"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import PetitionFormDialog from '@/components/dialogs/PetitionFormDialog.vue';
import StudentDataManagementDialog from '../dialogs/StudentDataManagementDialog.vue';
import PetitionDetailsTable from '@/components/dashboard/PetitionDetailsTable.vue';

const props = defineProps({
  role: {
    type: String,
    required: true,
  },
  petition: {
    type: [Object, null],
    required: false,
  },
});

const dialog = ref(false);
const selectedPetition = ref(null);

const openDialog = () => {
  dialog.value = true;
};

// Listen for the select-petition event from OverviewCard
const selectPetition = (petition) => {
  selectedPetition.value = petition;
};

defineExpose({ selectPetition });
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}

.v-card-title {
  padding-bottom: 16px;
}

.v-btn {
  text-transform: capitalize;
  font-weight: 500;
}

.text-body-1 {
  color: rgba(0, 0, 0, 0.6); /* Subtle text color for the placeholder */
}
</style>