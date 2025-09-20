<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <PetitionDataDisplay 
                    :petition="selectedPetition"
                    @close="selectPetition(null)"
                    @refresh="handleRefresh"
                    @approve="handleApproval"
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
                            :selected-petition="selectedPetition"
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
import { useI18n } from "vue-i18n";
import ContentApiService from "@/services/contentApiService";
import PetitionDataDisplay from '@/components/clerk/PetitionDataDisplay.vue';
import ClerkPetitionTable from "@/components/tables/ClerkPetitionTable.vue";
import AuthApiService from "@/services/authApiService";

const store = useStore();
const {t} = useI18n
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
            message: t("errors.petition.fetching")
        });
    }
};

const selectPetition = (petition) => {
    selectedPetition.value = petition;
};
const handleApproval = async (petitionId) => {
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
            message: t("errors.petition.approval")
        });
    }
};
const handleRefresh = (payload) => {
  if (payload) {
    switch(payload.type) {
      case 'update':
        if (selectedPetition.value?.id === payload.data.id) {
          selectedPetition.value = payload.data;
        }
        break;
      case 'delete':
        if (selectedPetition.value?.id === payload.data) {
          selectedPetition.value = null;
        }
        break;
    }
  }
  fetchPetitions();
};

onMounted(() => {
    if (token.value) {
        ContentApiService.setAccessToken(token.value);
        AuthApiService.setAccessToken(token.value);
    }
    fetchPetitions();
});
</script>