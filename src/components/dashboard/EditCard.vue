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
import PetitionDetailsTable from '@/components/tables/PetitionDetailsTable.vue';

const props = defineProps({
  role: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['refresh']);

const showPetitionForm = ref(false);
const showStudentDialog = ref(false);
const selectedPetition = ref(null);

// selectedPetition =null => open an empty form for petition creation
// selectedPetition =object => open form with all data prefilled for editing because petitionForm autopopulates a petition
const openNewPetitionDialog = () => {
  selectedPetition.value = null;
  showPetitionForm.value = true;
};
//const openEditDialog = () => showPetitionForm.value = true;
const openStudentDialog = () => showStudentDialog.value = true;

const selectPetition = (petition) => {
  selectedPetition.value = petition;
};
const refresh = (payload) => {
  if (payload) {
    switch(payload.type) {
      case 'update':
        if (selectedPetition.value?.id === payload.data.id) {
          selectedPetition.value = payload.data;
        }
        break;
      case 'delete':
        if (selectedPetition.value?.id === payload.data) {
          selectedPetition.value = null;
        }
        break;
    }
  }
  emit('refresh');
};

defineExpose({ selectPetition });
</script>