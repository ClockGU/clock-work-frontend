<template>
  <v-card flat class="my-4">
    <v-card-title class="d-flex align-center ga-6 py-0"> </v-card-title>
    <v-card-text>
      <v-row justify="center" align="center">
        <v-col cols="3">
          <v-select
            v-model="searchField"
            :items="searchableFields"
            :label="$t('searchBy')"
            item-title="title"
            item-value="key"
            style="max-width: 200px"
          ></v-select>
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-model="searchTerm"
            :placeholder="$t('search')"
            :prepend-inner-icon="icons.mdiMagnify"
            :style="{ maxWidth: '400px' }"
            clearable
            single-line
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-checkbox
            v-model="showCompleted"
            :label="$t('clerkPetitionTable.showCompletedPetitions')"
            hide-details
            class="mr-4 flex-shrink-0"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex align-center">
          <v-radio-group v-model="filterName" label="Personenfilter" inline hide-details>
            <v-radio
              :value="''"
              class="mr-4"
              label="Keine"
              hide-details
            ></v-radio>
            <v-radio
              value="hamburgerFilter"
              class="mr-4"
              label="&#127828;-Filter"
              hide-details
            ></v-radio>
            <v-radio
              value="schultheissFilter"
              class="mr-4"
              label="&#127979;-theiss-Filter"
              hide-details
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
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
import PetitionsOverviewTable from '@/components/tables/base/PetitionsOverviewTable.vue';
import { filterForClerkResponsibility } from '@/utils/roleUtils';
import { filter } from 'core-js/internals/array-iteration';

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
const filterName = ref('');

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
  let itemsToFilter = Array.isArray(props.items) ? props.items : []; // 1. Filter out completed petitions if the checkbox is not checked.
  if (!showCompleted.value) {
    itemsToFilter = itemsToFilter.filter(
      (item) => item.status?.toLowerCase() !== 'completed'
    );
  }
  // 2. If a clerk responsibility specific filter is selected.
  if (filterName.value) {
    itemsToFilter = filterForClerkResponsibility(itemsToFilter, filterName.value);
  }
  // 3. If there's no search term, return the list .
  if (!searchTerm.value) {
    return itemsToFilter;
  }
  // 4. Apply the text search on the already filtered list.
  return itemsToFilter.filter((item) => {
    const fieldValue = String(item[searchField.value] ?? '').toLowerCase();
    return fieldValue.includes(searchTerm.value.toLowerCase());
  });
});
</script>
