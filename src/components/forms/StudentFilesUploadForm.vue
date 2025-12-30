<template>
  <v-form v-model="isFormValid">
    <v-row>
      <v-col cols="12">
        <label for="elstam">{{ $t('files.elstam') }}</label>
        <v-file-input
          id="elstam"
          v-model="elstamFile"
          outlined
          dense
          show-size
          persistent-hint
          accept=".pdf,application/pdf"
          :aria-label="$t('files.elstam')"
          :hint="getHintMessage('elstam')"
        />
      </v-col>
      <v-col cols="12">
        <label for="studienbescheinigung">{{
          $t('files.studienbescheinigung')
        }}</label>
        <v-file-input
          id="studienbescheinigung"
          v-model="studienbescheinigungFile"
          outlined
          dense
          show-size
          persistent-hint
          accept=".pdf,application/pdf"
          :aria-label="$t('files.studienbescheinigung')"
          :hint="getHintMessage('studienbescheinigung')"
        />
      </v-col>
      <v-col cols="12">
        <label for="versicherungsbescheinigung">{{
          $t('files.versicherungsbescheinigung')
        }}</label>
        <v-file-input
          id="versicherungsbescheinigung"
          v-model="versicherungsbescheinigungFile"
          outlined
          dense
          show-size
          persistent-hint
          accept=".pdf,application/pdf"
          :aria-label="$t('files.versicherungsbescheinigung')"
          :hint="getHintMessage('versicherungsbescheinigung')"
        />
      </v-col>
      <v-col cols="12">
        <label for="sozialversicherungsbogen">{{
          $t('files.sozialversicherungsbogen')
        }}</label>
        <v-file-input
          id="sozialversicherungsbogen"
          v-model="sozialversicherungsbogenFile"
          outlined
          dense
          show-size
          persistent-hint
          accept=".pdf,application/pdf"
          :aria-label="$t('files.sozialversicherungsbogen')"
          :hint="getHintMessage('sozialversicherungsbogen')"
        />
      </v-col>

      <v-col v-if="showBaDegreeField" cols="12">
        <label for="ba_degree">{{ $t('files.ba_degree') }}</label>
        <v-file-input
          id="ba_degree"
          v-model="baDegreeFile"
          outlined
          dense
          show-size
          persistent-hint
          accept=".pdf,application/pdf"
          :aria-label="$t('files.ba_degree')"
          :hint="getHintMessage('ba_degree')"
        />
      </v-col>
    </v-row>

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

          <v-list-item v-if="showBaDegreeField">
            <template v-slot:prepend>
              <StatusIndicator
                :status="hasBaDegreeDocument"
                aria-hidden="true"
              />
            </template>
            <v-list-item-title class="ml-2">{{
              getStatusMessage('ba_degree')
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
  showBaDegreeField: {
    type: Boolean,
    default: false,
  },
});
const { t } = useI18n();

const elstamFile = ref(null);
const studienbescheinigungFile = ref(null);
const versicherungsbescheinigungFile = ref(null);
const sozialversicherungsbogenFile = ref(null);
const baDegreeFile = ref(null);

// Local state for existing document URLs
const existingDocuments = reactive({
  elstam_url: null,
  studienbescheinigung_url: null,
  versicherungsbescheinigung_url: null,
  sozialversicherungsbogen_url: null,
  ba_degree_url: null,
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

const hasBaDegreeDocument = computed(() => {
  return !!baDegreeFile.value || !!existingDocuments.ba_degree_url;
});

// Validation: Basic files + BA Degree if required
const isFormValid = computed(() => {
  const basicValidation =
    hasElstamDocument.value &&
    hasStudienbescheinigungDocument.value &&
    hasVersicherungsbescheinigungDocument.value &&
    hasSozialversicherungsbogenDocument.value;

  if (props.showBaDegreeField) {
    return basicValidation && hasBaDegreeDocument.value;
  }

  return basicValidation;
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
  ba_degree: baDegreeFile.value ? [baDegreeFile.value] : [],
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
      ba_degree_url: null,
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
    case 'ba_degree':
      file = baDegreeFile.value;
      existingUrl = existingDocuments.ba_degree_url;
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
    case 'ba_degree':
      file = baDegreeFile.value;
      existingUrl = existingDocuments.ba_degree_url;
      documentKey = 'ba_degree';
      break;
  }

  if (file) {
    return t('filesUploadForm.status.newDocument', {
      document: t(`files.${documentKey}`),
    });
  }
  if (existingUrl) {
    return t('filesUploadForm.status.existingDocument', {
      document: t(`files.${documentKey}`),
    });
  }
  return t('filesUploadForm.status.noDocument', {
    document: t(`files.${documentKey}`),
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
