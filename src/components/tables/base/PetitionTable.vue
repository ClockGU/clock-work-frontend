<template>
  <BaseDataDisplayTable
    :rows="tableRows"
    :table-title="$t('dataDisplayTable.petition.title')"
    :header-key="$t('dataDisplayTable.petition.headers.field')"
    :header-value="$t('dataDisplayTable.petition.headers.value')"
  >
    <template #top>
      <slot name="top"></slot>
    </template>
    <template #bottom>
      <slot name="bottom"></slot>
    </template>

    <template #value-cell="{ row }">
      <PetitionStatusIcon 
      v-if="row.key === $t('petition.status')"
      :status="row.value"
      />
      <span v-else>{{ formatValue(row.value, row.key) }}</span>
    </template>
  </BaseDataDisplayTable>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { format, parseISO } from 'date-fns';
import PetitionStatusIcon from '@/components/ui/PetitionStatusIcon.vue';
import BaseDataDisplayTable from '@/components/tables/base/DataDisplayTable.vue';

const props = defineProps({
  petition: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();
const store = useStore();

// Formats various value types for display in the table.
const formatValue = (value, key) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  if (
    typeof value === 'string' &&
    (key.includes('Date') || key.includes('Start') || key.includes('End'))
  ) {
    try {
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

// Converts snake_case keys to TitleCase for display.
const formatKey = (key) => {
  return key
    .split('_')
    .map((word, index) =>
      index ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join('');
};

const userRole = computed(() => store.getters['auth/userRole']);

/**
 * A computed property that transforms the petition object into
 * a flat array of rows suitable for rendering in the table.
 * This is the core data logic specific to petitions.
 */
const tableRows = computed(() => {
  const p = props.petition;
  if (!p) return [];

  const rows = [];
  const fieldOrder = [
    'supervisor_mail',
    'student_mail',
    'start_date',
    'end_date',
    'minutes',
    'org_unit',
    'eos_number',
    'ba_degree',
    'status',
    'time_exce_name',
    'time_exce_start',
    'time_exce_end',
    'duration_exce_name',
    'duration_exce_start',
    'duration_exce_end',
  ];

  // Process regular fields based on the defined order
  fieldOrder.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(p, key)) {
      // Logic for time_exce and duration_exce
      if (key.startsWith('time_exce_') && !p.time_exce_course) return;
      if (key.startsWith('duration_exce_') && !p.duration_exce_course) return;

      rows.push({
        key: t(`petition.${formatKey(key)}`),
        value: p[key],
      });
    }
  });

  // don't show budget positions related data for student 
  if (userRole.value !== 0) {
    // Process the nested budget_positions array
    if (p.budget_positions && Array.isArray(p.budget_positions)) {
      p.budget_positions.forEach((position, index) => {
        rows.push({
          key: `${t('petition.budgetPosition', 'Budget Position')} ${index + 1}`,
          value: position.budget_position,
        });
        rows.push({
          key: `${t('petition.budgetApprover', 'Budget Approver')} ${index + 1}`,
          value: position.budget_approver,
        });
        rows.push({
          key: `${t('petition.budgetPositionApproved', 'Budget Position Approved')} ${index + 1}`,
          value: position.budget_position_approved,
        });
      });
    }
  }
  return rows;
});
</script>
