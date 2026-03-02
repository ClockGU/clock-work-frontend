<template>
  <v-card variant="outlined" rounded="md" class="px-6 py-4">
    <div class="d-flex align-center justify-space-between">
      <div class="text-body-2 font-weight-medium">
        {{ label }}
        <span v-if="required" class="error--text">*</span>
      </div>

      <v-chip small label :color="chipColor" text-color="white">
        <v-icon small class="mr-1">{{ chipIcon }}</v-icon>
        {{ chipText }}
      </v-chip>
    </div>

    <div class="d-flex align-center justify-space-between mt-1">
      <div class="text-caption text--secondary text-truncate " style="max-width: 75%">
        <span v-if="selectedFile">{{ $t('filesUploadForm.hint.selected') }} {{ selectedFile.name }}</span>
        <span v-else-if="existingUrl">{{ $t('filesUploadForm.hint.existing') }} {{ existingFileName }}</span>
        <span v-else>{{ $t('filesUploadForm.hint.required') }}</span>
      </div>
    </div>

    <v-file-input
      v-model="model"
      class="mt-2"
      outlined
      dense
      hide-details
      show-size
      :disabled="disabled"
      :accept="accept"
      :prepend-icon="mdiPaperclip"
      :aria-label="label"
      clearable
    />
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import {
  mdiPaperclip,
  mdiCheckCircle,
  mdiUpload,
  mdiAlertCircle,
} from '@mdi/js';

const props = defineProps({
  label: { type: String, required: true },
  required: { type: Boolean, default: true },
  existingUrl: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  accept: { type: String, default: '.pdf,application/pdf' },
});

const model = defineModel({ default: null });

const selectedFile = computed(() => {
  const v = model.value;
  return Array.isArray(v) ? v[0] : v;
});

const existingFileName = computed(() => {
  if (!props.existingUrl) return '';
  return props.existingUrl.split('/').pop() || '';
});

const state = computed(() => {
  if (selectedFile.value) return 'selected';
  if (props.existingUrl) return 'existing';
  return 'missing';
});

const chipText = computed(() => {
  if (state.value === 'selected') return 'Selected';
  if (state.value === 'existing') return 'Existing';
  return props.required ? 'Missing' : 'Optional';
});

const chipColor = computed(() => {
  if (state.value === 'selected') return 'primary';
  if (state.value === 'existing') return 'success';
  return props.required ? 'error' : 'grey';
});

const chipIcon = computed(() => {
  if (state.value === 'selected') return mdiUpload;
  if (state.value === 'existing') return mdiCheckCircle;
  return mdiAlertCircle;
});
</script>