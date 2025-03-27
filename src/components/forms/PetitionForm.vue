<template>
  <v-form ref="form" v-model="isFormValid">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiAccount"
          :label="$t('petition.petitioneer')"
          v-model="formData.petitioneer"
          outlined
          dense
          disabled
          :aria-label="$t('petition.petitioneer')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiEmail"
          :label="$t('petition.studentMail')"
          v-model="formData.student_mail"
          type="email"
          :rules="[requiredRule, emailRule]"
          outlined
          dense
          :aria-label="$t('petition.studentMail')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiOfficeBuilding"
          :label="$t('petition.orgUnit')"
          v-model="formData.org_unit"
          :rules="role === 'student' ? [] : [requiredRule]"
          outlined
          dense
          :disabled="role === 'student'"
          :aria-label="$t('petition.orgUnit')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiNumeric"
          :label="$t('petition.eosNumber')"
          v-model="formData.eos_number"
          :rules="role === 'student' ? [] : [requiredRule]"
          outlined
          dense
          :disabled="role === 'student'"
          :aria-label="$t('petition.eosNumber')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiCalendar"
          :label="$t('petition.startDate')"
          v-model="formData.start_date"
          type="date"
          :rules="[requiredRule]"
          outlined
          dense
          :aria-label="$t('petition.startDate')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiCalendar"
          :label="$t('petition.endDate')"
          v-model="formData.end_date"
          type="date"
          :rules="[requiredRule, endDateRule]"
          outlined
          dense
          :aria-label="$t('petition.endDate')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiClock"
          :label="$t('petition.minutes')"
          v-model="formData.minutes"
          type="number"
          :rules="[requiredRule, positiveNumberRule]"
          outlined
          dense
          :aria-label="$t('petition.minutes')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          :prepend-icon="icons.mdiSchool"
          :label="$t('petition.baDegree')"
          v-model="formData.ba_degree"
          :items="degreeOptions"
          item-title="text"
          item-value="value"
          :aria-label="$t('petition.baDegree')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiCurrencyUsd"
          :label="$t('petition.budgetPosition')"
          v-model="formData.budget_position"
          :rules="role === 'student' ? [] : [requiredRule]"
          outlined
          dense
          :disabled="role === 'student'"
          :aria-label="$t('petition.budgetPosition')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiEmail"
          :label="$t('petition.budgetApprover')"
          v-model="formData.budget_approver"
          type="email"
          :rules="role === 'student' ? [] : [requiredRule, emailRule]"
          outlined
          dense
          :disabled="role === 'student'"
          :aria-label="$t('petition.budgetApprover')"
        />
      </v-col>

      <!-- Time and Duration Exception Fields -->
      <v-col cols="12">
        <v-checkbox
          v-model="formData.time_exec"
          :label="$t('petition.timeException')"
          @update:modelValue="handleTimeExceptionChange"
          :aria-label="$t('petition.timeException')"
        />
        <div class="mx-4">
          <v-text-field
            v-if="formData.time_exec"
            :label="$t('petition.timeExceName')"
            v-model="formData.time_exce_name"
            outlined
            dense
            :rules="formData.time_exec? [requiredRule] : []"
            :aria-label="$t('petition.timeExceName')"
          />
          <v-text-field
            v-if="formData.time_exec"
            :label="$t('petition.timeExceStart')"
            v-model="formData.time_exce_start"
            type="date"
            outlined
            dense
            :rules="formData.time_exec? [requiredRule] : []"
            :aria-label="$t('petition.timeExceStart')"
          />
          <v-text-field
            v-if="formData.time_exec"
            :label="$t('petition.timeExceEnd')"
            v-model="formData.time_exce_end"
            type="date"
            outlined
            dense
            :rules="formData.time_exec? [requiredRule] : []"
            :aria-label="$t('petition.timeExceEnd')"
          />
        </div>
      </v-col>
      
      <v-col cols="12">
        <v-checkbox
          v-model="formData.duration_exec"
          :label="$t('petition.durationException')"
          @update:modelValue="handleDurationExceptionChange"
          :aria-label="$t('petition.durationException')"
        />
        <div class="mx-4">
          <v-text-field
            v-if="formData.duration_exec"
            :label="$t('petition.durationExceName')"
            v-model="formData.duration_exce_name"
            outlined
            dense
            :rules="formData.duration_exec? [requiredRule] : []"
            :aria-label="$t('petition.durationExceName')"
          />
          <v-text-field
            v-if="formData.duration_exec"
            :label="$t('petition.durationExceStart')"
            v-model="formData.duration_exce_start"
            type="date"
            outlined
            dense
            :rules="formData.duration_exec? [requiredRule] : []"
            :aria-label="$t('petition.durationExceStart')"
          />
          <v-text-field
            v-if="formData.duration_exec"
            :label="$t('petition.durationExceEnd')"
            v-model="formData.duration_exce_end"
            type="date"
            outlined
            dense
            :rules="formData.duration_exec? [requiredRule] : []"
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
  { text: 'I have a Bachelor Degree', value: true },
  { text: 'I don\'t have a Bachelor Degree', value: false }
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
  time_exec: false,
  time_exce_name: '',
  time_exce_start: '',
  time_exce_end: '',
  duration_exec: false,
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
defineExpose({ formData, isFormValid });
</script>