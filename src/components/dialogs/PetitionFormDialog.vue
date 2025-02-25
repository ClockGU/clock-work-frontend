<template>
  <CustomDialog
    :title="!showForm ? 'Edit Personal Information' : !isEditing ? 'Create New Petition' : 'Edit Petition'">
    <template #content>
      <PetitionForm
        v-if="showForm"
        ref="petitionFormRef"
        :role="role"
        :petition="petition"
        :formData="formData"
        :isEditing="isEditing"
        @close="closeDialog"
      />
      <EmployeeDataForm
        v-else
        :role="role"
        :petition="petition"
        :isEditing="isEditing"
      />
    </template>

    <template #actions="{ close }">
    <v-btn v-if="!isEditing" @click="submit" color="primary">Submit</v-btn>
    <v-btn v-else @click="save" color="primary">Save</v-btn>
    </template>
  </CustomDialog>
</template>

<script setup>
import {ref,watch } from 'vue';
import { useStore } from 'vuex';
import PetitionForm from '@/components/forms/PetitionForm.vue';
import EmployeeDataForm from '@/components/forms/EmployeeDataForm.vue';
import CustomDialog from '@/components/dialogs/CustomDialog.vue';

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
  isEditing: {
    type: Boolean,
    default: false,
  },
  showForm: {
    type: Boolean,
    default: true,
  },
  
});

const emit = defineEmits(['close']);
const store = useStore();
const petitionFormRef = ref(null);

const closeDialog = () => emit('close');
const submit = () => {
  if (petitionFormRef.value) {
    const formData = petitionFormRef.value.formData;
    console.log('Form Data to Submit:', formData);
    store.dispatch('petitions/addPetition', formData);
    closeDialog();
  }
};

const save = () => {
  if (petitionFormRef.value) {
    const formData = petitionFormRef.value.formData;
    console.log('Form Data to Save:', formData);
    store.dispatch('petitions/updatePetition', formData);
    closeDialog();
  }
};
</script>