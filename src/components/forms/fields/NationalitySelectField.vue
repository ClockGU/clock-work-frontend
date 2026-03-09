<template>
  <div>
    <label v-if="label" :for="inputId">{{ label }}</label>

    <v-autocomplete
      :id="inputId"
      v-model="model"
      v-model:search="search"
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
  String(locale.value || 'en').toLowerCase().startsWith('de') ? 'de' : 'en'
);

const options = computed(() => getNationalityOptions(activeLanguage.value));

const selectedOption = computed(() => {
  const normalizedCode = normalizeNationality(model.value);
  return options.value.find((entry) => entry.code === normalizedCode) || null;
});

watch(
  () => model.value,
  (value) => {
    const normalizedCode = normalizeNationality(value);

    if (value !== normalizedCode) {
      model.value = normalizedCode;
      return;
    }

    if (!normalizedCode) {
      search.value = '';
      return;
    }

    const label = getNationalityLabel(normalizedCode, activeLanguage.value);
    if (search.value !== label) {
      search.value = label;
    }
  },
  { immediate: true }
);

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

  search.value = getNationalityLabel(model.value, activeLanguage.value);
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