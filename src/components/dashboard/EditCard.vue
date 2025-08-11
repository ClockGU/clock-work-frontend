<template>
  <v-card class="pa-4" role="region" :aria-label="$t('ariaLabel.editCard')">
    <v-card-title  class="text-h5 font-weight-bold">
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
        <PetitionTableWithActions
          :petition="selectedPetition"
          :role="role"
          :aria-label="$t('editCard.petitionDetailsTable')"
          @close="emit('deselect-petition');"
          @edit="openEditDialog"
          @refresh="refresh"
        />
      </div>

      <!-- Placeholder when no petition is selected -->
      <v-alert v-else 
        type="info"
        variant="tonal"
        density="comfortable"
      >
        {{ $t('editCard.noPetitionSelected') }}
      </v-alert>

      <!-- Dialogs -->
      <PetitionFormDialog
        v-model="showPetitionForm"
        :role="role"
        :petition="selectedPetition"
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
import PetitionTableWithActions from '../tables/PetitionTableWithActions.vue';

const props = defineProps({
  role: {
    type: String,
    required: true,
  },
  selectedPetition: {
    type: Object,
    default: null,
  }
});

const emit = defineEmits(['refresh','deselect-petition']);

const showPetitionForm = ref(false);
const showStudentDialog = ref(false);

const openNewPetitionDialog = () => {
  emit('deselect-petition'); // Clear any selected petition
  showPetitionForm.value = true;
};
const openStudentDialog = () => showStudentDialog.value = true;

const refresh = (payload) => {
  emit('refresh',payload);
};
</script>