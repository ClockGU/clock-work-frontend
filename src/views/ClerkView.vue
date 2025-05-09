<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <PetitionDataDisplay 
                    :petition="selectedPetition"
                    @close="selectPetition(null)"
                    @reject="handleRejection"
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
                            @row-click="selectPetition"
                        />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
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

const handleRejection = async (petitionId) => {
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
            message: "Error accepting petition"
        });
    }
};
onMounted(() => {
    const initialize = async () => {
        if (token.value) {
            ContentApiService.setAccessToken(token.value);
            AuthApiService.setAccessToken(token.value);
        }
        try {
            //const res = await ContentApiService.get('get-me');
            //const ID = res.data;
            //console.log("User ID:", ID);
            let userID = "1234"; // Replace with actual user ID

        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        fetchPetitions(); 

        let userID = "1234"; // Replace with actual user ID
        const socket = new WebSocket(`ws://localhost:8030/ws/${userID}`);
        console.log("WebSocket connection established");

        
        socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data); 
                console.log("WebSocket message received:", message);

                if (message.type === "new_petition" && Array.isArray(message.data)) {
                    petitions.value = message.data;
                } else {
                    console.warn("Unexpected WebSocket message format:", message);
                    petitions.value = []; 
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
                petitions.value = []; 
            }
        };

        // Handle WebSocket errors
        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            store.dispatch("snackbar/setErrorSnacks", {
                message: "WebSocket connection error"
            });
        };

        // Clean up WebSocket connection when the component is unmounted
        onUnmounted(() => {
            if (socket) {
                socket.close();
            }
        });
    };

    initialize(); 
});
</script>