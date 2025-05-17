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
        @click="showDialog = true"
        @keydown.enter="showDialog = true"
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
          @refresh="refresh"
        />
      </div>

      <!-- Placeholder when no petition is selected -->
      <v-alert v-else 
        type="info"
        variant="tonal"
        color="blue-darken-3"
        density="comfortable"
      >
        {{ $t('editCard.noPetitionSelected') }}
      </v-alert>

      <!-- Dialogs based on role -->
       <!-- Petition Form Dialog initialized with a null petition for supervisors to create new petitions -->
      <PetitionFormDialog
        v-if="role === 'supervisor'"
        v-model="showDialog"
        @close="showDialog = false"
        @refresh="refresh"
      />
      <StudentDataManagementDialog
        v-else
        v-model="showDialog"
        @close="showDialog = false"
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

const showDialog = ref(false);
const selectedPetition = ref(null);
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