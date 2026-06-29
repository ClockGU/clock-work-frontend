<template>
  <v-card
    class="py-4 pl-2"
    role="region"
    aria-labelledby="overview-card-title"
    tabindex="0"
  >
    <v-card-title>
      <h2 id="overview-card-title" class="text-h5 font-weight-bold">
        {{ $t('petitionsOverviewTable.title') }}
      </h2>
    </v-card-title>
    <v-card-text>
      <!-- Loading Spinner -->
      <ClockWorkLoader v-if="isLoading" height="32" width="33" />
      <PetitionsOverviewTable
        v-else
        :headers="headers"
        :items="petitions"
        :selected-item="selectedPetition"
        @row-click="selectPetition"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { isStudent, isSupervisor } from '@/utils/roleUtils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PetitionsOverviewTable from '@/components/tables/base/PetitionsOverviewTable.vue';
import ClockWorkLoader from '@/icons/ClockWorkLoader.vue';

const props = defineProps({
  petitions: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  selectedPetition: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(['select-petition']);
const { t } = useI18n();

const headers = computed(() => {
  const baseHeaders = [
    { title: t('petition.status'), key: 'status' },
    { title: t('petition.startDate'), key: 'start_date' },
    { title: t('petition.endDate'), key: 'end_date' },
    { title: t('petition.minutes'), key: 'minutes' },
    {
      title: t('petition.exceptions'),
      key: 'exceptions',
      align: 'center',
      sortable: false,
    },
  ];

  if (isStudent.value) {
    // Student specific headers
    return [
      { title: t('petition.supervisorMail'), key: 'supervisor_mail' },
      ...baseHeaders,
    ];
  } else if (isSupervisor.value) {
    // Supervisor specific headers
    return [
      { title: t('petition.studentMail'), key: 'student_mail' },
      { title: t('petition.eosNumber'), key: 'eos_number' },
      ...baseHeaders,
    ];
  }
  return baseHeaders;
});
const selectPetition = (petition) => {
  emit('select-petition', petition);
};
</script>
