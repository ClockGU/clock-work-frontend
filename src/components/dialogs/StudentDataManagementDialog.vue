<template>
  <CustomDialog title="Student Data Management" aria-labelledby="student-data-management-dialog">
    <template #content>
      <v-container>
        <v-tabs v-model="tab" grow aria-label="Student Data Management tabs">
          <v-tab value="personal" aria-label="Personal Information">Personal Information</v-tab>
          <v-tab value="files" aria-label="Uploaded Files">Uploaded Files</v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item value="personal">
            <v-card flat>
              <v-card-text>
                <h2 id="personal-information" class="sr-only">Personal Information</h2>
                <p>Here you can see and edit your personal information.</p>
                <EmployeeDataForm
                  class="mt-8"
                  ref="employeeDataFormRef"
                  aria-labelledby="personal-information"
                />
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="files">
            <v-card flat>
              <v-card-text>
                <h2 id="uploaded-files" class="sr-only">Uploaded Files</h2>
                <p>Here you can see the files you've uploaded.</p>
                <FilesUploadForm
                  class="mt-6"
                  aria-labelledby="uploaded-files"
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
        @click="save"
        :disabled="!isFormValid"
        aria-label="Save student data"
      >
        Save
      </v-btn>
    </template>
  </CustomDialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import EmployeeDataForm from '@/components/forms/EmployeeDataForm.vue';
import CustomDialog from '@/components/dialogs/CustomDialog.vue';
import FilesUploadForm from '@/components/forms/FilesUploadForm.vue';

const emit = defineEmits('close');
const store = useStore();
const employeeDataFormRef = ref(null);
const tab = ref('personal');

const closeDialog = () => emit('close');
const save = () => {
  if (tab.value === 'personal') {
    const formData = employeeDataFormRef.value.formData;
    if (employeeDataFormRef.value.isFormValid) {
      store.dispatch('employeeData/setEmployeeData', formData);
    }
  }
  closeDialog();
};

const isFormValid = computed(() => {
  switch (tab.value) {
    case 'personal':
      return employeeDataFormRef.value?.isFormValid ?? false;
    default:
      return true;
  }
});
</script>

