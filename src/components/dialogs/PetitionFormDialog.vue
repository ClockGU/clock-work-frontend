<template>
  <CustomDialog
    :title="$t('petitionFormDialog.title', { petition: petition ? 'Edit' : 'Create New' })"
    :aria-label="$t('petitionFormDialog.ariaLabel.dialog')"
  >
    <template #content>
      <PetitionForm
        ref="petitionFormRef"
        class="mt-12"
        :role="role"
        :petition="petition"
        :aria-label="$t('petitionFormDialog.ariaLabel.petitionForm')"
        @close="closeDialog"
      />
    </template>

    <template #actions>
      <v-btn
        v-if="!petition"
        color="primary"
        :disabled="!isFormValid"
        :aria-label="$t('petitionFormDialog.ariaLabel.submit')"
        @click="submit"
      >
        {{ $t('actions.submit') }}
      </v-btn>
      <v-btn
        v-else
        color="primary"
        :disabled="!isFormValid"
        :aria-label="$t('petitionFormDialog.ariaLabel.save')"
        @click="save"
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
    default: null,
  },
  role: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close','refresh']);
const store = useStore();
const petitionFormRef = ref(null);

const isFormValid = computed(() => petitionFormRef.value?.isFormValid || false);

const closeDialog = () => emit('close');
const submit = async () => {
  if (isFormValid.value) {
    const formData = petitionFormRef.value.formData; // Get form data from the form petition form
    console.log('Form Data:', formData);
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== '' && value !== null)
    );
    try {
      // Call the backend API to create a new petition
      await ApiService.post('supervisor/petitions/', filteredFormData);
      emit('refresh');
    } catch (error) {
      console.error('Failed to submit petition:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: 'Failed to submit petition. Please try again.',
      });
    }
    finally {
      closeDialog();
    }
  }
};
const save = async () => {
  if (isFormValid.value) {
    const formData = petitionFormRef.value.formData;
    console.log('I am in save');
    console.log('Form Data:', formData);
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== '' && value !== null)
    );
    try {
      await ApiService.patch(`supervisor/petitions/${props.petition.id}`, filteredFormData);
      emit('refresh'); 
    } catch (error) {
      console.error('Failed to update petition:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: 'Failed to update petition. Please try again.',
      });
    }
    finally {
      closeDialog();
    }
  }
};
</script>

