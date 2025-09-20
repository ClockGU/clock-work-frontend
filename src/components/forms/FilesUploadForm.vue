<template>
  <v-form v-model="isFormValid">
    <v-row>
      <v-col cols="12">
        <label for="elstam">{{ $t('filesUploadForm.elstam') }}</label>
        <v-file-input
          id="elstam"
          v-model="files.elstam"
          outlined
          dense
          show-size
          persistent-hint
          :aria-label="$t('filesUploadForm.elstam')"
          :hint="fileUrl('elstam')"
        />
      </v-col>
      <v-col cols="12">
        <label for="studienbescheinigung">{{
          $t('filesUploadForm.studienbescheinigung')
        }}</label>
        <v-file-input
          id="studienbescheinigung"
          v-model="files.studienbescheinigung"
          outlined
          dense
          show-size
          persistent-hint
          :aria-label="$t('filesUploadForm.studienbescheinigung')"
          :hint="fileUrl('studienbescheinigung')"
        />
      </v-col>
      <v-col cols="12">
        <label for="versicherungsbescheinigung">{{
          $t('filesUploadForm.versicherungsbescheinigung')
        }}</label>
        <v-file-input
          id="versicherungsbescheinigung"
          v-model="files.versicherungsbescheinigung"
          outlined
          dense
          show-size
          persistent-hint
          :aria-label="$t('filesUploadForm.versicherungsbescheinigung')"
          :hint="fileUrl('versicherungsbescheinigung')"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ContentApiService from '@/services/contentApiService';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const store = useStore();
const { t } = useI18n;
const files = ref({
  elstam: [],
  studienbescheinigung: [],
  versicherungsbescheinigung: [],
});
const existingDocuments = ref({
  elstam_url: null,
  studienbescheinigung_url: null,
  versicherungsbescheinigung_url: null,
});

// Proper validation that checks both existing docs and new uploads exists
const isFormValid = computed(() => {
  return ['elstam', 'studienbescheinigung', 'versicherungsbescheinigung'].every(
    (field) => {
      return (
        existingDocuments.value[`${field}_url`] || files.value[field].length > 0
      );
    }
  );
});
//if a file exist show its url as a hint
const fileUrl = (field) => {
  if (files.value[field].length > 0) return '';
  return existingDocuments.value[`${field}_url`]
    ? existingDocuments.value[`${field}_url`].split('/').pop()
    : '';
};

const fetchDocuments = async () => {
  try {
    const response = await ContentApiService.get('/documents');
    existingDocuments.value = response.data;
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error('Error fetching documents:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: t('errors.studentData.fetchingDocs'),
      });
    }
  }
};

onMounted(fetchDocuments);

defineExpose({
  files,
  isFormValid,
  fetchDocuments,
});
</script>
<style scoped>
label {
  font-weight: 500;
  font-size: 1rem;
  margin-left: 2.5rem;
}
</style>
