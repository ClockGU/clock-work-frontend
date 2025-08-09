<template>
  <CustomDialog :title="$t('studentDataManagementDialog.title')" aria-labelledby="student-data-management-dialog">
    <template #content>
      <v-container>
        <v-tabs v-model="tab" grow :aria-label="$t('ariaLabel.studentDataManagementDialog.tabs')">
          <v-tab value="personal">{{ $t('studentDataManagementDialog.tabs.personal') }}</v-tab>
          <v-tab value="files">{{ $t('studentDataManagementDialog.tabs.files') }}</v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item value="personal">
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
          <v-window-item value="files">
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
      <v-btn
        color="primary"
        :disabled="!isFormValid"
        :aria-label="$t('actions.save')"
        @click="save"
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
const {t} = useI18n();

const employeeDataFormRef = ref(null);
const filesUploadFormRef = ref(null);
const tab = ref('personal');

const save = () => {
  if (tab.value === 'personal') {
     saveEmployeeData();
  }
  if (tab.value === 'files') {
     saveDocuments();
  }
  emit('close');
};
const saveEmployeeData = async () => {
  try {
    const formData = employeeDataFormRef.value.formData;
    await ContentApiService.patch('/employees', formData);
  } catch (error) {
    console.error('Error saving employee data:', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.studentData.savingData'),
    });
  }
};

const saveDocuments = async () => {  
  try {
    const formData = new FormData();
    const { files } = filesUploadFormRef.value;
    
    if (files.elstam.length) formData.append('elstam', files.elstam[0]);
    if (files.studienbescheinigung.length) formData.append('studienbescheinigung', files.studienbescheinigung[0]);
    if (files.versicherungsbescheinigung.length) formData.append('versicherungsbescheinigung', files.versicherungsbescheinigung[0]);

    await ContentApiService.patch('/documents', formData);
    await filesUploadFormRef.value.fetchDocuments();
  } catch (error) {
    console.error('Error saving files:', error);
    store.dispatch('snackbar/setErrorSnacks', { 
      message: t('errors.studentData.savingFiles'),
    });
  }
};

const isFormValid = computed(() => {
  switch (tab.value) {
    case 'personal':
      return employeeDataFormRef.value?.isFormValid ?? false;
    case 'files':
      return filesUploadFormRef.value?.isFormValid ?? false;
    default:
      return true;
  }
});
</script>