<template>
  <CustomDialog
    :title="petition ? 'Edit Petition' : 'Create New Petition'">
    <template #content>
      <PetitionForm
        ref="petitionFormRef"
        :role="role"
        :petition="petition"
        :formData="formData"
        @close="closeDialog"
      />
    </template>

    <template #actions>
    <v-btn v-if="!petition" @click="submit" color="primary">Submit</v-btn>
    <v-btn v-else @click="save" color="primary">Save</v-btn>
    </template>
  </CustomDialog>
</template>

<script setup>
import {ref } from 'vue';
import { useStore } from 'vuex';
import PetitionForm from '@/components/forms/PetitionForm.vue';
import CustomDialog from '@/components/dialogs/CustomDialog.vue';

const props = defineProps({
  petition: {
    type: [Object, null],
    required: false,
  },
  role: {
    type: String,
    required: true,
  },

});

const emit = defineEmits(['close']);
const store = useStore();
const petitionFormRef = ref(null);

const closeDialog = () => emit('close');
const submit = () => {
  if (petitionFormRef.value) {
    const formData = petitionFormRef.value.formData;
    store.dispatch('petitions/addPetition', formData);
    closeDialog();
  }
};

const save = () => {
  if (petitionFormRef.value) {
    const formData = petitionFormRef.value.formData;
    store.dispatch('petitions/updatePetition', formData);
    closeDialog();
  }
};
</script>