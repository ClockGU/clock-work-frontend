<template>
  <CustomDialog v-model="model" :title="$t('gdprAcceptanceDialog.title')">
    <template #content>
      <v-container class="text-body-1 pa-4 mt-4">
        <p class="mt-4 ml-2">
          {{ $t('gdprAcceptanceDialog.text') }}
        </p>

        <v-checkbox
          v-model="userAgreement"
          :label="$t('gdprAcceptanceDialog.accept')"
          class="mt-8"
          :disabled="isSaving"
        />
      </v-container>
    </template>

    <template #actions>
      <v-btn
        color="primary"
        variant="text"
        :aria-label="$t('actions.complete')"
        :disabled="!userAgreement || isSaving"
        :loading="isSaving"
        @click="agreeToPrivacyPolicy"
      >
        {{ $t('actions.complete') }}
      </v-btn>
    </template>
  </CustomDialog>
</template>

<script setup>
import CustomDialog from '@/components/dialogs/base/CustomDialog.vue';
import AuthApiService from '@/services/authApiService';
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const store = useStore();
const { t } = useI18n();

const model = ref(false);
const userAgreement = ref(false);
const isSaving = ref(false);

const user = computed(() => store.getters['auth/user']);

const agreeToPrivacyPolicy = async () => {
  if (!user.value || isSaving.value) return;

  isSaving.value = true;
  try {
    await AuthApiService.updateUser({ dsgvo_accepted: true }, user.value.id);
    await store.dispatch('auth/setUser', {
      ...user.value,
      dsgvo_accepted: true,
    });

    // Close only on success
    model.value = false;
  } catch (error) {
    console.error('Error updating user agreement:', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.gdprAcceptanceDialog.updateFailed'),
    });
    model.value = true;
  } finally {
    isSaving.value = false;
  }
};

watch(
  () => user.value,
  (user) => {
    if (!user) {
      model.value = false;
      return;
    }
    const mustAccept = !user.dsgvo_accepted;
    model.value = mustAccept;

    // Reset checkbox each time it opens (prevents stale checked state)
    if (mustAccept) userAgreement.value = false;
  },
  { immediate: true }
);
</script>
