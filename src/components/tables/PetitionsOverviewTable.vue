<template>
  <v-data-table 
    :headers="headers" 
    :items="items" 
    item-selectable 
    hover  
    >
    <template #item="{ item }">
      <tr @click="emit('row-click', item)">
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
  </script>