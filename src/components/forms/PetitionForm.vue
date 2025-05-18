<template>
  <v-form ref="form" v-model="isFormValid">
    <v-row>
      <v-col cols="12" md="6">
        <label for="supervisorMail">{{ $t('petition.supervisorMail') }}</label>
        <v-text-field
          id="supervisorMail"
          v-model="formData.supervisor_mail"
          outlined
          dense
          disabled
          :prepend-icon="icons.mdiAccount"
          :aria-label="$t('petition.supervisorMail')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="studentMail">{{ $t('petition.studentMail') }}</label>
        <v-text-field
          id="studentMail"
          v-model="formData.student_mail"
          type="email"
          outlined
          dense
          :prepend-icon="icons.mdiEmail"
          :aria-label="$t('petition.studentMail')"
          :rules="[requiredRule, emailRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="orgUnit">{{ $t('petition.orgUnit') }}</label>
        <v-text-field
          id="orgUnit"
          v-model="formData.org_unit"
          outlined
          dense
          :prepend-icon="icons.mdiOfficeBuilding"
          :aria-label="$t('petition.orgUnit')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="eosNumber">{{ $t('petition.eosNumber') }}</label>
        <v-text-field
          id="eosNumber"
          v-model="formData.eos_number"
          outlined
          dense
          :prepend-icon="icons.mdiNumeric"
          :aria-label="$t('petition.eosNumber')"
          :rules="[requiredRule, eosRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="startDate">{{ $t('petition.startDate') }}</label>
        <v-text-field
          id="startDate"
          v-model="formData.start_date"
          type="date"
          outlined
          dense
          :prepend-icon="icons.mdiCalendar"
          :aria-label="$t('petition.startDate')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="endDate">{{ $t('petition.endDate') }}</label>
        <v-text-field
          id="endDate"
          v-model="formData.end_date"
          type="date"
          outlined
          dense
          :prepend-icon="icons.mdiCalendar"
          :aria-label="$t('petition.endDate')"
          :rules="[requiredRule, endDateRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="minutes">{{ $t('petition.minutes') }}</label>
        <v-text-field
          id="minutes"
          v-model="formData.minutes"
          type="number"
          outlined
          dense
          :prepend-icon="icons.mdiClock"
          :aria-label="$t('petition.minutes')"
          :rules="[requiredRule, positiveNumberRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="baDegree">{{ $t('petition.baDegree') }}</label>
        <v-select
          id="baDegree"
          v-model="formData.ba_degree"
          :items="degreeOptions"
          item-title="text"
          item-value="value"
          outlined
          dense
          :prepend-icon="icons.mdiSchool"
          :aria-label="$t('petition.baDegree')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="budgetPosition">{{ $t('petition.budgetPosition') }}</label>
        <v-text-field
          id="budgetPosition"
          v-model="formData.budget_position"
          outlined
          dense
          :prepend-icon="icons.mdiCurrencyUsd"
          :aria-label="$t('petition.budgetPosition')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="budgetApprover">{{ $t('petition.budgetApprover') }}</label>
        <v-text-field
          id="budgetApprover"
          v-model="formData.budget_approver"
          type="email"
          outlined
          dense
          :prepend-icon="icons.mdiEmail"
          :aria-label="$t('petition.budgetApprover')"
          :rules="[requiredRule, emailRule]"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          id="timeExceCourse"
          v-model="formData.time_exce_course"
          :label="$t('petition.timeExceCourse')"
          :aria-label="$t('petition.timeExceCourse')"
          @update:model-value="handleTimeExceptionChange"
        />
        <div v-if="formData.time_exce_course" class="mx-4">
          <label for="timeExceName">{{ $t('petition.timeExceName') }}</label>
          <v-text-field
            id="timeExceName"
            v-model="formData.time_exce_name"
            outlined
            dense
            :aria-label="$t('petition.timeExceName')"
            :rules="[requiredRule]"
          />
          <label for="timeExceStart">{{ $t('petition.timeExceStart') }}</label>
          <v-text-field
            id="timeExceStart"
            v-model="formData.time_exce_start"
            type="date"
            outlined
            dense
            :aria-label="$t('petition.timeExceStart')"
            :rules="[requiredRule]"
          />
          <label for="timeExceEnd">{{ $t('petition.timeExceEnd') }}</label>
          <v-text-field
            id="timeExceEnd"
            v-model="formData.time_exce_end"
            type="date"
            outlined
            dense
            :aria-label="$t('petition.timeExceEnd')"
            :rules="[requiredRule]"
          />
        </div>
      </v-col>
      <v-col cols="12">
        <v-checkbox
          id="durationExceCourse"
          v-model="formData.duration_exce_course"
          :label="$t('petition.durationException')"
          :aria-label="$t('petition.durationException')"
          @update:model-value="handleDurationExceptionChange"
        />
        <div v-if="formData.duration_exce_course" class="mx-4">
          <label for="durationExceName">{{ $t('petition.durationExceName') }}</label>
          <v-text-field
            id="durationExceName"
            v-model="formData.duration_exce_name"
            outlined
            dense
            :aria-label="$t('petition.durationExceName')"
            :rules="[requiredRule]"
          />
          <label for="durationExceStart">{{ $t('petition.durationExceStart') }}</label>
          <v-text-field
            id="durationExceStart"
            v-model="formData.duration_exce_start"
            type="date"
            outlined
            dense
            :aria-label="$t('petition.durationExceStart')"
            :rules="[requiredRule]"
          />
          <label for="durationExceEnd">{{ $t('petition.durationExceEnd') }}</label>
          <v-text-field
            id="durationExceEnd"
            v-model="formData.duration_exce_end"
            type="date"
            outlined
            dense
            :aria-label="$t('petition.durationExceEnd')"
            :rules="[requiredRule]"
          />
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, watch} from 'vue';
import { mdiAccount, mdiEmail, mdiOfficeBuilding, mdiNumeric, mdiSchool,mdiCalendar, mdiClock, mdiCurrencyUsd } from '@mdi/js';
import { useI18n } from 'vue-i18n';

const {t}= useI18n();
const icons = {
  mdiAccount,
  mdiEmail,
  mdiOfficeBuilding,
  mdiNumeric,
  mdiCalendar,
  mdiClock,
  mdiCurrencyUsd,
  mdiSchool
};

const props = defineProps({
  petition: {
    type: [Object, null],
    required: false,
    default: null,
  },
});
const degreeOptions =[
  { text: 'Student has a Bachelor Degree', value: true },
  { text: 'Student does not have a Bachelor Degree', value: false }
]

const initialFormData = {
  supervisor_mail: '',
  student_mail: '',
  start_date: '',
  end_date: '',
  org_unit: '',
  eos_number: '',
  minutes: '',
  ba_degree: false,
  budget_position: '',
  budget_approver: '',
  time_exce_student: false,
  time_exce_course: false,
  time_exce_name: '',
  time_exce_start: '',
  time_exce_end: '',
  duration_exce_course: false,
  duration_exce_name: '',
  duration_exce_start: '',
  duration_exce_end: '',
};

const formData = ref({ ...initialFormData });
const isFormValid = ref(false);

// Populate form data when petition prop changes
watch(() => props.petition, (newPetition) => {
  if (newPetition) {
    const cleanData = {
      ...initialFormData,
      ...newPetition,
      time_exce_course: newPetition.time_exce_course ?? false,
      duration_exce_course: newPetition.duration_exce_course ?? false,
    };
    
    // Only clear exception fields if their checkboxes are false
    if (!cleanData.time_exce_course) {
      cleanData.time_exce_name = '';
      cleanData.time_exce_start = '';
      cleanData.time_exce_end = '';
    }
    if (!cleanData.duration_exce_course) {
      cleanData.duration_exce_name = '';
      cleanData.duration_exce_start = '';
      cleanData.duration_exce_end = '';
    }
    
    formData.value = cleanData;
  } else {
    formData.value = { ...initialFormData };
  }
}, { immediate: true });

// Clear time exception fields when checkbox is unchecked
const handleTimeExceptionChange = (value) => {
  if (!value) {
    formData.value.time_exce_course = false;
    formData.value.time_exce_name = '';
    formData.value.time_exce_start = '';
    formData.value.time_exce_end = '';
  }
  else{
    formData.value.time_exce_course = true;
  }
};

const handleDurationExceptionChange = (value) => {
  if (!value) {
    formData.value.duration_exce_course = false;
    formData.value.duration_exce_name = '';
    formData.value.duration_exce_start = '';
    formData.value.duration_exce_end = '';
  }
  else{
    formData.value.duration_exce_course = true;
  }
};
//validation rules 
const requiredRule = (v) => !!v || t('validationRule.required');
const emailRule = (v) => /.+@.+\..+/.test(v) || t('validationRule.invalidEmail');
const positiveNumberRule = (v) => v > 0 || t('validationRule.positiveNumber');
const endDateRule = (v) => {
  if (!formData.value.start_date || !v) return true;
  return new Date(v) >= new Date(formData.value.start_date) || t('validationRule.endDateAfterStart');
};
const eosRule = (v) => /^\d{5}$/.test(v) || t('validationRule.eosNumber');

defineExpose({ formData, isFormValid });
</script>
<style scoped>
label {
  font-weight: 500;
  font-size: 1rem; 
  margin-left: 2.5rem; 
}
</style>