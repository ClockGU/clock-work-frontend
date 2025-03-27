<template>
  <v-form ref="form" v-model="isFormValid">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiAccount"
          label="Petitioneer"
          v-model="formData.petitioneer"
          outlined
          dense
          disabled
          aria-label="Petitioneer Name"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiEmail"
          label="Student Mail"
          v-model="formData.student_mail"
          type="email"
          :rules="[requiredRule, emailRule]"
          outlined
          dense
          aria-label="Student Email"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiOfficeBuilding"
          label="Org Unit"
          v-model="formData.org_unit"
          :rules="role === 'student' ? [] : [requiredRule]"
          outlined
          dense
          :disabled="role === 'student'"
          aria-label="Organizational Unit"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiNumeric"
          label="EOS Number"
          v-model="formData.eos_number"
          :rules="role === 'student' ? [] : [requiredRule]"
          outlined
          dense
          :disabled="role === 'student'"
          aria-label="EOS Number"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiCalendar"
          label="Start Date"
          v-model="formData.start_date"
          type="date"
          :rules="[requiredRule]"
          outlined
          dense
          aria-label="Start Date"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiCalendar"
          label="End Date"
          v-model="formData.end_date"
          type="date"
          :rules="[requiredRule, endDateRule]"
          outlined
          dense
          aria-label="End Date"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiClock"
          label="Minutes (h/Month)"
          v-model="formData.minutes"
          type="number"
          :rules="[requiredRule, positiveNumberRule]"
          outlined
          dense
          aria-label="Minutes per Month"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          :prepend-icon="icons.mdiSchool"
          label="Bachelor Degree"
          v-model="formData.ba_degree"
          :items="degreeOptions"
          item-title="text"
          item-value="value"
          aria-label="Bachelor Degree"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiCurrencyUsd"
          label="Budget Position"
          v-model="formData.budget_position"
          :rules="role === 'student' ? [] : [requiredRule]"
          outlined
          dense
          :disabled="role === 'student'"
          aria-label="Budget Position"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiEmail"
          label="Budget Approver Email"
          v-model="formData.budget_approver"
          type="email"
          :rules="role === 'student' ? [] : [requiredRule, emailRule]"
          outlined
          dense
          :disabled="role === 'student'"
          aria-label="Budget Approver Email"
        />
      </v-col>

      <!-- Time and Duration Exception Fields -->
      <v-col cols="12">
        <v-checkbox
          v-model="formData.time_exec"
          label="Time Exception"
          @update:modelValue="handleTimeExceptionChange"
          aria-label="Time Exception"
        />
        <div class="mx-4">
          <v-text-field
            v-if="formData.time_exec"
            label="Time Exception Name"
            v-model="formData.time_exce_name"
            outlined
            dense
            :rules="formData.time_exec? [requiredRule] : []"
            aria-label="Time Exception Name"
          />
          <v-text-field
            v-if="formData.time_exec"
            label="Time Exception Start Date"
            v-model="formData.time_exce_start"
            type="date"
            outlined
            dense
            :rules="formData.time_exec? [requiredRule] : []"
            aria-label="Time Exception Start Date"
          />
          <v-text-field
            v-if="formData.time_exec"
            label="Time Exception End Date"
            v-model="formData.time_exce_end"
            type="date"
            outlined
            dense
            :rules="formData.time_exec? [requiredRule] : []"
            aria-label="Time Exception End Date"
          />
        </div>
      </v-col>
      
      <v-col cols="12">
        <v-checkbox
          v-model="formData.duration_exec"
          label="Duration Exception"
          @update:modelValue="handleDurationExceptionChange"
          aria-label="Duration Exception"
        />
        <div class="mx-4">
          <v-text-field
            v-if="formData.duration_exec"
            label="Duration Exception Name"
            v-model="formData.duration_exce_name"
            outlined
            dense
            :rules="formData.duration_exec? [requiredRule] : []"
            aria-label="Duration Exception Name"
          />
          <v-text-field
            v-if="formData.duration_exec"
            label="Duration Exception Start Date"
            v-model="formData.duration_exce_start"
            type="date"
            outlined
            dense
            :rules="formData.duration_exec? [requiredRule] : []"
            aria-label="Duration Exception Start Date"
          />
          <v-text-field
            v-if="formData.duration_exec"
            label="Duration Exception End Date"
            v-model="formData.duration_exce_end"
            type="date"
            outlined
            dense
            :rules="formData.duration_exec? [requiredRule] : []"
            aria-label="Duration Exception End Date"
          />
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { mdiAccount, mdiEmail, mdiOfficeBuilding, mdiNumeric, mdiSchool,mdiCalendar, mdiClock, mdiCurrencyUsd } from '@mdi/js';

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
  { text: 'I have a Bachlor Degree', value: true },
  { text: 'I don\'t have a Bachlor Degree', value: false }
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

// Validation Rules
const requiredRule = (v) => !!v || 'This field is required';
const emailRule = (v) => /.+@.+\..+/.test(v) || 'Invalid email address';
const positiveNumberRule = (v) => v > 0 || 'Must be a positive number';
const endDateRule = (v) => {
  if (!formData.value.start_date || !v) return true;
  return new Date(v) >= new Date(formData.value.start_date) || 'End date must be after start date';
};

defineExpose({ formData, isFormValid });
</script>