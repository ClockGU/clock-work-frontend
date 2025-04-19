<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <PetitionDataDisplay 
                    :petition="selectedPetition"
                    @close="selectPetition(null)"
                    @decline="handleDecline"
                    @accept="handleAccept"
                />
            </v-col>
            <v-col cols="12">
                <v-card>
                    <v-card-title>{{ $t('overviewCard.overviewTitle') }}</v-card-title>
                    <v-card-text>
                        <PetitionsTable 
                            :headers="headers" 
                            :items="petitions" 
                            @row-click="selectPetition"
                        />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import ApiService from "@/services/api";
import PetitionDataDisplay from '@/components/clerk/PetitionDataDisplay.vue';
import PetitionsTable from "@/components/tables/PetitionsTable.vue";

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

const selectedPetition = ref(null);
const petitions = ref([]);

const token = computed(() => store.getters["auth/accessToken"]);
const fetchPetitions = async () => {
    try {
        const response = await ApiService.get("clerk/petitions/pending");
        petitions.value = response.data;
    } catch (error) {
        console.error("Error fetching petitions:", error);
        store.dispatch("snackbar/setErrorSnacks", {
            message: "Error fetching petitions"
        });
    }
};

const selectPetition = (petition) => {
    selectedPetition.value = petition;
};

const handleDecline = async (petitionId) => {
    try {
        await ApiService.patch(`/clerk/petitions/${petitionId}`, { status: "rejected" });
        selectedPetition.value = null;
        store.dispatch("snackbar/setSnack", {
            message: "Petition rejected successfully"
        })
        fetchPetitions();
    } catch (error) {
        console.error("Error declining petition:", error);
        store.dispatch("snackbar/setErrorSnacks", {
            message: "Error declining petition"
        });
    }
};

const handleAccept = async (petitionId) => {
    try {
        await ApiService.patch(`/clerk/petitions/${petitionId}`, { status: "approved" });
        selectedPetition.value = null;
        store.dispatch("snackbar/setSnack", {
            message: "Petition approved successfully"
        });
        fetchPetitions();
    } catch (error) {
        console.error("Error accepting petition:", error);
        store.dispatch("snackbar/setErrorSnacks", {
            message: "Error accepting petition"
        });
    }
};

onMounted(() => {
    if (token.value) {
        ApiService.setAccessToken(token.value);
    }
    fetchPetitions();
});
</script>