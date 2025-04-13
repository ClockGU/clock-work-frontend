<template>
  <div class="d-flex justify-end align-center mb-3 mr-1">
    <v-btn
    v-if="role === 'supervisor'"
    color="primary"
    class="mr-3"
    :aria-label="$t('petitionDetailsTable.ariaLabels.editPetition')"
    @click="$emit('edit')"

  >
    <v-icon>{{ icons.mdiPencil }}</v-icon>
    </v-btn>
    <v-btn
      color="error"
      :aria-label="$t('petitionDetailsTable.ariaLabels.closePetition')"
      @click="$emit('close')"
    >
      <v-icon>{{ icons.mdiClose }}</v-icon>
    </v-btn>
  </div>

  <!-- Table -->
  <v-table
    class="styled-table"
    density="comfortable"
    hover
    role="table"
    :aria-label="$t('petitionDetailsTable.ariaLabels.petitionDetailsTable')"
  >
    <thead>
      <tr role="row">
        <th
          class="key-column"
          scope="col"
          role="columnheader"
          :aria-label="$t('petitionDetailsTable.headers.petitionField')"
        >
          {{ $t('petitionDetailsTable.headers.petitionField') }}
        </th>
        <th
          class="value-column"
          scope="col"
          role="columnheader"
          :aria-label="$t('petitionDetailsTable.headers.value')"
        >
          {{ $t('petitionDetailsTable.headers.value') }}
        </th>
      </tr>
    </thead>
    <tbody role="rowgroup">
      <tr
        v-for="(value, key) in formatPetition(petition)"
        :key="key"
        role="row"
      >
        <td class="key-cell" role="cell">
          {{ $t(`petition.${formatKey(key)}`) }}
        </td>
        <td class="value-cell" role="cell">
          {{ formatValue(value) }}
        </td>
      </tr>
    </tbody>
  </v-table>
  <div class="d-flex justify-end mt-3">
    <v-btn
      v-if="role === 'supervisor'"
      color="primary"
      variant="text"
      :aria-label="$t('petitionDetailsTable.ariaLabels.editPetition')"
      @click="$emit('edit')"
      >
      {{ $t('petitionDetailsTable.buttons.editPetition') }}
    </v-btn>
    <v-btn
      color="error"
      variant="text"
      :aria-label="$t('petitionDetailsTable.ariaLabels.closePetition')"
      @click="$emit('close')"
      >
      {{ $t('petitionDetailsTable.buttons.closePetition') }}
    </v-btn>
  </div>
</template>
  
<script setup>
import { onMounted } from 'vue';
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
    .map((word, index) => (index ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join("");
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return new Date(value).toLocaleDateString();
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return value;
};

function formatPetition(petition) {
  const formattedPetition = {}; 
  for (const [key, value] of Object.entries(petition)) {
    const skippedKeys = ['time_exce_course', 'time_exce_student','duration_exce_course',"duration_exce_student","user_account" ];
    // Always skip these
    if (skippedKeys.includes(key)) {
      continue;
    }
    // Skip time exception fields only if time_exec_course is false
    if ((key === 'time_exce_name' || key === 'time_exce_start' || key === 'time_exce_end') && !petition.time_exec_course) {
      continue;
    }
    // Skip duration exception fields only if duration_exec_course is false
    if ((key === 'duration_exce_name' || key === 'duration_exce_start' || key === 'duration_exce_end') && !petition.duration_exec_course) {
      continue;
    }
    // Add all other fields
    formattedPetition[key] = value;
  }
  return formattedPetition;
}
onMounted(()=>{
  console.log("petition is", props.petition);
  
})
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

