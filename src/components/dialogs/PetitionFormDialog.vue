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

const submit = () => {
  if (isFormValid.value) {
    const formData = petitionFormRef.value.formData;
    store.dispatch('petitions/addPetition', formData);
    closeDialog();
  }
};

const save = () => {
  if (isFormValid.value) {
    const formData = petitionFormRef.value.formData;
    store.dispatch('petitions/updatePetition', formData);
    closeDialog();
  }
};
</script>

