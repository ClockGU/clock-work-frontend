<template>
  <v-card 
    class="pa-4" 
    role="region" 
    :aria-label="$t('ariaLabel.editCard')"
    tabindex="0">
    <v-card-title>
      <h2 class="text-h5 font-weight-bold">
        {{ userRole === 1 ? $t("editCard.supervisorTitle") : $t("editCard.studentTitle") }}
      </h2>
    </v-card-title>
    <v-card-text>
      <!-- Main button - behavior differs by role -->
      <v-btn
        color="primary"
        class="mb-4"
        :aria-label="$t('editCard.openFormDialog')"
        @click="userRole === 1 ? openNewPetitionDialog() : openStudentDialog()"
      >
        {{ userRole === 1 ? $t("editCard.supervisorTitle") : $t("editCard.studentTitle") }}
      </v-btn>

      <!-- Petition Details Table -->
      <div v-if="selectedPetition" class="mt-4" role="table" :aria-label="$t('editCard.petitionDetailsTable')">
        <PetitionTableWithActions
          :petition="selectedPetition"
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
        :petition="selectedPetition"
        @close="showPetitionForm = false"
        @refresh="refresh"
      />
      <StudentDataManagementDialog
        v-if="userRole===0"
        v-model="showStudentDialog"
        @close="showStudentDialog = false"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref,computed } from 'vue';
import { useStore } from 'vuex';
import PetitionFormDialog from '@/components/dialogs/PetitionFormDialog.vue';
import StudentDataManagementDialog from '../dialogs/StudentDataManagementDialog.vue';
import PetitionTableWithActions from '../tables/PetitionTableWithActions.vue';

const props = defineProps({
  selectedPetition: {
    type: Object,
    default: null,
  }
});

const emit = defineEmits(['refresh','deselect-petition']);

const showPetitionForm = ref(false);
const showStudentDialog = ref(false);
const store = useStore();
const userRole = computed(() => store.getters['auth/userRole']);

const openNewPetitionDialog = () => {
  emit('deselect-petition'); // Clear any selected petition
  showPetitionForm.value = true;
};
const openStudentDialog = () => showStudentDialog.value = true;

const refresh = (payload) => {
  emit('refresh',payload);
};
</script>