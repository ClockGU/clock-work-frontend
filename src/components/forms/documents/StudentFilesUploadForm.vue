<template>
  <v-form>
    <v-row>
      <v-col v-for="doc in visibleDocs" :key="doc.key" cols="12">
        <DocumentFileInput
          v-model="selectedFiles[doc.key]"
          :label="$t(doc.labelKey)"
          :required="doc.required"
          :existing-url="existingDocuments[doc.urlKey]"
          :accept="doc.accept || 'application/pdf'"
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
  showResidencePermitField: { type: Boolean, default: false },
});

const emptyDocs = {
  elstam: null,
  studienbescheinigung: null,
  versicherungsbescheinigung: null,
  sozialversicherungsbogen: null,
  ba_degree: null,
  residence_permit: null,
  id_photo: null,
};
const selectedFiles = reactive(emptyDocs); // new uploads
const existingDocuments = reactive(emptyDocs); // existing urls from backend

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
  {
    key: 'residence_permit',
    labelKey: 'files.residence_permit',
    urlKey: 'residence_permit_url',
    required: props.showResidencePermitField,
    visible: props.showResidencePermitField,
    accept: 'application/pdf,image/*',
  },
  {
    key: 'id_photo',
    labelKey: 'files.id_photo',
    urlKey: 'id_photo_url',
    required: true,
    visible: true,
    accept: 'application/pdf,image/*',
  },
]);

const visibleDocs = computed(() => docs.value.filter((d) => d.visible));

const isProvided = (doc) =>
  !!selectedFiles[doc.key] || !!existingDocuments[doc.urlKey];

const isFormValid = computed(() =>
  visibleDocs.value.filter((d) => d.required).every((d) => isProvided(d))
);

const firstFile = (v) => (Array.isArray(v) ? v[0] : v);
const toFileArray = (v) => {
  const f = firstFile(v);
  return f ? [f] : [];
};

const files = computed(() => ({
  elstam: toFileArray(selectedFiles.elstam),
  studienbescheinigung: toFileArray(selectedFiles.studienbescheinigung),
  versicherungsbescheinigung: toFileArray(
    selectedFiles.versicherungsbescheinigung
  ),
  sozialversicherungsbogen: toFileArray(selectedFiles.sozialversicherungsbogen),
  ba_degree: toFileArray(selectedFiles.ba_degree),
  residence_permit: toFileArray(selectedFiles.residence_permit),
  id_photo: toFileArray(selectedFiles.id_photo),
}));

watch(
  () => props.initialDocuments,
  (newDocs) => {
    Object.assign(existingDocuments, newDocs || emptyDocs);
  },
  { immediate: true }
);

defineExpose({ files, isFormValid });
</script>
