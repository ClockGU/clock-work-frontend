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
        @click="openDialog(false)"
      >
        {{ role === "supervisor" ? 'Create Petition' : 'Edit Personal Information' }}
      </v-btn>

      <!-- Petition Details Table -->
      <div v-if="selectedPetition" class="mt-4">
  
        <PetitionDetailsTable
          :petition="selectedPetition"
          :role="role"
          @close="selectPetition(null)"
          @edit="openDialog(true)"
        />
      </div>

      <!-- Placeholder when no petition is selected -->
      <p v-else class="mt-4 ml-1 text-subtitle-1 text-medium-emphasis">
        You can select a petition from the overview table to view its details.
      </p>

      <!-- PetitionFormDialog -->
      <PetitionFormDialog
        v-if="role === 'supervisor'"
        v-model="dialog"
        :petition="shouldEditPetition?selectedPetition:null"
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
import { ref, watch } from 'vue';
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
watch(shouldEditPetition, (val) => {
  console.log(val);
})
defineExpose({ selectPetition });
</script>

