<template>
  <BaseDataDisplay
    :rows="tableRows"
    :table-title="$t('dataDisplayTable.employeeData.title')"
    :header-key="$t('dataDisplayTable.employeeData.headers.field')"
    :header-value="$t('dataDisplayTable.employeeData.headers.value')"
  >
    <template #value-cell="{ row }">
      {{ formatValue(row.value, row.key) }}
    </template>
  </BaseDataDisplay>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { format, parseISO } from 'date-fns';
// Import the new base component
import BaseDataDisplay from '@/components/tables/base/DataDisplayTable.vue';

const props = defineProps({
  employeeData: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();

/**
 * Formats a given value for display in the table.
 * Adapted from PetitionTable for general use.
 */
const formatValue = (value, key) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  // Check if this is a date field (e.g., Date of Birth)
  if (
    typeof value === 'string' &&
    (key.includes(t('employeeData.dateOfBirth')) ||
      key.includes(t('employeeData.prevEmpDuration')))
  ) {
    try {
      // Date-fns handles ISO strings naturally
      return format(parseISO(value), 'dd.MM.yyyy');
    } catch {
      return value;
    }
  }
  if (typeof value === 'boolean') {
    return value ? t('yes') : t('no');
  }
  return value;
};

/**
 * Formats a snake_case key into a camelCase string for translation lookup.
 * Reused from PetitionTable.
 */
const formatKey = (key) => {
  return key
    .split('_')
    .map((word, index) =>
      index ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join('');
};

/**
 * Transforms the employeeData data object into a flat array of rows.
 */
const tableRows = computed(() => {
  const d = props.employeeData;
  if (!d) return [];

  const rows = [];
  // Define the desired display order and keys from the employeeData object
  const fieldOrder = [
    'first_name',
    'last_name',
    'form_of_address',
    'gender',
    'date_of_birth',
    'city_of_birth',
    'user_email',
    'telephone_number',
    'address',
    'postal_code',
    'nationality',
    'married',
    'health_insurance',
    'previously_employeed',
    'prev_emp_duration',
    'iban',
    'bic',
    'bank_name',
  ];

  fieldOrder.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(d, key)) {
      // Use the key's translated name for the table display
      rows.push({
        key: t(`employeeData.${formatKey(key)}`),
        value: d[key],
      });
    }
  });

  return rows;
});
</script>
