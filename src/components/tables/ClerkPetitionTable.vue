<template>
  <v-card flat class="my-4">
    <v-card-title class="d-flex align-center ga-6 py-0">
      <v-select
        v-model="searchField"
        :items="searchableFields"
        :label="$t('searchBy')"
        item-title="title"
        item-value="key"
        style="max-width: 200px"
      ></v-select>
      <v-text-field
        v-model="searchTerm"
        :placeholder="$t('search')"
        :prepend-inner-icon="icons.mdiMagnify"
        :style="{ maxWidth: '400px' }"
        clearable
        single-line
      ></v-text-field>
      <v-checkbox
        v-model="showCompleted"
        :label="$t('clerkPetitionTable.showCompletedPetitions')"
        hide-details
        class="mr-4 flex-shrink-0"
      ></v-checkbox>
    </v-card-title>
    <v-card-text>
      <PetitionsOverviewTable
        :headers="headers"
        :items="filteredItems"
        :selected-item="selectedPetition"
        v-bind="$attrs"
        @row-click="$emit('row-click', $event)"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { mdiMagnify } from '@mdi/js';
import PetitionsOverviewTable from '@/components/tables/PetitionsOverviewTable.vue';

const icons = { mdiMagnify };
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  selectedPetition: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['row-click']);
const { t } = useI18n();

const searchTerm = ref('');
const searchField = ref('supervisor_mail');
const showCompleted = ref(false);

const headers = computed(() => [
  { title: t('petition.supervisorMail'), key: 'supervisor_mail' },
  { title: t('petition.studentMail'), key: 'student_mail' },
  { title: t('petition.status'), key: 'status' },
  { title: t('petition.startDate'), key: 'start_date' },
  { title: t('petition.endDate'), key: 'end_date' },
  { title: t('petition.minutes'), key: 'minutes' },
  { title: t('petition.orgUnit'), key: 'org_unit' },
  { title: t('petition.eosNumber'), key: 'eos_number' },
  { title: t('petition.baDegree'), key: 'ba_degree' },
  { title: t('petition.exceptions'), key: 'exceptions', align: 'center' },
]);
const searchableFields = computed(() => {
  return headers.value.filter((header) =>
    ['supervisor_mail', 'student_mail', 'org_unit', 'status'].includes(
      header.key
    )
  );
});

const filteredItems = computed(() => {
  let itemsToFilter = props.items;
  // 1. Filter out completed petitions if the checkbox is not checked.
  if (!showCompleted.value) {
    itemsToFilter = itemsToFilter.filter(
      (item) => item.status?.toLowerCase() !== 'completed'
    );
  }
  // 2. If there's no search term, return the list .
  if (!searchTerm.value) {
    return itemsToFilter;
  }
  // 3. Apply the text search on the already filtered list.
  return itemsToFilter.filter((item) => {
    const fieldValue = String(item[searchField.value] ?? '').toLowerCase();
    return fieldValue.includes(searchTerm.value.toLowerCase());
  });
});
</script>