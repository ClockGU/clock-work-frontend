<template>
  <CustomDialog :title="$t('studentDataManagementDialog.title')" aria-labelledby="student-data-management-dialog">
    <template #content>
      <v-container>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card flat>
              <v-card-text>
                <h2 class="sr-only">{{ $t('studentDataManagementDialog.tabs.personal') }}</h2>
                <p>{{ $t('studentDataManagementDialog.content.personal') }}</p>
                <EmployeeDataForm
                  ref="employeeDataFormRef"
                  class="mt-8"
                  :aria-labelledby="$t('ariaLabel.studentDataManagementDialog.personal')"
                />
              </v-card-text>
            </v-card>
          </v-window-item>
          <v-window-item :value="2">
            <v-card flat>
              <v-card-text>
                <h2 class="sr-only">{{ $t('studentDataManagementDialog.tabs.files') }}</h2>
                <p>{{ $t('studentDataManagementDialog.content.files') }}</p>
                <FilesUploadForm
                  ref="filesUploadFormRef"
                  class="mt-6"
                  :aria-labelledby="$t('ariaLabel.studentDataManagementDialog.files')"
                />
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-container>
    </template>

    <template #actions>
      <v-spacer></v-spacer>
      <v-btn v-if="step === 2" text @click="step = 1">
        {{ $t('actions.back') }}
      </v-btn>
      <v-btn
        v-if="step === 1"
        color="primary"
        :disabled="!isPersonalFormValid"
        @click="saveEmployeeData"
      >
        {{ $t('actions.save') }}
      </v-btn>
      <v-btn
        v-if="step === 1"
        color="primary"
        :disabled="!isPersonalDataSaved"
        @click="step = 2"
      >
        {{ $t('actions.next') }}
      </v-btn>
      <v-btn
        v-if="step === 2"
        color="primary"
        :disabled="!isFilesFormValid"
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

const emit = defineEmits(['close']);
const store = useStore();
const { t } = useI18n();

const employeeDataFormRef = ref(null);
const filesUploadFormRef = ref(null);
const step = ref(1);
const isPersonalDataSaved = ref(false);

const saveEmployeeData = async () => {
  if (!isPersonalFormValid.value) return;
  try {
    const formData = employeeDataFormRef.value.formData;
    await ContentApiService.patch('/employees', formData);
    isPersonalDataSaved.value = true;
    store.dispatch('snackbar/setSuccessSnacks', {
      message: t('success.studentData.savingData'),
    });
  } catch (error) {
    console.error('Error saving employee data:', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.studentData.savingData'),
    });
  }
};

const saveDocuments = async () => {
  if (!isFilesFormValid.value) return;
  try {
    const formData = new FormData();
    const { files } = filesUploadFormRef.value;

    if (files.elstam.length) formData.append('elstam', files.elstam[0]);
    if (files.studienbescheinigung.length) formData.append('studienbescheinigung', files.studienbescheinigung[0]);
    if (files.versicherungsbescheinigung.length) formData.append('versicherungsbescheinigung', files.versicherungsbescheinigung[0]);

    await ContentApiService.patch('/documents', formData);
    await filesUploadFormRef.value.fetchDocuments();
    store.dispatch('snackbar/setSuccessSnacks', {
      message: t('success.studentData.savingFiles'),
    });
    emit('close');
  } catch (error) {
    console.error('Error saving files:', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.studentData.savingFiles'),
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