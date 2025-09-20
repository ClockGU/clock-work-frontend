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
      <v-progress-circular
        v-if="isLoading"
        class="d-flex justify-center my-5"
        indeterminate
        color="primary"
      ></v-progress-circular>
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import PetitionsOverviewTable from '@/components/tables/PetitionsOverviewTable.vue';

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
const store = useStore();
const userRole = computed(() => store.getters['auth/userRole']);

const headers = computed(() => {
  const baseHeaders = [
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

  if (userRole.value === 0) {
    // Student specific headers
    return [
      { title: t('petition.supervisorMail'), key: 'supervisor_mail' },
      ...baseHeaders,
    ];
  } else {
    // Supervisor specific headers
    return [
      { title: t('petition.studentMail'), key: 'student_mail' },
      { title: t('petition.eosNumber'), key: 'eos_number' },
      ...baseHeaders,
    ];
  }
});
const selectPetition = (petition) => {
  emit('select-petition', petition);
};
</script>
