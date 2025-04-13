<template>
  <v-form ref="form" v-model="isFormValid">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.petitioneer"
          outlined
          dense
          readonly
          :prepend-icon="icons.mdiAccount"
          :label="$t('petition.petitioneer')"
          :aria-label="$t('petition.petitioneer')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.student_mail"
          type="email"
          outlined
          dense
          :prepend-icon="icons.mdiEmail"
          :label="$t('petition.studentMail')"
          :aria-label="$t('petition.studentMail')"
          :rules="[requiredRule, emailRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.org_unit"
          outlined
          dense
          :prepend-icon="icons.mdiOfficeBuilding"
          :label="$t('petition.orgUnit')"
          :aria-label="$t('petition.orgUnit')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.eos_number"
          outlined
          dense
          :prepend-icon="icons.mdiNumeric"
          :label="$t('petition.eosNumber')"
          :aria-label="$t('petition.eosNumber')"
          :rules="[requiredRule,eosRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.start_date"
          type="date"
          outlined
          dense
          :prepend-icon="icons.mdiCalendar"
          :label="$t('petition.startDate')"
          :aria-label="$t('petition.startDate')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.end_date"
          type="date"
          outlined
          dense
          :prepend-icon="icons.mdiCalendar"
          :label="$t('petition.endDate')"
          :aria-label="$t('petition.endDate')"
          :rules="[requiredRule, endDateRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.minutes"
          type="number"
          outlined
          dense
          :prepend-icon="icons.mdiClock"
          :label="$t('petition.minutes')"
          :aria-label="$t('petition.minutes')"
          :rules="[requiredRule, positiveNumberRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="formData.ba_degree"
          item-title="text"
          item-value="value"
          :items="degreeOptions"
          :prepend-icon="icons.mdiSchool"
          :label="$t('petition.baDegree')"
          :aria-label="$t('petition.baDegree')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.budget_position"
          outlined
          dense
          :prepend-icon="icons.mdiCurrencyUsd"
          :label="$t('petition.budgetPosition')"
          :aria-label="$t('petition.budgetPosition')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.budget_approver"
          type="email"
          outlined
          dense
          :prepend-icon="icons.mdiEmail"
          :label="$t('petition.budgetApprover')"
          :aria-label="$t('petition.budgetApprover')"
          :rules="[requiredRule, emailRule]"
        />
      </v-col>

      <!-- Time and Duration Exception Fields -->
      <v-col cols="12">
        <v-checkbox
          v-model="formData.time_exec_course"
          :label="$t('petition.timeException')"
          :aria-label="$t('petition.timeException')"
          @update:model-value="handleTimeExceptionChange"
        />
        <div class="mx-4">
          <v-text-field
            v-if="formData.time_exec_course"
            v-model="formData.time_exce_name"
            outlined
            dense
            :label="$t('petition.timeExceName')"
            :aria-label="$t('petition.timeExceName')"
            :rules="formData.time_exec_course? [requiredRule] : []"
          />
          <v-text-field
            v-if="formData.time_exec_course"
            v-model="formData.time_exce_start"
            type="date"
            outlined
            dense
            :rules="formData.time_exec_course? [requiredRule] : []"
            :label="$t('petition.timeExceStart')"
            :aria-label="$t('petition.timeExceStart')"
          />
          <v-text-field
            v-if="formData.time_exec_course"
            v-model="formData.time_exce_end"
            type="date"
            outlined
            dense
            :rules="formData.time_exec_course? [requiredRule] : []"
            :label="$t('petition.timeExceEnd')"
            :aria-label="$t('petition.timeExceEnd')"
          />
        </div>
      </v-col>
      
      <v-col cols="12">
        <v-checkbox
          v-model="formData.duration_exec_course"
          :label="$t('petition.durationException')"
          :aria-label="$t('petition.durationException')"
          @update:model-value="handleDurationExceptionChange"

        />
        <div class="mx-4">
          <v-text-field
            v-if="formData.duration_exec_course"
            v-model="formData.duration_exce_name"
            outlined
            dense
            :rules="formData.duration_exec_course? [requiredRule] : []"
            :label="$t('petition.durationExceName')"
            :aria-label="$t('petition.durationExceName')"
          />
          <v-text-field
            v-if="formData.duration_exec_course"
            v-model="formData.duration_exce_start"
            type="date"
            outlined
            dense
            :rules="formData.duration_exec_course? [requiredRule] : []"
            :label="$t('petition.durationExceStart')"
            :aria-label="$t('petition.durationExceStart')"
          />
          <v-text-field
            v-if="formData.duration_exec_course"
            v-model="formData.duration_exce_end"
            type="date"
            outlined
            dense
            :rules="formData.duration_exec_course? [requiredRule] : []"
            :label="$t('petition.durationExceEnd')"
            :aria-label="$t('petition.durationExceEnd')"
          />
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
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
  role: {
    type: String,
    required: true,
    default: 'student',
  },
});
const degreeOptions =[
  { text: 'Student has a Bachelor Degree', value: true },
  { text: 'Student does not have a Bachelor Degree', value: false }
]

const initialFormData = {
  petitioneer: '',
  student_mail: '',
  start_date: '',
  end_date: '',
  org_unit: '',
  eos_number: '',
  minutes: '',
  ba_degree: false,
  budget_position: '',
  budget_approver: '',
  time_exec_course: false,
  time_exce_name: '',
  time_exce_start: '',
  time_exce_end: '',
  duration_exec_course: false,
  duration_exce_name: '',
  duration_exce_start: '',
  duration_exce_end: '',
};

const formData = ref({ ...initialFormData });
const isFormValid = ref(false);

// Populate form data when petition prop changes
watchEffect(() => {
  if (props.petition) {
    formData.value = { ...initialFormData, ...props.petition };
  } else {
    formData.value = { ...initialFormData };
  }
});

// Clear time exception fields when checkbox is unchecked
const handleTimeExceptionChange = (value) => {
  if (!value) {
    formData.value.time_exce_name = '';
    formData.value.time_exce_start = '';
    formData.value.time_exce_end = '';
  }
};

// Clear duration exception fields when checkbox is unchecked
const handleDurationExceptionChange = (value) => {
  if (!value) {
    formData.value.duration_exce_name = '';
    formData.value.duration_exce_start = '';
    formData.value.duration_exce_end = '';
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