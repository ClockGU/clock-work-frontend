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
          accept=".pdf,application/pdf"
          :aria-label="$t('filesUploadForm.elstam')"
          :hint="getHintMessage('elstam')"
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
          accept=".pdf,application/pdf"
          :aria-label="$t('filesUploadForm.studienbescheinigung')"
          :hint="getHintMessage('studienbescheinigung')"
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
          accept=".pdf,application/pdf"
          :aria-label="$t('filesUploadForm.versicherungsbescheinigung')"
          :hint="getHintMessage('versicherungsbescheinigung')"
        />
      </v-col>
      <v-col cols="12">
        <label for="sozialversicherungsbogen">{{
            $t('filesUploadForm.sozialversicherungsbogen')
          }}</label>
        <v-file-input
          id="sozialversicherungsbogen"
          v-model="sozialversicherungsbogenFile"
          outlined
          dense
          show-size
          persistent-hint
          accept=".pdf,application/pdf"
          :aria-label="$t('filesUploadForm.sozialversicherungsbogen')"
          :hint="getHintMessage('sozialversicherungsbogen')"
        />
      </v-col>
    </v-row>

    <!-- visual clue for missing and uploaded documents -->
    <v-card class="mt-4" variant="outlined">
      <v-card-text>
        <v-list density="compact">
          <v-list-item>
            <template v-slot:prepend>
              <StatusIndicator :status="hasElstamDocument" aria-hidden="true" />
            </template>
            <v-list-item-title class="ml-2">{{
              getStatusMessage('elstam')
            }}</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <StatusIndicator
                :status="hasStudienbescheinigungDocument"
                aria-hidden="true"
              />
            </template>
            <v-list-item-title class="ml-2">{{
              getStatusMessage('studienbescheinigung')
            }}</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template v-slot:prepend>
              <StatusIndicator
                :status="hasVersicherungsbescheinigungDocument"
                aria-hidden="true"
              />
            </template>
            <v-list-item-title class="ml-2">{{
              getStatusMessage('versicherungsbescheinigung')
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend>
              <StatusIndicator
                :status="hasSozialversicherungsbogenDocument"
                aria-hidden="true"
              />
            </template>
            <v-list-item-title class="ml-2">{{
                getStatusMessage('sozialversicherungsbogen')
              }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import StatusIndicator from '@/components/ui/StatusIndicator.vue';

const props = defineProps({
  initialDocuments: {
    type: Object,
    default: null,
  },
});
const { t } = useI18n();

const elstamFile = ref(null);
const studienbescheinigungFile = ref(null);
const versicherungsbescheinigungFile = ref(null);
const sozialversicherungsbogenFile = ref(null);

// Local state for existing document URLs
const existingDocuments = reactive({
  elstam_url: null,
  studienbescheinigung_url: null,
  versicherungsbescheinigung_url: null,
  sozialversicherungsbogen_url: null,
});

// Computed properties for document status
const hasElstamDocument = computed(() => {
  return !!elstamFile.value || !!existingDocuments.elstam_url;
});

const hasStudienbescheinigungDocument = computed(() => {
  return (
    !!studienbescheinigungFile.value ||
    !!existingDocuments.studienbescheinigung_url
  );
});

const hasVersicherungsbescheinigungDocument = computed(() => {
  return (
    !!versicherungsbescheinigungFile.value ||
    !!existingDocuments.versicherungsbescheinigung_url
  );
});

const hasSozialversicherungsbogenDocument = computed(() => {
  return (
    !!sozialversicherungsbogenFile.value ||
    !!existingDocuments.sozialversicherungsbogen_url
  );
});

// Validation: All three files must be present (either existing or new)
const isFormValid = computed(() => {
  return (
    hasElstamDocument.value &&
    hasStudienbescheinigungDocument.value &&
    hasVersicherungsbescheinigungDocument.value &&
    hasSozialversicherungsbogenDocument.value
  );
});
// Computed files object for parent component
const files = computed(() => ({
  elstam: elstamFile.value ? [elstamFile.value] : [],
  studienbescheinigung: studienbescheinigungFile.value
    ? [studienbescheinigungFile.value]
    : [],
  versicherungsbescheinigung: versicherungsbescheinigungFile.value
    ? [versicherungsbescheinigungFile.value]
    : [],
  sozialversierungsbogen: sozialversicherungsbogenFile.value
    ? [sozialversicherungsbogenFile.value]
    : [],
}));

// Initialize existing document URLs from props
const initializeDocuments = (data) => {
  if (data) {
    Object.assign(existingDocuments, data);
  } else {
    // Clear all URLs if the prop is null
    Object.assign(existingDocuments, {
      elstam_url: null,
      studienbescheinigung_url: null,
      versicherungsbescheinigung_url: null,
      sozialversicherungsbogen_url: null,
    });
  }
};
const getHintMessage = (field) => {
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
    case 'sozialversicherungsbogen':
      file = sozialversicherungsbogenFile.value;
      existingUrl = existingDocuments.sozialversicherungsbogen_url;
      break;
  }
  if (file) {
    return t('filesUploadForm.hint.selected', { filename: file.name });
  }
  if (existingUrl) {
    const filename = existingUrl.split('/').pop();
    return t('filesUploadForm.hint.existing', { filename });
  }
  return t('filesUploadForm.hint.noFile');
};

// Get status message for each document type
const getStatusMessage = (documentType) => {
  let file = null;
  let existingUrl = null;
  let documentKey = '';

  switch (documentType) {
    case 'elstam':
      file = elstamFile.value;
      existingUrl = existingDocuments.elstam_url;
      documentKey = 'elstam';
      break;
    case 'studienbescheinigung':
      file = studienbescheinigungFile.value;
      existingUrl = existingDocuments.studienbescheinigung_url;
      documentKey = 'studienbescheinigung';
      break;
    case 'versicherungsbescheinigung':
      file = versicherungsbescheinigungFile.value;
      existingUrl = existingDocuments.versicherungsbescheinigung_url;
      documentKey = 'versicherungsbescheinigung';
      break;
    case 'sozialversicherungsbogen':
      file = sozialversicherungsbogenFile.value;
      existingUrl = existingDocuments.sozialversicherungsbogen_url;
      documentKey = 'sozialversicherungsbogen';
      break;
  }

  if (file) {
    return t('filesUploadForm.status.newDocument', {
      document: t(`filesUploadForm.${documentKey}`),
    });
  }
  if (existingUrl) {
    return t('filesUploadForm.status.existingDocument', {
      document: t(`filesUploadForm.${documentKey}`),
    });
  }
  return t('filesUploadForm.status.noDocument', {
    document: t(`filesUploadForm.${documentKey}`),
  });
};

watch(
  () => props.initialDocuments,
  (newDocs) => {
    initializeDocuments(newDocs);
  },
  { immediate: true }
);

defineExpose({
  files,
  isFormValid,
});
</script>

<style scoped>
label {
  font-weight: 500;
  font-size: 1rem;
  margin-left: 2.5rem;
}
</style>
