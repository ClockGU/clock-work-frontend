<template>
  <div>
    <div class="mb-4">
      <slot name="top"></slot>
    </div>

    <v-table
      class="styled-table"
      density="comfortable"
      hover
      role="table"
      :aria-label="tableTitle"
      tabindex="0"
    >
      <thead role="rowgroup">
        <tr role="row" tabindex="0" class="w-100">
          <th class="font-weight-bold w-33" scope="col" role="columnheader">
            {{ headerKey }}
          </th>
          <th class="font-weight-bold w-66" scope="col" role="columnheader">
            {{ headerValue }}
          </th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        <tr
          v-for="(row, index) in rows"
          :key="index"
          role="row"
          tabindex="0"
          :style="{ display: row.hide ? 'none' : undefined }"
        >
          <td class="key-cell" role="cell">
            {{ row.key }}
          </td>
          <td class="value-cell" role="cell">
            <slot name="value-cell" :row="row">
              {{ row.value }}
            </slot>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div class="mt-4">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  tableTitle: {
    type: String,
    default: 'Data Display Table',
  },
  headerKey: {
    type: String,
    required: false,
    default: '',
  },
  headerValue: {
    type: String,
    required: false,
    default: '',
  },
});
const { t } = useI18n();
const headerKey = computed(
  () => props.headerKey || t('dataDisplayTable.general.headers.field')
);
const headerValue = computed(
  () => props.headerValue || t('dataDisplayTable.general.headers.value')
);
</script>

<style scoped>
.styled-table {
  border-collapse: collapse;
  border: 1px solid #d6d3d3;
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
