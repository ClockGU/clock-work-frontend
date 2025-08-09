<template>
  <CustomDialog
    :title="$t('petitionFormDialog.title', { petition: petition ? 'Edit' : 'Create New' })"
    :aria-label="$t('ariaLabel.petitionFormDialog.dialog')"
  >
    <template #content>
      <PetitionForm
        ref="petitionFormRef"
        class="mt-12"
        :petition="petition"
        :aria-label="$t('ariaLabel.petitionFormDialog.petitionForm')"
        @close="closeDialog"
      />
    </template>

    <template #actions>
      <v-btn
        v-if="!petition"
        color="primary"
        :disabled="!isFormValid"
        :aria-label="$t('ariaLabel.petitionFormDialog.submit')"
        @click="submit"
      >
        {{ $t('actions.submit') }}
      </v-btn>
      <v-btn
        v-else
        color="primary"
        :disabled="!isFormValid"
        :aria-label="$t('ariaLabel.petitionFormDialog.save')"
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
import { useI18n } from 'vue-i18n';
import PetitionForm from '@/components/forms/PetitionForm.vue';
import CustomDialog from '@/components/dialogs/CustomDialog.vue';
import ContentApiService from "@/services/contentApiService";

const props = defineProps({
  petition: {
    type: [Object, null],
    required: false,
    default: null,
  },

});

const emit = defineEmits(['close','refresh']);
const store = useStore();
const {t} = useI18n();
const petitionFormRef = ref(null);

const userRole = computed(() => store.getters['auth/user'].user_role);
const isFormValid = computed(() => petitionFormRef.value?.isFormValid || false);

const closeDialog = () => emit('close');
const submit = async () => {
  if (isFormValid.value) {
    const formData = petitionFormRef.value.formData; // Get form data from the form petition form
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== '' && value !== null)
    );
    try {
      // Call the backend API to create a new petition (only suppervisor can create a petition)
      await ContentApiService.post('supervisor/petitions/', filteredFormData);
      emit('refresh');
    } catch (error) {
      console.error('Failed to submit petition:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: t("errors.petitionFormDialog.submission"),
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
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== '' && value !== null)
    );
    try {
      const role = userRole.value===2 ? 'clerk': 'supervisor';
      const response = await ContentApiService.patch(`${role}/petitions/${props.petition.id}`, filteredFormData);
      emit('refresh', {
        type: 'update',
        data: response.data
      });
    } catch (error) {
      console.error('Failed to update petition:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: t("errors.petitionFormDialog.saving"),
      });
    }
    finally {
      closeDialog();
    }
  }
};
</script>

