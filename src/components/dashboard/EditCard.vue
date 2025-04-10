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
        :aria-label="$t('editCard.openFormDialog')"
        @click="openDialog(false)"
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
          @edit="openDialog(true)"
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
        :role="role"
        :petition="shouldEditPetition?selectedPetition:null"
        :aria-label="$t('editCard.petitionFormDialog')"
        @close="dialog = false"
      />
      <StudentDataManagementDialog
        v-else
        v-model="dialog"
        :aria-label="$t('editCard.studentDataManagementDialog')"
        @close="dialog = false"
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
  petition: {
    type: [Object, null],
    required: false,
    default: null,
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