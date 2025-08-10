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
            <v-btn
              v-if="item.time_exce_course || item.duration_exce_course"
              color="green"
            >
              mdi-check-circle
            </v-btn>
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
  </style>