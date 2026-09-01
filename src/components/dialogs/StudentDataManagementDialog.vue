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
            <v-card>
              <v-card-text>
                <h2 class="sr-only">
                  {{ $t('studentDataManagementDialog.tabs.prevEmploymens') }}
                </h2>
                <p>
                  {{ $t('studentDataManagementDialog.content.prevEmploymens') }}
                </p>
                <PriorEmploymentForm
                  ref="employmentDataFormRef"
                  :initial-employment-data="employmentData"
                ></PriorEmploymentForm>
              </v-card-text>
            </v-card>
          </v-window-item>
          <v-window-item :value="3">
            <v-card flat>
              <v-card-text>
                <h2 class="sr-only">
                  {{ $t('studentDataManagementDialog.tabs.files') }}
                </h2>
                <p>{{ $t('studentDataManagementDialog.content.files') }}</p>
                <StudentFilesUploadForm
                  ref="StudentFilesUploadFormRef"
                  class="mt-6"
                  :initial-documents="documentData"
                  :show-ba-degree-field="showBaDegreeField"
                  :show-residence-permit-field="requiresResidencePermitUpload"
                />
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-container>
    </template>

    <template #actions>
      <v-spacer></v-spacer>
      <v-btn v-if="step !== 1" text @click="step -= 1">
        {{ $t('actions.back') }}
      </v-btn>
      <v-btn
        color="primary"
        :disabled="!isCurrentFormValid || isSaving"
        :loading="isSaving"
        @click="handleNextBtn"
      >
        {{ step.value !== 3 ? $t('actions.next') : $t('actions.save') }}
      </v-btn>
    </template>
  </CustomDialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import ContentApiService from '@/services/contentApiService';
import EmployeeDataForm from '@/components/forms/EmployeeDataForm.vue';
import StudentFilesUploadForm from '@/components/forms/documents/StudentFilesUploadForm.vue';
import CustomDialog from '@/components/dialogs/base/CustomDialog.vue';
import PriorEmploymentForm from '@/components/forms/fields/PriorEmploymentForm.vue';
import { format } from 'date-fns';

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
  employmentData: {
    type: Array,
    default: null,
  },
  showBaDegreeField: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits([
  'close',
  'refresh-employee-data',
  'refresh-prev-emp',
  'refresh-documents',
]);

const store = useStore();
const { t } = useI18n();

const employeeDataFormRef = ref(null);
const StudentFilesUploadFormRef = ref(null);
const employmentDataFormRef = ref(null);
const step = ref(1);
const isSaving = ref(false);

const isPersonalFormValid = computed(() => {
  return employeeDataFormRef.value?.isFormValid ?? false;
});
const isFilesFormValid = computed(() => {
  return StudentFilesUploadFormRef.value?.isFormValid ?? false;
});
const isEmploymentFormValid = computed(() => {
  return employmentDataFormRef.value?.isFormValid ?? false;
});

// eslint-disable-next-line vue/return-in-computed-property
const isCurrentFormValid = computed(() => {
  switch (step.value) {
    case 1:
      return isPersonalFormValid.value;
    case 2:
      return isEmploymentFormValid.value;
    case 3:
      return isFilesFormValid.value;
  }
});

const requiresResidencePermitUpload = computed(() => {
  return employeeDataFormRef.value?.requiresResidencePermitUpload ?? false;
});

const saveEmployeeData = async () => {
  try {
    isSaving.value = true;
    const employeeData = employeeDataFormRef.value.formData;
    const formattedData = employeeData.toBackendFormat();
    await ContentApiService.patch(
      `/employees/${props.employeeData.id}`,
      formattedData
    );
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

const saveDocuments = async () => {
  try {
    isSaving.value = true;

    const formData = new FormData();
    const { files } = StudentFilesUploadFormRef.value;

    // backend field and files keys mapping
    const docMap = {
      elstam: 'elstam',
      studienbescheinigung: 'studienbescheinigung',
      versicherungsbescheinigung: 'versicherungsbescheinigung',
      sozialversicherungsbogen: 'sozialversicherungsbogen',
      ba_degree: 'ba_degree',
      residence_permit: 'residence_permit',
      id_photo: 'id_photo',
    };

    for (const [backendField, filesKey] of Object.entries(docMap)) {
      const arr = files?.[filesKey];
      if (Array.isArray(arr) && arr.length > 0 && arr[0]) {
        formData.append(backendField, arr[0]);
      }
    }

    await ContentApiService.patch('/documents', formData);
    store.dispatch('snackbar/setSnack', {
      message: t('studentDataManagementDialog.saveSuccess'),
    });
    return true; // Success
  } catch (error) {
    console.error('Error saving files:', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.studentData.savingFiles'),
    });
    return false; // Failure
  } finally {
    isSaving.value = false;
  }
};

const saveEmploymentData = async () => {
  try {
    isSaving.value = true;
    const { prevEmployments, allFieldsProvided, hasEntryChanged } =
      employmentDataFormRef.value;
    // IF no employments were provided the Array consists of one default object
    if (
      prevEmployments.length === 1 &&
      !allFieldsProvided(prevEmployments[0])
    ) {
      isSaving.value = false;
      return true;
    }

    for (const entry of prevEmployments) {
      // strip id and user_account as we dont want it to be sent for patches
      let { proof, id, user_account, ...fields } = entry;
      fields.start = format(fields.start, 'yyyy-MM-dd');
      fields.end = format(fields.end, 'yyyy-MM-dd');
      if (!id) {
        const fieldSaveResponse = await ContentApiService.post(
          '/prev_employments',
          fields
        );
        id = fieldSaveResponse.data.id;
      } else if (hasEntryChanged(entry)) {
        await ContentApiService.patch(`/prev_employments/${id}`, fields);
      }

      if (typeof proof !== 'string') {
        const formData = new FormData();
        formData.append('proof', proof);
        await ContentApiService.patch(
          `/prev_employments/${id}/proof`,
          formData
        );
      }
    }
    return true;
  } catch (error) {
    console.error('Error saving files:', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.employmentData.savingFiles'),
    });
    return false; // Failure
  } finally {
    isSaving.value = false;
  }
};

async function handleNextBtn() {
  let saveFn;
  switch (step.value) {
    case 1:
      saveFn = async () => {
        return saveEmployeeData().then((retVal) => {
          emit('refresh-employee-data');
          return retVal;
        });
      };
      break;
    case 2:
      saveFn = async () => {
        return saveEmploymentData().then((retVal) => {
          emit('refresh-prev-emp');
          return retVal;
        });
      };
      break;
    case 3:
      saveFn = async () => {
        return saveDocuments().then((retVal) => {
          emit('refresh-documents');
          return retVal;
        });
      };
      break;
  }
  const success = await saveFn();
  if (success) {
    step.value += 1;
    if (step.value > 3) {
      emit('close');
    }
  }
}
</script>
