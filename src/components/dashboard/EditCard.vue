<template>
  <v-card class="pa-4" role="region" :aria-label="$t('editCard.ariaLabel')">
    <v-card-title v-if="!selectedPetition" class="text-h5 font-weight-bold">
      {{ role === "supervisor" ? $t("editCard.supervisorTitle") : $t("editCard.studentTitle") }}
    </v-card-title>
    <v-card-text>
      <!-- Main button - behavior differs by role -->
      <v-btn
        color="primary"
        class="mb-4"
        :aria-label="$t('editCard.openFormDialog')"
        @click="role === 'supervisor' ? openNewPetitionDialog() : openStudentDialog()"
      >
        {{ role === "supervisor" ? $t("editCard.supervisorTitle") : $t("editCard.studentTitle") }}
      </v-btn>

      <!-- Petition Details Table -->
      <div v-if="selectedPetition" class="mt-4" role="table" :aria-label="$t('editCard.petitionDetailsTable')">
        <PetitionDetailsTable
          :petition="selectedPetition"
          :role="role"
          :aria-label="$t('editCard.petitionDetailsTable')"
          @close="selectPetition(null)"
          @edit="openEditDialog"
          @refresh="refresh"
        />
      </div>

      <!-- Placeholder when no petition is selected -->
      <p v-else class="mt-4 ml-1 text-subtitle-1 text-medium-emphasis" role="status" aria-live="polite">
        {{ $t('editCard.noPetitionSelected') }}
      </p>

      <!-- Dialogs -->
      <PetitionFormDialog
        v-model="showPetitionForm"
        :role="role"
        :petition="currentPetition"
        @close="showPetitionForm = false"
        @refresh="refresh"
      />
      <StudentDataManagementDialog
        v-if="role === 'student'"
        v-model="showStudentDialog"
        @close="showStudentDialog = false"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import PetitionFormDialog from '@/components/dialogs/PetitionFormDialog.vue';
import StudentDataManagementDialog from '../dialogs/StudentDataManagementDialog.vue';
import PetitionDetailsTable from '@/components/tables/PetitionDetailsTable.vue';

const props = defineProps({
  role: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['refresh']);

// Dialog visibility
const showPetitionForm = ref(false);
const showStudentDialog = ref(false);

// Petition state
const selectedPetition = ref(null);
const currentPetition = ref(null); // null = empty petition form, object = editing because petitionForm autopopulates a petition

// Dialog handlers
const openNewPetitionDialog = () => {
  currentPetition.value = null; // Ensures empty form
  showPetitionForm.value = true;
};
const openEditDialog = () => {
  currentPetition.value = selectedPetition.value; // Pass petition to edit
  showPetitionForm.value = true;
};
const openStudentDialog = () => {
  showStudentDialog.value = true;
};

const refresh = (payload) => {
  if (payload) {
    switch(payload.type) {
      case 'update':
        // Update selected petition if IDs match
        if (selectedPetition.value?.id === payload.data.id) {
          selectedPetition.value = payload.data;
        }
        break;
      case 'delete':
        // Clear selection if deleted item was selected
        if (selectedPetition.value?.id === payload.data) {
          selectedPetition.value = null;
        }
        break;
    }
  }
  // Always emit to parent to refresh the list
  emit('refresh');
};
const selectPetition = (petition) => {
  selectedPetition.value = petition;
};

defineExpose({ selectPetition });
</script>