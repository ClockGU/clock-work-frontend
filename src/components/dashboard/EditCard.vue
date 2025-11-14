<template>
  <PetitionFormDialog
    v-model="showPetitionForm"
    :petition="selectedPetition"
    @close="showPetitionForm = false"
    @refresh="refresh"
  />
  <StudentDataManagementDialog
    v-if="userRole === 0"
    v-model="showStudentDialog"
    :petitions="petitions"
    :employee-data="employeeData"
    :document-data="documentData"
    @close="showStudentDialog = false"
    @refresh="refresh"
  />
  <PetitionRevisionDialog
    v-model="showRevisionDialog"
    :petition="selectedPetition"
    @close="showRevisionDialog = false"
    @refresh="refresh"
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
        <!-- Action buttons for students to accept/reject or revision of a petition -->
        <template #bottom v-if="userRole === 0">
          <div
            v-if="showStudentActionButtons"
            class="d-flex justify-space-between"
          >
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
              color="warning"
              size="large"
              class="px-6"
              :aria-label="$t('actions.requestChange')"
              @click="showRevisionDialog = true"
            >
              {{ $t('actions.requestChange') }}
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
          <v-alert
            v-else
            type="warning"
            variant="tonal"
            density="comfortable"
            tabindex="0"
          >
            {{ $t('editCard.student.completeStudentData') }}
          </v-alert>
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
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import PetitionFormDialog from '@/components/dialogs/PetitionFormDialog.vue';
import StudentDataManagementDialog from '../dialogs/StudentDataManagementDialog.vue';
import PetitionTableWithActions from '../tables/PetitionTableWithActions.vue';
import ContentApiService from '@/services/contentApiService';
import PetitionRevisionDialog from '../dialogs/PetitionRevisionDialog.vue';

const props = defineProps({
  selectedPetition: {
    type: Object,
    default: null,
  },
  petitions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['refresh', 'deselect-petition']);

const store = useStore();
const { t } = useI18n();

const showPetitionForm = ref(false);
const showStudentDialog = ref(false);
const showRevisionDialog = ref(false);
const employeeData = ref(null);
const documentData = ref(null);

const userRole = computed(() => store.getters['auth/userRole']);
const buttonLabel = computed(() => {
  return userRole.value === 1
    ? t('editCard.supervisor.action')
    : t('editCard.student.action');
});
const isPersonalDataComplete = computed(() => {
  return (
    employeeData.value !== null && Object.keys(employeeData.value).length > 0
  );
});
const isDocumentsComplete = computed(() => {
  return (
    documentData.value !== null &&
    !!documentData.value.elstam_url &&
    !!documentData.value.studienbescheinigung_url &&
    !!documentData.value.versicherungsbescheinigung_url
  );
});
// Show action buttons for students only if he filled both forms (personal data and documents)
const showStudentActionButtons = computed(() => {
  return isPersonalDataComplete.value && isDocumentsComplete.value;
});

const openNewPetitionDialog = () => {
  emit('deselect-petition'); // Clear any selected petition
  showPetitionForm.value = true;
};
const openStudentDialog = () => (showStudentDialog.value = true);
const refresh = (payload) => {
  fetchStudentData();
  emit('refresh', payload);
};

const fetchEmployeeData = async () => {
  try {
    const response = await ContentApiService.get('/employees');
    employeeData.value = response.data;
  } catch (error) {
    employeeData.value = null;
    if (error.response?.status !== 404) {
      console.error('Error fetching employee data validity:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: t('errors.studentData.fetchingData'),
      });
    }
  }
};
const fetchDocuments = async () => {
  try {
    const response = await ContentApiService.get('/documents');
    const data = response.data;
    documentData.value = data;
  } catch (error) {
    documentData.value = null;
    if (error.response?.status !== 404) {
      console.error('Error fetching documents validity:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: t('errors.studentData.fetchingDocs'),
      });
    }
  }
};
const fetchStudentData = () => {
  if (userRole.value === 0) {
    // Only fetch if the user is a student
    fetchEmployeeData();
    fetchDocuments();
  }
};

onMounted(fetchStudentData);

watch(userRole, fetchStudentData);

const handleDeclination = async () => {
  try {
    await ContentApiService.patch(
      `/students/petitions/${props.selectedPetition.id}/student-action`,
      { approved: false }
    );
    emit('refresh', {
      type: 'delete',
      data: props.selectedPetition.id,
    });
    store.dispatch('snackbar/setSnack', {
      message: t('editCard.success.declination'),
    });
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error('Error accepting petition:', error);
      if (error.response?.status === 400) {
        store.dispatch('snackbar/setErrorSnacks', {
          message: t('errors.petition.uploadDocument'),
        });
      } else {
        store.dispatch('snackbar/setErrorSnacks', {
          message: t('errors.petition.declining'),
        });
      }
    }
  }
};
const handleAcceptance = async () => {
  try {
    await ContentApiService.patch(
      `/students/petitions/${props.selectedPetition.id}/student-action`,
      { approved: true }
    );
    emit('refresh', {
      type: 'delete',
      data: props.selectedPetition.id,
    });
    store.dispatch('snackbar/setSnack', {
      message: t('editCard.success.acceptance'),
    });
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error('Error accepting petition:', error);
      if (error.response?.status === 400) {
        store.dispatch('snackbar/setErrorSnacks', {
          message: t('errors.petition.uploadDocument'),
        });
      } else {
        store.dispatch('snackbar/setErrorSnacks', {
          message: t('errors.petition.accepting'),
        });
      }
    }
  }
};
</script>
