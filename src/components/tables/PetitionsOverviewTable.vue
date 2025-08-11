<template>
  <v-data-table 
    :headers="headers" 
    :items="items" 
    item-selectable 
    hover  
    style="cursor: pointer;"
    :no-data-text="$t('petitionsOverviewTable.noPetitions')"
    >
    <template #item="{ item }">
      <tr @click="handleRowClick(item)"
        :class="{ 'selected-row': selectedItem && selectedItem.id === item.id }">
        <td 
        v-for="header in headers" 
        :key="header.key"
        >
          <template v-if="header.key === 'exceptions'">
            <!--shows X if there is no exception or ✓ if there is an exception-->
              <StatusIndicator
                class="d-flex align-center justify-center"
                :status="item.time_exce_course || item.duration_exce_course"
                :tooltip="item.time_exce_course || item.duration_exce_course ? $t('petitionsOverviewTable.exceptions.true') : $t('petitionsOverviewTable.exceptions.false')"
                tooltip-location="end"
                variant="text"
              />
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
  import StatusIndicator from '@/components/ui/StatusIndicator.vue';
  const props = defineProps({
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true
    },
    selectedItem: {
      type: Object,
      default: null
    }
  });
  const emit = defineEmits(['row-click']);

  // This function handles row click events by toggling the selection of the clicked item
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