<template>
  <v-form>
    <v-row>
      <v-col v-for="doc in visibleDocs" :key="doc.key" cols="12">
        <DocumentFileInput
          v-model="selectedFiles[doc.key]"
          :label="$t(doc.labelKey)"
          :required="doc.required"
          :existing-url="existingDocuments[doc.urlKey]"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import DocumentFileInput from '@/components/forms/documents/DocumentFileInput.vue';

const props = defineProps({
  initialDocuments: { type: Object, default: null },
  showBaDegreeField: { type: Boolean, default: false },
});

// new uploads
const selectedFiles = reactive({
  elstam: null,
  studienbescheinigung: null,
  versicherungsbescheinigung: null,
  sozialversicherungsbogen: null,
  ba_degree: null,
});

// existing urls from backend
const existingDocuments = reactive({
  elstam_url: null,
  studienbescheinigung_url: null,
  versicherungsbescheinigung_url: null,
  sozialversicherungsbogen_url: null,
  ba_degree_url: null,
});

const docs = computed(() => [
  {
    key: 'elstam',
    labelKey: 'files.elstam',
    urlKey: 'elstam_url',
    required: true,
    visible: true,
  },
  {
    key: 'studienbescheinigung',
    labelKey: 'files.studienbescheinigung',
    urlKey: 'studienbescheinigung_url',
    required: true,
    visible: true,
  },
  {
    key: 'versicherungsbescheinigung',
    labelKey: 'files.versicherungsbescheinigung',
    urlKey: 'versicherungsbescheinigung_url',
    required: true,
    visible: true,
  },
  {
    key: 'sozialversicherungsbogen',
    labelKey: 'files.sozialversicherungsbogen',
    urlKey: 'sozialversicherungsbogen_url',
    required: true,
    visible: true,
  },
  {
    key: 'ba_degree',
    labelKey: 'files.ba_degree',
    urlKey: 'ba_degree_url',
    required: true,
    visible: props.showBaDegreeField,
  },
]);

const visibleDocs = computed(() => docs.value.filter((d) => d.visible));

const isProvided = (doc) =>
  !!selectedFiles[doc.key] || !!existingDocuments[doc.urlKey];

const isFormValid = computed(() =>
  visibleDocs.value.filter((d) => d.required).every((d) => isProvided(d))
);

const files = computed(() => ({
  elstam: selectedFiles.elstam ? [selectedFiles.elstam] : [],
  studienbescheinigung: selectedFiles.studienbescheinigung
    ? [selectedFiles.studienbescheinigung]
    : [],
  versicherungsbescheinigung: selectedFiles.versicherungsbescheinigung
    ? [selectedFiles.versicherungsbescheinigung]
    : [],
  sozialversierungsbogen: selectedFiles.sozialversicherungsbogen
    ? [selectedFiles.sozialversicherungsbogen]
    : [],
  ba_degree: selectedFiles.ba_degree ? [selectedFiles.ba_degree] : [],
}));

watch(
  () => props.initialDocuments,
  (newDocs) => {
    Object.assign(
      existingDocuments,
      newDocs || {
        elstam_url: null,
        studienbescheinigung_url: null,
        versicherungsbescheinigung_url: null,
        sozialversicherungsbogen_url: null,
        ba_degree_url: null,
      }
    );
  },
  { immediate: true }
);

defineExpose({ files, isFormValid });
</script>
