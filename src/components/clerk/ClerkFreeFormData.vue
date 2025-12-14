<template>
  <v-card class="px-4 h-100">
    <v-card-title class="text-h6 px-4">
      {{ $t('freeFormData.title') }}
    </v-card-title>
    <v-card-text>
      <!-- Placeholder when no petition is selected -->
      <v-alert
        v-if="!petition"
        type="info"
        variant="tonal"
        density="comfortable"
      >
        {{ $t('editCard.noPetitionSelected') }}
      </v-alert>
      <PetitionTableWithActions
        v-if="petition"
        :petition="petition"
        @close="emit('close')"
        @refresh="handleRefresh"
      />
      <EmployeeDataTable
        v-if="petition && employeeData"
        :employee-data="employeeData"
      >
      </EmployeeDataTable>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import ContentApiService from '@/services/contentApiService';
import EmployeeDataTable from '../tables/EmployeeDataTable.vue';
import PetitionTableWithActions from '../tables/PetitionTableWithActions.vue';
const props = defineProps({
  petition: {
    type: [Object, null],
    required: true,
  },
});
const emit = defineEmits(['close', 'refresh']);

const employeeData = ref({});

const fetchEmployeeData = async (petitionId) => {
  try {
    const response = await ContentApiService.get(
      `/employees/petition/${petitionId}`
    );
    employeeData.value = response.data;
  } catch (error) {
    employeeData.value = {};
    console.error('Error fetching employee data:', error);
  }
};
const handleRefresh = (payload) => {
  emit('refresh', payload);
};
watch(
  () => props.petition,
  (newPetition) => {
    if (newPetition) {
      fetchEmployeeData(newPetition.id);
    } else {
      employeeData.value = {};
    }
  },
  { immediate: true }
);
</script>
