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
                <EmployeeDataForm ref="employeeDataFormRef" class="mt-8" />
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
                <FilesUploadForm ref="filesUploadFormRef" class="mt-6" />
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
import { ref, computed } from 'vue';
import ContentApiService from '@/services/contentApiService';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { formatISO, format } from 'date-fns';

const emit = defineEmits(['close']);
const store = useStore();
const { t } = useI18n();

const employeeDataFormRef = ref(null);
const filesUploadFormRef = ref(null);
const step = ref(1);
const isSaving = ref(false);

// Helper function to format dates for the backend
const formatDatesForBackend = (data) => {
  const formattedData = { ...data };

  // Format date_of_birth
  if (formattedData.date_of_birth) {
    formattedData.date_of_birth = formatISO(
      new Date(formattedData.date_of_birth),
      {
        representation: 'date',
      }
    );
  }

  // Format prev_emp_duration as string "DD.MM.YYYY – DD.MM.YYYY"
  if (
    formattedData.prev_emp_duration &&
    Array.isArray(formattedData.prev_emp_duration)
  ) {
    // Get only the first and last dates from the array (start and end of range)
    const dates = formattedData.prev_emp_duration;
    if (dates.length >= 2) {
      const startDate = dates[0];
      const endDate = dates[dates.length - 1];
      if (startDate && endDate) {
        formattedData.prev_emp_duration = `${format(new Date(startDate), 'dd.MM.yyyy')} – ${format(new Date(endDate), 'dd.MM.yyyy')}`;
        formattedData.previous_employment = true;
      }
    } else {
      formattedData.prev_emp_duration = '';
      formattedData.previous_employment = false;
    }
  }
  return formattedData;
};

const saveEmployeeData = async () => {
  try {
    isSaving.value = true;
    const formData = employeeDataFormRef.value.formData;
    const formattedData = formatDatesForBackend(formData);
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

    await ContentApiService.patch('/documents', formData);
    await filesUploadFormRef.value.fetchDocuments();
    store.dispatch('snackbar/setSnack', {
      message: t('studentDataManagementDialog.saveSuccess'),
    });
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

const isPersonalFormValid = computed(() => {
  return employeeDataFormRef.value?.isFormValid ?? false;
});
const isFilesFormValid = computed(() => {
  return filesUploadFormRef.value?.isFormValid ?? false;
});
</script>
