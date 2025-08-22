<template>
  <div>
    <!-- Slot for content above the table -->
    <div class="mb-4">
      <slot name="top"></slot>
    </div>

    <!-- Main Table for displaying petition details. Added ARIA roles for better screen reader compatibility. -->
    <v-table
      class="styled-table"
      density="comfortable"
      hover
      role="table"
      :aria-label="$t('petitionTable.title')"
      tabindex="0"
    >
      <thead role="rowgroup">
        <tr role="row" tabindex="0">
          <th 
            class="font-weight-bold w-33" 
            scope="col"
            role="columnheader" 
          >
              {{ $t('petitionTable.headers.petitionField') }}
          </th>
          <th 
            class="font-weight-bold w-66" 
            scope="col" 
            role="columnheader" 
          >
              {{ $t('petitionTable.headers.value') }}
          </th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        <!-- Iterates over the computed tableRows to display data -->
        <tr 
          v-for="(row, index) in tableRows" 
          :key="index" 
          role="row" 
          tabindex="0">
          <td 
            class="key-cell" 
            role="cell"
          >
            {{ row.key }}
          </td>
          <td class="value-cell" role="cell">
            {{ formatValue(row.value) }}
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Slot for content below the table -->
    <div class="mt-4">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  petition: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n(); 

//Formats a given value for display in the table.
const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return new Date(value).toLocaleDateString();
  }
  if (typeof value === 'boolean') {
    return value ? t('yes') : t('no');
  }
  return value;
};

//Formats a snake_case key into a camelCase string for translation lookup.
const formatKey = (key) => {
  return key
    .split("_")
    .map((word, index) => (index ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join("");
};

/*
 A computed property that transforms the petition object into 
 a flat array of rows suitable for rendering in the table. 
It also handles the nested`budget_positions` array.
 */
const tableRows = computed(() => {
  const p = props.petition;
  if (!p) return [];

  const rows = [];
  const fieldOrder = [
    'supervisor_mail', 'student_mail', 'start_date', 'end_date', 'minutes',
    'org_unit', 'eos_number', 'ba_degree', 'time_exce_name', 'time_exce_start',
    'time_exce_end', 'duration_exce_name', 'duration_exce_start', 'duration_exce_end',
  ];

  // Process regular fields based on the defined order
  fieldOrder.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(p, key)) {
      if (key.startsWith('time_exce_') && !p.time_exce_course) return;
      if (key.startsWith('duration_exce_') && !p.duration_exce_course) return;

      rows.push({
        key: t(`petition.${formatKey(key)}`),
        value: p[key],
      });
    }
  });

  // Process the budget_positions array and unnest it
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
        key: `${t('petition.budgetPositionStatus', 'Budget Position Status')} ${index + 1}`,
        value: t(`budgetPositionStatus.${position.budget_position_status}`),
      });
    });
  }

  return rows;
});
</script>

<style scoped>
  .styled-table {
    border-collapse: collapse;
    border: 1px solid #d6d3d3;
    cursor: pointer;
  }
  .styled-table th,
  .styled-table td {
    border-bottom: 1px solid #fafafa;
  }
  .styled-table th {
    background-color: #fafafa;
    font-weight: 500;
    color: #333;
    text-align: left;
    border-right: 1px solid #e0e0e0;
  }
  .styled-table td {
    color: #555;
    border-right: 1px solid #e0e0e0;
  }
  .key-cell {
    background-color: #fafafa;
    font-weight: 500;
  }
  .value-cell {
    background-color: #ffffff;
  }
</style>
