<template>
  <v-form ref="form">
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
          outlined
          dense
          required
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Org Unit"
          v-model="formData.org_unit"
          outlined
          dense
          required
          :disabled="role === 'student'"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="EOS Number"
          v-model="formData.eos_number"
          outlined
          dense
          required
          :disabled="role === 'student'"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Start Date"
          v-model="formData.start_date"
          type="date"
          outlined
          dense
          required
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="End Date"
          v-model="formData.end_date"
          type="date"
          outlined
          dense
          required
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Minutes (h/Month)"
          v-model="formData.minutes"
          type="number"
          outlined
          dense
          required
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
          outlined
          dense
          required
          :disabled="role === 'student'"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Budget Approver Email"
          v-model="formData.budget_approver"
          type="email"
          outlined
          dense
          required
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
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="Duration Exception Name"
            v-model="formData.duration_exce_name"
            outlined
            dense
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="Time Exception Start Date"
            v-model="formData.time_exce_start"
            type="date"
            outlined
            dense
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Duration Exception Start Date"
            v-model="formData.duration_exce_start"
            type="date"
            outlined
            dense
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="Time Exception End Date"
            v-model="formData.time_exce_end"
            type="date"
            outlined
            dense
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="Duration Exception End Date"
            v-model="formData.duration_exce_end"
            type="date"
            outlined
            dense
            required
          />
        </v-col>
      </template>
    </v-row>
  </v-form>

</template>

<script setup>
import { ref ,watch} from 'vue';
import { mdiChevronUp, mdiChevronDown } from '@mdi/js';

const icons = {
  mdiChevronUp,
  mdiChevronDown,
};

const props = defineProps({
  petition: {
    type: Object,
    required: false,
    default: null,
  },
  role: {
    type: String,
    required: true,
    default: 'student',
  },
  isEditing: {
    type: Boolean,
    default: false,
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

watch(
  () => props.isEditing,
  (isEditing) => {
    if (isEditing && props.petition) {
      // Populate formData with petition data when isEditing is true
      formData.value = {
        petitioneer: props.petition.petitioneer || '',
        student_mail: props.petition.student_mail || '',
        start_date: props.petition.start_date || '',
        end_date: props.petition.end_date || '',
        org_unit: props.petition.org_unit || '',
        eos_number: props.petition.eos_number || '',
        minutes: props.petition.minutes || '',
        ba_degree: props.petition.ba_degree || false,
        budget_position: props.petition.budget_position || '',
        budget_approver: props.petition.budget_approver || '',
        time_exce_name: props.petition.time_exce_name || '',
        time_exce_start: props.petition.time_exce_start || '',
        time_exce_end: props.petition.time_exce_end || '',
        duration_exce_name: props.petition.duration_exce_name || '',
        duration_exce_start: props.petition.duration_exce_start || '',
        duration_exce_end: props.petition.duration_exce_end || '',
      };
    } else if (!isEditing) {
      // Reset formData to initialFormData only when isEditing is false
      formData.value = { ...initialFormData };
    }
  },
  { immediate: true } 
);

// Watch for changes in props.petition (only when isEditing is true)
watch(
  () => props.petition,
  (newVal) => {
    if (props.isEditing && newVal) {
      // Update formData with new petition data
      formData.value = {
        petitioneer: newVal.petitioneer || '',
        student_mail: newVal.student_mail || '',
        start_date: newVal.start_date || '',
        end_date: newVal.end_date || '',
        org_unit: newVal.org_unit || '',
        eos_number: newVal.eos_number || '',
        minutes: newVal.minutes || '',
        ba_degree: newVal.ba_degree || false,
        budget_position: newVal.budget_position || '',
        budget_approver: newVal.budget_approver || '',
        time_exce_name: newVal.time_exce_name || '',
        time_exce_start: newVal.time_exce_start || '',
        time_exce_end: newVal.time_exce_end || '',
        duration_exce_name: newVal.duration_exce_name || '',
        duration_exce_start: newVal.duration_exce_start || '',
        duration_exce_end: newVal.duration_exce_end || '',
      };
    }
  }
);

const isExpanded = ref(false);

defineExpose({ formData });
</script>

