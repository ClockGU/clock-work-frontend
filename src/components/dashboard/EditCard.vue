<template>
  <v-card class="pa-4" role="region" aria-label="Edit Card">
    <v-card-title v-if="!selectedPetition" class="text-h5 font-weight-bold">
      {{ role === "supervisor" ? 'Create Petition' : 'Manage Personal Information' }}
    </v-card-title>
    <v-card-text>
      <!-- Button to open the form dialog -->
      <v-btn
        color="primary"
        class="mb-4"
        @click="openDialog(false)"
        aria-label="Open Form Dialog"
      >
        {{ role === "supervisor" ? 'Create Petition' : 'Edit Personal Information' }}
      </v-btn>

      <!-- Petition Details Table -->
      <div v-if="selectedPetition" class="mt-4" role="table" aria-label="Petition Details Table">
        <PetitionDetailsTable
          :petition="selectedPetition"
          :role="role"
          @close="selectPetition(null)"
          @edit="openDialog(true)"
          aria-label="Petition Details Table"
        />
      </div>

      <!-- Placeholder when no petition is selected -->
      <p v-else class="mt-4 ml-1 text-subtitle-1 text-medium-emphasis" role="status" aria-live="polite">
        You can select a petition from the overview table to view its details.
      </p>

      <!-- open adequate dialog based on role -->
      <PetitionFormDialog
        v-if="role === 'supervisor'"
        v-model="dialog"
        :petition="shouldEditPetition?selectedPetition:null"
        @close="dialog = false"
        aria-label="Petition Form Dialog"
      />
      <StudentDataManagementDialog
        v-else
        v-model="dialog"
        @close="dialog = false"
        aria-label="Student Data Management Dialog"
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
const shouldEditPetition = ref(false);
const openDialog = (shouldEdit) => {
  shouldEditPetition.value = shouldEdit
  dialog.value = true;
};

// Listen for the select-petition event from OverviewCard
const selectPetition = (petition) => {
  selectedPetition.value = petition;
};
defineExpose({ selectPetition });
</script>

