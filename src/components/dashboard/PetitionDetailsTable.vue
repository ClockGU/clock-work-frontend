<template>
    <div class="petition-details-table">
      <!-- Header with Close Button -->
      <div class="petition-details-table-header">
        <h3 class="petition-details-table-header-title">Petition Details</h3>
        <v-btn
          color="error"
          text
          @click="$emit('close')"
          class="petition-details-table-header-close"
        >
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>
      </div>
  
      <!-- Table -->
      <v-table class="styled-table">
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
    </div>
  </template>
  
  <script setup>
  import { mdiClose } from '@mdi/js';
  
  const props = defineProps({
    petition: {
      type: Object,
      required: true,
    },
  });
  
  const emit = defineEmits(['close']);
  const icons = { mdiClose };
  
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
  .petition-details-table {
    width: 100%;
    background: #ffffff;
  }
  
  .petition-details-table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
  }
  
  .petition-details-table-header-title {
    font-size: 1.45rem;
    font-weight: bold;
    margin: 0;
    color: #333;
  }
  
  .petition-details-table-header-close {
    color: #ff5252; /* Error color for the close button */
  }
  
  .styled-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #d6d3d3; /* Darker border for the table */
  }
  
  .styled-table th,
  .styled-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #fafafa; /* Darker border for row separators */
  }
  
  .styled-table th {
    background-color: #fafafa;
    font-weight: 500;
    color: #333;
    text-align: left;
    border-right: 1px solid #e0e0e0; /* Darker border for column separator */
  }
  
  .styled-table td {
    color: #555;
    border-right: 1px solid #e0e0e0; /* Lighter border for column separator in rows */
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
  
  /* Hover effect for table rows */
  .styled-table tbody tr:hover {
    background-color: #f9f9f9;
  }
  </style>