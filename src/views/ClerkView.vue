<template>
    <v-row>
        <v-col cols="12">
            <PetitionDataDisplay class="mt-4"
            :petition="selectedPetition"
            @close="selectPetition(null)"
            />
        </v-col>
        <v-col cols="12">
            <v-card>
                <v-card-title>{{ $t('overviewCard.overviewTitle') }}</v-card-title>
                <v-card-text>
                    <!-- Custom Data Table -->
                    <PetitionsTable 
                        :headers="headers" 
                        :items="petitions" 
                        @row-click="selectPetition"
                    />
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>
<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import PetitionDataDisplay from '@/components/clerk/PetitionDataDisplay.vue';
import PetitionsTable from "@/components/tables/PetitionsTable.vue";

const emit = defineEmits(["select-petition"]);
const store = useStore();
const { t } = useI18n();

const headers = computed(() => [
    { title: t('petition.petitioneer'), key: "petitioneer" },
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
const selectedPetition =ref(null)
const petitions = computed(() => store.getters["petitions/petitions"]);
const selectPetition = (petition) => {
    selectedPetition.value=petition
};
</script>