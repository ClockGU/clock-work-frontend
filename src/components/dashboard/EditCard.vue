<template>
  <!-- Dialogs -->
  <PetitionFormDialog
    v-model="showPetitionForm"
    :petition="selectedPetition"
    @close="showPetitionForm = false"
    @refresh="refresh"
  />
  <StudentDataManagementDialog
    v-if="userRole === 0"
    v-model="showStudentDialog"
    @close="showStudentDialog = false"
  />
  <v-card
    class="py-4 pl-2"
    role="region"
    aria-labelledby="edit-card-title"
    tabindex="0"
  >
    <v-card-title>
      <h2 id="edit-card-title" class="text-h5 font-weight-bold">
        {{
          userRole === 1
            ? $t('editCard.supervisor.title')
            : $t('editCard.student.title')
        }}
      </h2>
    </v-card-title>
    <v-card-text>
      <!-- Main button - behavior differs by role -->
      <v-btn
        color="primary"
        class="mb-4"
        :aria-label="buttonLabel"
        @click="userRole === 1 ? openNewPetitionDialog() : openStudentDialog()"
      >
        {{ buttonLabel }}
      </v-btn>

      <PetitionTableWithActions
        v-if="selectedPetition"
        class="mt-4"
        :petition="selectedPetition"
        :aria-label="$t('petitionTable.title')"
        @close="emit('deselect-petition')"
        @refresh="refresh"
      >
        <!-- Action buttons for students to accept/reject petitions -->
        <template #bottom v-if="userRole === 0">
          <div class="d-flex justify-space-between">
            <v-btn
              color="error"
              size="large"
              class="px-5"
              :disabled="selectedPetition.status !== 'student_action'"
              :aria-label="$t('actions.decline')"
              @click="handleDeclination"
            >
              {{ $t('actions.decline') }}
            </v-btn>
            <v-btn
              color="success"
              size="large"
              class="px-5"
              :disabled="selectedPetition.status !== 'student_action'"
              :aria-label="$t('actions.accept')"
              @click="handleAcceptance"
            >
              {{ $t('actions.accept') }}
            </v-btn>
          </div>
        </template>
      </PetitionTableWithActions>

      <!-- Placeholder when no petition is selected -->
      <v-alert
        v-else
        type="info"
        variant="tonal"
        density="comfortable"
        tabindex="0"
      >
        {{ $t('editCard.noPetitionSelected') }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import PetitionFormDialog from '@/components/dialogs/PetitionFormDialog.vue';
import StudentDataManagementDialog from '../dialogs/StudentDataManagementDialog.vue';
import PetitionTableWithActions from '../tables/PetitionTableWithActions.vue';
import ContentApiService from '@/services/contentApiService';

const props = defineProps({
  selectedPetition: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['refresh', 'deselect-petition']);

const store = useStore();
const { t } = useI18n();

const showPetitionForm = ref(false);
const showStudentDialog = ref(false);

const userRole = computed(() => store.getters['auth/userRole']);
const buttonLabel = computed(() => {
  return userRole.value === 1
    ? t('editCard.supervisor.action')
    : t('editCard.student.action');
});

const openNewPetitionDialog = () => {
  emit('deselect-petition'); // Clear any selected petition
  showPetitionForm.value = true;
};
const openStudentDialog = () => (showStudentDialog.value = true);
const refresh = (payload) => {
  emit('refresh', payload);
};

const handleDeclination = async () => {
  await ContentApiService.patch(
    `/students/petitions/${props.selectedPetition.id}/student-action`,
    {approved: false}
  );
  emit('refresh');
  store.dispatch("snackbar/setSnack", {
    message: t('snackbar.petitionRejected'),
  });
};
const handleAcceptance = async () => {
  await ContentApiService.patch(
    `/students/petitions/${props.selectedPetition.id}/student-action`,
    {approved: true}
  );
  emit('refresh');
  store.dispatch("snackbar/setSnack", {
    message: t('snackbar.petitionAccepted'),
  });
};
</script>
