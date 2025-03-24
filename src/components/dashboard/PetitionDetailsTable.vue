<template>
      <!-- Header with Close Button -->
      <div class="d-flex justify-space-between align-center mb-3 mr-1">
        <h2 class="text-high-emphasis font-weight-bold">
          Petition Details
        </h2>
        <div>
          <v-btn
          v-if="role === 'supervisor'"
          color="primary"
          @click="$emit('edit')"
          class="mr-3"
        >
          <v-icon>{{ icons.mdiPencil }}</v-icon>
          </v-btn>
          <v-btn
            color="error"
            @click="$emit('close')"
          >
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </div>
      </div>
  
      <!-- Table -->
      <v-table class="styled-table" density="comfortable" hover>
        <thead>
          <tr>
            <th class="key-column">Petition Field</th>
            <th class="value-column">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, key) in petition" :key="key">
            <td class="key-cell">{{ formatKey(key) }}</td>
            <td class="value-cell">{{ formatValue(value) }}</td>
          </tr>
        </tbody>
      </v-table>
      <div class="d-flex justify-end mt-3">
        <v-btn
          v-if="role === 'supervisor'"
          color="primary"
          variant="text"
          @click="$emit('edit')"
          >
          Edit Petition
        </v-btn>
        <v-btn
          color="error"
          variant="text"
          @click="$emit('close')"
          >
          Close Petition
        </v-btn>
      </div>
  </template>
  
  <script setup>
  import { mdiClose, mdiPencil } from '@mdi/js';
  
  const props = defineProps({
    petition: {
      type: Object,
      required: true,
    },
    role: {
      type: String,
      default: 'student',
    }
  });
  
  const emit = defineEmits(['close', 'edit']);
  const icons = { mdiClose, mdiPencil };
  
  const formatKey = (key) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return new Date(value).toLocaleDateString();
    }
    return value;
  };
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
  
  .key-column {
    width: 30%;
    font-weight: 500;
  }
  
  .value-column {
    width: 70%;
  }
  
  .key-cell {
    background-color: #fafafa;
    font-weight: 500;
  }
  
  .value-cell {
    background-color: #ffffff;
  }
  </style>
