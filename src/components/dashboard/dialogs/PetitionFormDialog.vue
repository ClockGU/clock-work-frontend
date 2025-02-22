<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        {{ !isEditing ? 'Create New Petition' : 'Edit Petition' }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="submit">
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
            <template v-if="role === 'supervisor'">
              <v-col cols="12" md="6">
                <v-text-field
                  label="Org Unit"
                  v-model="formData.org_unit"
                  outlined
                  dense
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="EOS Number"
                  v-model="formData.eos_number"
                  outlined
                  dense
                  required
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
            </template>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn @click="dialog = false" color="grey" class="mr-2">Cancel</v-btn>
        <v-btn v-if="!isEditing" @click="submit" color="primary">Submit</v-btn>
        <v-btn v-else @click="save" color="primary">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import {mdiChevronUp, mdiChevronDown} from '@mdi/js';

const icons = {
  mdiChevronUp,
  mdiChevronDown
}
const props = defineProps({
  petition: {
    type: [Object, null],
    required: false,
  },
  role: {
    type: String,
    required: true,
    default: 'student',
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);
const store = useStore();

const dialog = ref(props.modelValue);
const petition = ref(props.petition);
const isExpanded = ref(false); // Controls visibility of additional fields

// Form data
const formData = ref({
  petitioneer: petition.value?.petitioneer || '',
  student_mail: petition.value?.student_mail || '',
  start_date: petition.value?.start_date || '',
  end_date: petition.value?.end_date || '',
  org_unit: petition.value?.org_unit || '',
  eos_number: petition.value?.eos_number || '',
  minutes: petition.value?.minutes || '',
  ba_degree: petition.value?.ba_degree || false,
  budget_position: petition.value?.budget_position || '',
  budget_approver: petition.value?.budget_approver || '',
  time_exce_name: petition.value?.time_exce_name || '',
  time_exce_start: petition.value?.time_exce_start || '',
  time_exce_end: petition.value?.time_exce_end || '',
  duration_exce_name: petition.value?.duration_exce_name || '',
  duration_exce_start: petition.value?.duration_exce_start || '',
  duration_exce_end: petition.value?.duration_exce_end || '',
});

// Watch for changes in modelValue prop
watch(
  () => props.modelValue,
  (newValue) => {
    dialog.value = newValue;
  }
);

// Watch dialog state and emit update to parent
watch(dialog, (newValue) => {
  emit('update:modelValue', newValue);
});

// Watch for changes in petition prop and update formData
watch(
  () => props.petition,
  (newVal) => {
    if (newVal) {
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
  },
  { immediate: true }
);

const submit = () => {
  console.log('Form submitted:', formData.value);
  store.dispatch('petitions/addPetition', formData.value);
  dialog.value = false; // Close the dialog after submission
};

const save = () => {
  store.dispatch('petitions/updatePetition', formData.value);
  dialog.value = false; // Close the dialog after submission
};
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>
