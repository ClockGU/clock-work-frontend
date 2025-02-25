<template>
  <v-form ref="form" v-model="isFormValid">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          label="Petitioneer"
          v-model="formData.petitioneer"
          outlined
          dense
          disabled
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Student Mail"
          v-model="formData.student_mail"
          type="email"
          :rules="[requiredRule, emailRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Org Unit"
          v-model="formData.org_unit"
          :rules="role === 'student' ? [] : [requiredRule]"
          outlined
          dense
          :disabled="role === 'student'"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="EOS Number"
          v-model="formData.eos_number"
          :rules="role === 'student' ? [] : [requiredRule]"
          outlined
          dense
          :disabled="role === 'student'"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Start Date"
          v-model="formData.start_date"
          type="date"
          :rules="[requiredRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="End Date"
          v-model="formData.end_date"
          type="date"
          :rules="[requiredRule, endDateRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Minutes (h/Month)"
          v-model="formData.minutes"
          type="number"
          :rules="[requiredRule, positiveNumberRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-checkbox
          label="Bachelor Degree"
          v-model="formData.ba_degree"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Budget Position"
          v-model="formData.budget_position"
          :rules="role === 'student' ? [] : [requiredRule]"
          outlined
          dense
          :disabled="role === 'student'"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Budget Approver Email"
          v-model="formData.budget_approver"
          type="email"
          :rules="role === 'student' ? [] : [requiredRule, emailRule]"
          outlined
          dense
          :disabled="role === 'student'"
        />
      </v-col>

      <v-col cols="12">
        <v-btn
          variant="text"
          color="primary"
          @click="isExpanded = !isExpanded"
        >
          <v-icon>{{ isExpanded ? icons.mdiChevronUp : icons.mdiChevronDown }}</v-icon>
          {{ isExpanded ? 'Show Less' : 'Show More' }}
        </v-btn>
      </v-col>

      <!-- Time and Duration Exception Fields -->
      <template v-if="isExpanded">
        <v-col cols="12" md="6">
          <v-text-field
            label="Time Exception Name"
            v-model="formData.time_exce_name"
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="Duration Exception Name"
            v-model="formData.duration_exce_name"
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="Time Exception Start Date"
            v-model="formData.time_exce_start"
            type="date"
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="Duration Exception Start Date"
            v-model="formData.duration_exce_start"
            type="date"
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="Time Exception End Date"
            v-model="formData.time_exce_end"
            type="date"
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="Duration Exception End Date"
            v-model="formData.duration_exce_end"
            type="date"
            outlined
            dense
          />
        </v-col>
      </template>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { mdiChevronUp, mdiChevronDown } from '@mdi/js';

const icons = {
  mdiChevronUp,
  mdiChevronDown,
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
  time_exce_name: '',
  time_exce_start: '',
  time_exce_end: '',
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

// Validation Rules
const requiredRule = (v) => !!v || 'This field is required';
const emailRule = (v) => /.+@.+\..+/.test(v) || 'Invalid email address';
const positiveNumberRule = (v) => v > 0 || 'Must be a positive number';
const endDateRule = (v) => {
  if (!formData.value.start_date || !v) return true;
  return new Date(v) >= new Date(formData.value.start_date) || 'End date must be after start date';
};

const isExpanded = ref(false);

defineExpose({ formData, isFormValid });
</script>