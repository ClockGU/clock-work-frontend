<template>
  <v-data-table
    role="table"
    :headers="headers"
    :items="formattedItems"
    item-selectable
    hover
    :no-data-text="$t('petitionsOverviewTable.noPetitions')"
  >
    <template #item="{ item }">
      <tr
        role="row"
        tabindex="0"
        style="cursor: pointer"
        :class="{ 'selected-row': selectedItem && selectedItem.id === item.id }"
        :aria-label="getAriaLabel(item)"
        @click="handleRowClick(item)"
        @keydown.enter.prevent
        @keydown.space.prevent
      >
        <td v-for="header in headers" :key="header.key" role="cell">
          <template v-if="header.key === 'exceptions'">
            <StatusIndicator
              class="d-flex align-center justify-center"
              :status="item.time_exce_course || item.duration_exce_course"
              :tooltip="
                item.time_exce_course || item.duration_exce_course
                  ? $t('petitionsOverviewTable.exceptions.true')
                  : $t('petitionsOverviewTable.exceptions.false')
              "
              tooltip-location="end"
              variant="text"
            />
          </template>
          <template v-else-if="header.key === 'status'">
            <PetitionStatusIcon :status="item.status" />
          </template>
          <template v-else>
            {{ item[header.key] }}
          </template>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup>
import { computed } from 'vue';
import { format, parseISO } from 'date-fns';
import PetitionStatusIcon from '@/components/ui/PetitionStatusIcon.vue';
import StatusIndicator from '@/components/ui/StatusIndicator.vue';

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  selectedItem: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['row-click']);

const formattedItems = computed(() => {
  return props.items.map((item) => {
    const formattedItem = { ...item };
    // Format dates in items to dd.mm.yyyy
    const dateFields = [
      'start_date',
      'end_date',
      'time_exce_start',
      'time_exce_end',
      'duration_exce_start',
      'duration_exce_end',
    ];

    dateFields.forEach((field) => {
      if (formattedItem[field] && typeof formattedItem[field] === 'string') {
        formattedItem[field] = format(
          parseISO(formattedItem[field]),
          'dd.MM.yyyy'
        );
      }
    });
    formattedItem['student_mail'] =
      `${formattedItem['student_username']}@stud.uni-frankfurt.de`;
    return formattedItem;
  });
});

// This function generates a comprehensive label for the screen reader
const getAriaLabel = (item) => {
  let label = '';
  props.headers.forEach((header) => {
    const value = item[header.key];
    if (value) {
      label += `${header.title}: ${value}, `;
    }
  });
  return label.trim();
};

const handleRowClick = (item) => {
  const isSelected = props.selectedItem && props.selectedItem.id === item.id;
  emit('row-click', isSelected ? null : item);
};
</script>

<style scoped>
.selected-row {
  background-color: #e0e0e0;
  font-weight: bold;
}
:deep(.v-data-table__th) {
  padding-left: 8px !important;
  padding-right: 8px !important;
}
:deep(.v-data-table__td) {
  padding-left: 8px !important;
  padding-right: 8px !important;
}
</style>
