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
    :showBaDegreeField="showBaDegreeField"
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
      <!-- Warning alert for students if their data is incomplete -->
      <v-alert
        v-if="selectedPetition && !isStudentDataComplete && userRole === 0"
        type="warning"
        variant="tonal"
        class="mt-4"
        density="comfortable"
        tabindex="0"
      >
        {{ $t('editCard.student.completeStudentData') }}
      </v-alert>

      <PetitionTableWithActions
        v-if="selectedPetition"
        class="mt-4"
        :petition="selectedPetition"
        :aria-label="$t('dataDisplayTable.petition.title')"
        @close="emit('deselect-petition')"
        @refresh="refresh"
      >
        <!-- Action buttons for students to accept/reject or revision of a petition -->
        <template #bottom v-if="userRole === 0">
          <div
            class="d-flex py-4"
            :class="{
              'justify-space-between': lgAndUp,
              'flex-column ga-4': !lgAndUp,
            }"
          >
            <v-btn
              color="error"
              size="large"
              class="px-5"
              :disabled="isStudentActionDisabled"
              :aria-label="$t('actions.decline')"
              @click="handleDeclination"
            >
              {{ $t('actions.decline') }}
            </v-btn>
            <v-btn
              color="warning"
              size="large"
              class="px-5"
              :disabled="isStudentActionDisabled"
              :aria-label="$t('actions.requestChange')"
              @click="showRevisionDialog = true"
            >
              {{ $t('actions.requestChange') }}
            </v-btn>
            <v-btn
              color="success"
              size="large"
              class="px-5"
              :disabled="isStudentActionDisabled"
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
import { PETITION_STATUS } from '@/utils/statusUtils';
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';
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
const { lgAndUp } = useDisplay();

const showPetitionForm = ref(false);
const showStudentDialog = ref(false);
const showRevisionDialog = ref(false);
const employeeData = ref(null);
const documentData = ref(null);
const isLoadingEmployeeData = ref(false);
const isLoadingDocumentData = ref(false);

const userRole = computed(() => store.getters['auth/userRole']);
const buttonLabel = computed(() => {
  return userRole.value === 1
    ? t('editCard.supervisor.action')
    : t('editCard.student.action');
});
const showBaDegreeField = computed(() =>
  props.petitions.some((p) => p.ba_degree === true)
);

const isPersonalDataComplete = computed(
  () =>
    employeeData.value !== null && Object.keys(employeeData.value).length > 0
);

const isDocumentsComplete = computed(() => {
  if (!documentData.value) return false;
  const baseDocs =
    !!documentData.value.elstam_url &&
    !!documentData.value.studienbescheinigung_url &&
    !!documentData.value.versicherungsbescheinigung_url &&
    !!documentData.value.sozialversicherungsbogen_url;

  return showBaDegreeField.value
    ? baseDocs && !!documentData.value.ba_degree_url
    : baseDocs;
});
// Check if student data is complete if the selected petition requires student action
const isStudentDataComplete = computed(() => {
  return isPersonalDataComplete.value && isDocumentsComplete.value;
});
// Determine if student action buttons should be disabled based on petition status and data completeness
const isStudentActionDisabled = computed(() => {
  return (
    props.selectedPetition.status !== PETITION_STATUS.STUDENT_ACTION ||
    !isStudentDataComplete.value
  );
});

const openNewPetitionDialog = () => {
  emit('deselect-petition');
  showPetitionForm.value = true;
};
const openStudentDialog = () => (showStudentDialog.value = true);
const refresh = (payload) => {
  fetchStudentData();
  emit('refresh', payload);
};

const fetchEmployeeData = async () => {
  if (isLoadingEmployeeData.value) return;
  isLoadingEmployeeData.value = true;
  try {
    const response = await ContentApiService.get('/employees');
    employeeData.value = response.data || null;
  } catch (error) {
    if (error.response?.status === 404) {
      employeeData.value = null;
    } else if (error.response?.status !== 404) {
      console.error('Error fetching employee data:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: t('errors.studentData.fetchingData'),
      });
    }
  } finally {
    isLoadingEmployeeData.value = false;
  }
};

const fetchDocuments = async () => {
  if (isLoadingDocumentData.value) return;

  isLoadingDocumentData.value = true;
  try {
    const response = await ContentApiService.get('/documents');
    const data = response.data;
    if (data) {
      documentData.value = data;
    }
  } catch (error) {
    if (error.response?.status === 404) {
      documentData.value = null;
    } else if (error.response?.status !== 404) {
      console.error('Error fetching documents:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: t('errors.studentData.fetchingDocs'),
      });
    }
  } finally {
    isLoadingDocumentData.value = false;
  }
};

const fetchStudentData = async () => {
  if (userRole.value === 0)
    await Promise.all([fetchEmployeeData(), fetchDocuments()]);
};

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
      console.error('Error declining petition:', error);
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

onMounted(() => {
  fetchStudentData();
});
watch(userRole, fetchStudentData);
</script>
