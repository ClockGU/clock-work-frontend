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
        :class="{ 'selected-row': selectedItem=== item}">
        <td 
        v-for="header in headers" 
        :key="header.key"
        >
          <template v-if="header.key === 'exceptions'">
            <!---->
            <div class="d-flex align-center justify-center">
              <StatusIndicator
                :status="item.time_exce_course || item.duration_exce_course"
                :tooltip="item.time_exce_course || item.duration_exce_course ? $t('petitionsOverviewTable.exceptions.true') : $t('petitionsOverviewTable.exceptions.false')"
                tooltip-location="end"
                variant="text"
              />
            </div>
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
  import { ref } from 'vue';
  import StatusIndicator from '@/components/ui/StatusIndicator.vue';
  const props = defineProps({
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true
    }
  });
  const emit = defineEmits(['row-click']);
  const selectedItem = ref(null);

  const handleRowClick = (item) => {
    // If the clicked item is already selected, deselect it. Otherwise, select the new 
    if (selectedItem.value === item) {
      selectedItem.value = null; 
    } else {
      selectedItem.value = item; 
    }
    emit('row-click', selectedItem.value);
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