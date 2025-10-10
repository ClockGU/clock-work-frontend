<template>
  <CustomDialog
    :title="
      $t('petitionFormDialog.title', {
        petition: petition ? 'Edit' : 'Create New',
      })
    "
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
import ContentApiService from '@/services/contentApiService';
import Petition from '@/models/Petition';

const props = defineProps({
  petition: {
    type: [Petition, null],
    required: false,
    default: null,
  },
});

const emit = defineEmits(['close', 'refresh']);
const store = useStore();
const { t } = useI18n();
const petitionFormRef = ref(null);

const userRole = computed(() => store.getters['auth/userRole']);

const isFormValid = computed(() => petitionFormRef.value?.isAllValid || false);

const closeDialog = () => emit('close');

const submit = async () => {
  if (isFormValid.value) {
    const formData = petitionFormRef.value.formData;
    try {
      // Use the Petition model's toBackendFormat method for proper date formatting
      const dataToSend = formData.toBackendFormat();
      await ContentApiService.post('/supervisor/petitions/', dataToSend);
      emit('refresh');
    } catch (error) {
      console.error('Failed to submit petition:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: t('errors.petitionFormDialog.submission'),
      });
    } finally {
      closeDialog();
    }
  }
};

const save = async () => {
  if (isFormValid.value) {
    const formData = petitionFormRef.value.formData;

    try {
      const role = userRole.value === 2 ? 'clerk' : 'supervisor';
      // Use the Petition model's toBackendFormat method for proper date formatting
      const dataToSend = formData.toBackendFormat();
      const response = await ContentApiService.patch(
        `/${role}/petitions/${props.petition.id}`,
        dataToSend
      );
      emit('refresh', {
        type: 'update',
        data: response.data,
      });
    } catch (error) {
      console.error('Failed to update petition:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: t('errors.petitionFormDialog.saving'),
      });
    } finally {
      closeDialog();
    }
  }
};
</script>
