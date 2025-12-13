<template>
  <CustomDialog :title="$t('studentDataManagementDialog.title')">
    <template #content>
      <v-container>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card flat>
              <v-card-text>
                <h2 class="sr-only">
                  {{ $t('studentDataManagementDialog.tabs.personal') }}
                </h2>
                <p>{{ $t('studentDataManagementDialog.content.personal') }}</p>
                <EmployeeDataForm
                  ref="employeeDataFormRef"
                  :initial-data="employeeData"
                  class="mt-8"
                />
              </v-card-text>
            </v-card>
          </v-window-item>
          <v-window-item :value="2">
            <v-card flat>
              <v-card-text>
                <h2 class="sr-only">
                  {{ $t('studentDataManagementDialog.tabs.files') }}
                </h2>
                <p>{{ $t('studentDataManagementDialog.content.files') }}</p>
                <FilesUploadForm
                  ref="filesUploadFormRef"
                  :initial-documents="documentData"
                  class="mt-6"
                />
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-container>
    </template>

    <template #actions>
      <v-spacer></v-spacer>
      <!-- Next button for student data form (first step) -->
      <v-btn
        v-if="step === 1"
        color="primary"
        :disabled="!isPersonalFormValid || isSaving"
        :loading="isSaving"
        @click="saveAndContinue"
      >
        {{ $t('actions.next') }}
      </v-btn>
      <!-- Back  and save button for document upload form (second step)   -->
      <v-btn v-if="step === 2" text @click="step = 1">
        {{ $t('actions.back') }}
      </v-btn>
      <v-btn
        v-if="step === 2"
        color="primary"
        :disabled="!isFilesFormValid || isSaving"
        :loading="isSaving"
        @click="saveDocuments"
      >
        {{ $t('actions.save') }}
      </v-btn>
    </template>
  </CustomDialog>
</template>

<script setup>
import { PETITION_STATUS } from '@/utils/statusUtils';
import { ref, computed } from 'vue';
import ContentApiService from '@/services/contentApiService';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import EmployeeDataForm from '@/components/forms/EmployeeDataForm.vue';
import FilesUploadForm from '@/components/forms/FilesUploadForm.vue';
import CustomDialog from '@/components/dialogs/CustomDialog.vue';

const props = defineProps({
  petitions: {
    type: Array,
    default: () => [],
  },
  employeeData: {
    type: Object,
    default: null,
  },
  documentData: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(['close', 'refresh']);

const store = useStore();
const { t } = useI18n();

const employeeDataFormRef = ref(null);
const filesUploadFormRef = ref(null);
const step = ref(1);
const isSaving = ref(false);

const saveEmployeeData = async () => {
  try {
    isSaving.value = true;
    const employeeData = employeeDataFormRef.value.formData;
    const formattedData = employeeData.toBackendFormat();
    await ContentApiService.patch('/employees', formattedData);
    return true; // Success
  } catch (error) {
    console.error('Error saving employee data:', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.studentData.savingData'),
    });
    return false; // Failure
  } finally {
    isSaving.value = false;
  }
};

const saveAndContinue = async () => {
  const success = await saveEmployeeData();
  if (success) {
    step.value = 2; // Only proceed to next step if save was successful
  }
};

const saveDocuments = async () => {
  try {
    isSaving.value = true;
    const formData = new FormData();
    const { files } = filesUploadFormRef.value;

    if (files.elstam.length) formData.append('elstam', files.elstam[0]);
    if (files.studienbescheinigung.length)
      formData.append('studienbescheinigung', files.studienbescheinigung[0]);
    if (files.versicherungsbescheinigung.length)
      formData.append(
        'versicherungsbescheinigung',
        files.versicherungsbescheinigung[0]
      );
    if (files.sozialversierungsbogen.length)
      formData.append(
        'sozialversicherungsbogen',
        files.sozialversierungsbogen[0]
      );

    await ContentApiService.patch('/documents', formData);
    store.dispatch('snackbar/setSnack', {
      message: t('studentDataManagementDialog.saveSuccess'),
    });
    await notifyClerkOfChanges();
    // this refresh handles both the document update and clerk notification updates
    emit('refresh');
    emit('close');
  } catch (error) {
    console.error('Error saving files:', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.studentData.savingFiles'),
    });
  } finally {
    isSaving.value = false;
  }
};
// Notify clerk about changes in petitions that were under clerk revision
const notifyClerkOfChanges = async () => {
  try {
    const petitionsUnderClerkRevision = props.petitions.filter(
      (petition) => petition.status === PETITION_STATUS.CLERK_REVISION
    );
    if (petitionsUnderClerkRevision.length === 0) return;

    await Promise.all(
      petitionsUnderClerkRevision.map((petition) =>
        ContentApiService.patch(
          `/students/petitions/${petition.id}/revision-done`
        )
      )
    );
  } catch (error) {
    console.error('Error informing clerk about student changes:', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.studentData.notifyingClerk'),
    });
  }
};

const isPersonalFormValid = computed(() => {
  return employeeDataFormRef.value?.isFormValid ?? false;
});

const isFilesFormValid = computed(() => {
  return filesUploadFormRef.value?.isFormValid ?? false;
});
</script>
