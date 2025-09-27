<template>
  <v-form v-model="isFormValid">
    <v-row>
      <v-col cols="12">
        <label for="elstam">{{ $t('filesUploadForm.elstam') }}</label>
        <v-file-input
          id="elstam"
          v-model="elstamFile"
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
          v-model="studienbescheinigungFile"
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
          v-model="versicherungsbescheinigungFile"
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
import { ref, computed, onMounted, reactive } from 'vue';
import ContentApiService from '@/services/contentApiService';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const store = useStore();
const { t } = useI18n();

const elstamFile = ref(null);
const studienbescheinigungFile = ref(null);
const versicherungsbescheinigungFile = ref(null);

const existingDocuments = reactive({
  elstam_url: null,
  studienbescheinigung_url: null,
  versicherungsbescheinigung_url: null,
});

// Validation: All three files must be present (either existing or new)
const isFormValid = computed(() => {
  const elstamValid = !!elstamFile.value || !!existingDocuments.elstam_url;
  const studienValid = !!studienbescheinigungFile.value || !!existingDocuments.studienbescheinigung_url;
  const versicherungValid = !!versicherungsbescheinigungFile.value || !!existingDocuments.versicherungsbescheinigung_url;
  
  return elstamValid && studienValid && versicherungValid;
});

const fileUrl = (field) => {
  let file = null;
  let existingUrl = null;
  
  switch (field) {
    case 'elstam':
      file = elstamFile.value;
      existingUrl = existingDocuments.elstam_url;
      break;
    case 'studienbescheinigung':
      file = studienbescheinigungFile.value;
      existingUrl = existingDocuments.studienbescheinigung_url;
      break;
    case 'versicherungsbescheinigung':
      file = versicherungsbescheinigungFile.value;
      existingUrl = existingDocuments.versicherungsbescheinigung_url;
      break;
  }
  
  if (file) {
    return `Selected: ${file.name}`;
  }
  
  if (existingUrl) {
    return `Existing: ${existingUrl.split('/').pop()}`;
  }
  
  return 'No file selected';
};

// Computed files object for parent component
const files = computed(() => ({
  elstam: elstamFile.value ? [elstamFile.value] : [],
  studienbescheinigung: studienbescheinigungFile.value ? [studienbescheinigungFile.value] : [],
  versicherungsbescheinigung: versicherungsbescheinigungFile.value ? [versicherungsbescheinigungFile.value] : [],
}));

const fetchDocuments = async () => {
  try {
    const response = await ContentApiService.get('/documents');
    Object.assign(existingDocuments, response.data);
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