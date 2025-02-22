<template>
  <!-- Dialog for the form -->
  <v-dialog v-model="dialog" max-width="800">
    <!-- Dialog content -->
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        {{ !isEditing ? 'Create New Petition' : 'Edit Petition' }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="submit">
          <v-row>
            <!-- Common Fields -->
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

            <!-- Supervisor-Specific Fields -->
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
                  label="Minutes (h/Month)"
                  v-model="formData.minutes"
                  type="number"
                  outlined
                  dense
                  required
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
            </template>

            <!-- Student-Specific Fields -->
            <template v-if="role === 'student'">
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
                  label="Duration Exception Name"
                  v-model="formData.duration_exce_name"
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
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn @click="dialog = false" color="grey" class="mr-2">Cancel</v-btn>
        <v-btn  v-if="!isEditing" @click="submit" color="primary">Submit</v-btn>
        <v-btn v-else @click="save" color="primary">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
// Define the petition prop and modelValue for dialog control
const props = defineProps({
  petition: {
    type: [Object,null],
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
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);
const store= useStore();

const dialog = ref(props.modelValue);
const petition = ref(props.petition);

// Form data
const formData = computed(() => ({
  student_mail: petition.value?.student_mail || '',
  start_date: petition.value?.start_date || '',
  end_date: petition.value?.end_date || '',
  petitioneer: petition.value?.petitioneer || '',
  org_unit: petition.value?.org_unit || '',
  eos_number: petition.value?.eos_number || '',
  minutes: petition.value?.minutes || '',
  ba_degree: petition.value?.ba_degree || '',
  budget_position: petition.value?.budget_position || '',
  budget_approver: petition.value?.budget_approver || '',
  time_exce_name: petition.value?.time_exce_name || '',
  time_exce_start: petition.value?.time_exce_start || '',
  time_exce_end: petition.value?.time_exce_end || '',
  duration_exce_name: petition.value?.duration_exce_name || '',
  duration_exce_start: petition.value?.duration_exce_start || '',
  duration_exce_end: petition.value?.duration_exce_end || '',
}));
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

watch(() => props.petition,(newVal) => petition.value = newVal,{ immediate: true });

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