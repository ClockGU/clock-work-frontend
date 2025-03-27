<template>
  <v-card class="pa-4" role="region" :aria-label="$t('editCard.ariaLabel')">
    <v-card-title v-if="!selectedPetition" class="text-h5 font-weight-bold">
      {{ role === "supervisor" ? $t("editCard.supervisorTitle") : $t("editCard.studentTitle") }}
    </v-card-title>
    <v-card-text>
      <!-- Button to open the form dialog -->
      <v-btn
        color="primary"
        class="mb-4"
        @click="openDialog(false)"
        :aria-label="$t('editCard.openFormDialog')"
      >
      {{ role === "supervisor" ? $t("editCard.supervisorTitle") : $t("editCard.studentTitle") }}
      </v-btn>

      <!-- Petition Details Table -->
      <div v-if="selectedPetition" class="mt-4" role="table" :aria-label="$t('editCard.petitionDetailsTable')">
        <PetitionDetailsTable
          :petition="selectedPetition"
          :role="role"
          @close="selectPetition(null)"
          @edit="openDialog(true)"
          :aria-label="$t('editCard.petitionDetailsTable')"
        />
      </div>

      <!-- Placeholder when no petition is selected -->
      <p v-else class="mt-4 ml-1 text-subtitle-1 text-medium-emphasis" role="status" aria-live="polite">
        {{ $t('editCard.noPetitionSelected') }}
      </p>

      <!-- open adequate dialog based on role -->
      <PetitionFormDialog
        v-if="role === 'supervisor'"
        v-model="dialog"
        :petition="shouldEditPetition?selectedPetition:null"
        @close="dialog = false"
        :aria-label="$t('editCard.petitionFormDialog')"
      />
      <StudentDataManagementDialog
        v-else
        v-model="dialog"
        @close="dialog = false"
        :aria-label="$t('editCard.studentDataManagementDialog')"
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