<template>
  <div>
    <label v-if="label" :for="inputId">{{ label }}</label>

    <v-autocomplete
      :id="inputId"
      v-model:search="search"
      :model-value="selectedCode"
      outlined
      dense
      clearable
      :prepend-icon="mdiFlag"
      :aria-label="label"
      :items="options"
      item-title="label"
      item-value="code"
      :rules="required ? [selectionRequiredRule] : []"
      :menu-props="{ maxHeight: 320 }"
      :no-filter="false"
      hide-details="auto"
      auto-select-first="exact"
      @update:model-value="setModelValue"
      @click:clear="clearSelection"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { mdiFlag } from '@mdi/js';
import {
  getNationalityLabel,
  getNationalityOptions,
  normalizeNationality,
} from '@/utils/nationality';

const model = defineModel({
  type: String,
  default: '',
});

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  inputId: {
    type: String,
    default: 'nationality',
  },
});

const emit = defineEmits(['change']);

const { locale, t } = useI18n();

const search = ref('');

const activeLanguage = computed(() =>
  String(locale.value || 'en')
    .toLowerCase()
    .startsWith('de')
    ? 'de'
    : 'en'
);

const options = computed(() => getNationalityOptions(activeLanguage.value));

const selectedCode = computed(() => normalizeNationality(model.value));

const selectedOption = computed(() => {
  return (
    options.value.find((entry) => entry.code === selectedCode.value) || null
  );
});

function setModelValue(code) {
  const normalizedCode = normalizeNationality(code);
  if (!normalizedCode) {
    model.value = '';
    search.value = '';
    return;
  }
  // Set nationality to the human-readable label in German as data
  // processing will continue in German outside of ClockWork
  model.value = getNationalityLabel(normalizedCode, 'de');
  // For readability in selected language
  search.value = getNationalityLabel(normalizedCode, activeLanguage.value);
}

watch(activeLanguage, () => {
  if (!model.value) return;
  search.value = getNationalityLabel(model.value, activeLanguage.value);
});

watch(selectedOption, (option) => {
  emit('change', option);
});

const handleBlur = () => {
  if (!model.value) {
    search.value = '';
    return;
  }
  search.value = getNationalityLabel(model.value, language);
};

const clearSelection = () => {
  model.value = '';
  search.value = '';
  emit('change', null);
};

const selectionRequiredRule = () =>
  !!normalizeNationality(model.value) || t('validationRule.required');
</script>

<style scoped>
label {
  font-weight: 500;
  font-size: 1rem;
  margin-left: 2.5rem;
}
</style>
