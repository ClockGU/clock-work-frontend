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
                    <v-card-title class="ml-4 mt-2">
                        {{ $t('overview') }}
                    </v-card-title>
                    <v-card-text>
                        <ClerkPetitionTable
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
import { useStore } from "vuex";
import ContentApiService from "@/services/contentApiService";
import PetitionDataDisplay from '@/components/clerk/PetitionDataDisplay.vue';
import ClerkPetitionTable from "@/components/tables/ClerkPetitionTable.vue";
import AuthApiService from "@/services/authApiService";

const store = useStore();


const selectedPetition = ref(null);
const petitions = ref([]);

const token = computed(() => store.getters["auth/accessToken"]);
const fetchPetitions = async () => {
    try {
        const response = await ContentApiService.get("clerk/petitions/pending");
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
        await ContentApiService.patch(`/clerk/petitions/${petitionId}`, { status: "rejected" });
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
        await ContentApiService.patch(`/clerk/petitions/${petitionId}`, { status: "approved" });
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
        ContentApiService.setAccessToken(token.value);
        AuthApiService.setAccessToken(token.value);
    }
    fetchPetitions();
});
</script>