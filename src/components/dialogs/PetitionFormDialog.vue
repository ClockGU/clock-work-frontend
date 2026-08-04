<template>
  <CustomDialog
    v-model="model"
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
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { isSupervisor } from '@/utils/roleUtils';
import PetitionForm from '@/components/forms/PetitionForm.vue';
import CustomDialog from '@/components/dialogs/base/CustomDialog.vue';
import ContentApiService from '@/services/contentApiService';
import Petition from '@/models/Petition';

const props = defineProps({
  petition: {
    type: [Object, null],
    required: false,
    default: null,
  },
});

const emit = defineEmits(['close', 'refresh']);
const store = useStore();
const { t } = useI18n();
const petitionFormRef = ref(null);
const model = defineModel({ type: Boolean, default: false });

const isFormValid = computed(() => petitionFormRef.value?.isAllValid || false);

const closeDialog = () => emit('close');

// Snapshot the pristine petition data whenever the dialog opens, so save()
// can diff edits against it to patch only changed data.
let initialPetitionData = null;
watch(model, (isOpen) => {
  if (isOpen) {
    initialPetitionData = props.petition
      ? JSON.parse(JSON.stringify(props.petition))
      : null;
  }
});

const submit = async () => {
  if (isFormValid.value) {
    const formData = petitionFormRef.value.formData;
    try {
      // Use the Petition model's toBackendFormat method for proper date formatting
      const dataToSend = formData.toBackendFormat();
      await ContentApiService.post('/supervisor/petitions', dataToSend);
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
      if (!isSupervisor.value) {
        throw new Error('Only supervisors can edit petitions.');
      }
      // Use the Petition model's toBackendFormat method for proper date formatting
      const dataToSend = formData.toBackendFormat();
      // Compare against snapshot taken when the dialog opened
      // and only PATCH the diff
      const originalData = Petition.fromBackendResponse(
        initialPetitionData
      ).toBackendFormat();
      const changedData = Object.fromEntries(
        Object.entries(dataToSend).filter(
          ([key, value]) =>
            JSON.stringify(value) !== JSON.stringify(originalData[key])
        )
      );
      console.log(JSON.stringify(changedData))
      if (Object.keys(changedData).length === 0) {
        closeDialog();
        return;
      }

      const response = await ContentApiService.patch(
        `/supervisor/petitions/${props.petition.id}`,
        changedData
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
