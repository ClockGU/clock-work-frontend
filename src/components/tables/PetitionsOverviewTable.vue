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
          {{ item[header.key] }}
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
    // If the clicked item is already selected, deselect it. Otherwise, select the new one.
    if (selectedItem.value === item) {
      selectedItem.value = null; 
      emit('row-click', null);
    } else {
      selectedItem.value = item; 
      emit('row-click', item);
    }
  };
  </script>
  <style scoped>
    .selected-row {
      background-color: #e0e0e0; 
      font-weight: bold; 
    }
  </style>