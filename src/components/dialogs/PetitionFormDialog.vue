<template>
  <CustomDialog
    :title="$t('petitionFormDialog.title', { petition: petition ? 'Edit' : 'Create New' })"
    aria-label="petitionFormDialog.ariaLabel.dialog"
  >
    <template #content>
      <PetitionForm
        class="mt-12"
        ref="petitionFormRef"
        :role="role"
        :petition="petition"
        @close="closeDialog"
        aria-label="petitionFormDialog.ariaLabel.petitionForm"
      />
    </template>

    <template #actions>
      <v-btn
        v-if="!petition"
        @click="submit"
        :disabled="!isFormValid"
        color="primary"
        :aria-label="$t('petitionFormDialog.ariaLabel.submit')"
      >
        {{ $t('actions.submit') }}
      </v-btn>
      <v-btn
        v-else
        @click="save"
        :disabled="!isFormValid"
        color="primary"
        :aria-label="$t('petitionFormDialog.ariaLabel.save')"
      >
        {{ $t('actions.save') }}
      </v-btn>
    </template>
  </CustomDialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import PetitionForm from '@/components/forms/PetitionForm.vue';
import CustomDialog from '@/components/dialogs/CustomDialog.vue';
import ApiService from "@/services/api";


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

const isFormValid = computed(() => petitionFormRef.value?.isFormValid || false);

const closeDialog = () => emit('close');

const submit = async () => {
  if (isFormValid.value) {
    const formData = petitionFormRef.value.formData; // Get form data from the form component
    console.log('Form Data:', formData);

    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== '' && value !== null)
    );

    try {
      // Call the backend API to create a new petition
      await ApiService.post('/petitions/', filteredFormData);
      closeDialog(); // Close the dialog on success
    } catch (error) {
      console.error('Failed to submit petition:', error);
      // Optionally, show an error message to the user
    }
  }
};

const save = async () => {
  if (isFormValid.value) {
    const formData = petitionFormRef.value.formData; // Get form data from the form component
    console.log('I am in save');
    console.log('Form Data:', formData);

    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== '' && value !== null)
    );

    try {
      // Call the backend API to update the petition
      await ApiService.put(`/petitions/${props.petition.id}`, filteredFormData); // Use PUT or PATCH
      closeDialog(); // Close the dialog on success
    } catch (error) {
      console.error('Failed to update petition:', error);
      // Optionally, show an error message to the user
    }
  }
};
</script>

