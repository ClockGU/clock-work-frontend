<template>
    <v-card flat class="my-4">
        <v-card-title class="d-flex align-center justify-center ga-6 py-0">
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
                clearable
                single-line
            ></v-text-field>
        </v-card-title>
        <v-card-text>
            <PetitionsOverviewTable
                :headers="headers"
                :items="filteredItems"
                v-bind="$attrs"
                @row-click="$emit('row-click', $event)"
            />
        </v-card-text> 
    </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from "vue-i18n";
import { mdiMagnify } from '@mdi/js';
import PetitionsOverviewTable from '@/components/tables/PetitionsOverviewTable.vue';

const icons = {mdiMagnify};
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['row-click']);
const { t } = useI18n();

const searchTerm = ref('');
const searchField = ref('supervisor_mail');

const headers = computed(() => [
    { title: t('petition.supervisorMail'), key: "supervisor_mail" },
    { title: t('petition.studentMail'), key: "student_mail" },
    { title: t('petition.startDate'), key: "start_date" },
    { title: t('petition.endDate'), key: "end_date" },
    { title: t('petition.minutes'), key: "minutes" },
    { title: t('petition.orgUnit'), key: "org_unit" },
    { title: t('petition.eosNumber'), key: "eos_number" },
    { title: t('petition.baDegree'), key: "ba_degree" },
    { title: t('petition.budgetPosition'), key: "budget_position" },
    { title: t('petition.budgetApprover'), key: "budget_approver" }
]);
const searchableFields = computed(() => {
  return headers.value.filter((header) =>
    ['supervisor_mail', 'student_mail', 'org_unit'].includes(header.key)
  );
});

const filteredItems = computed(() => {
    if (!searchTerm.value) return props.items;
    return props.items.filter((item) => {
    // Get the value of the selected field from the current item and check if the field value includes the search term 
        const fieldValue = String(item[searchField.value]).toLowerCase();
        return fieldValue.includes(searchTerm.value.toLowerCase());
    });
});
</script>
