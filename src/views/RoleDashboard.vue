<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <InstructionCard
        :title="instructionCardTitle"
        :text="instructionCardText"/>
      </v-col>
      <v-col cols="12" md="6">
        <!-- EditCard with a ref to allow communication -->
        <EditCard
            :selectedPetition="selectedPetition"
            @refresh="handleRefresh" 
            @deselect-petition="deselectPetition" />
      </v-col>
      <v-col cols="12" md="6">
        <!-- OverviewCard with event listener for select-petition -->
        <OverviewCard 
            :key="petitions.length" 
            :petitions="petitions"
            :selectedPetition="selectedPetition"
            :isLoading ="isLoading"
            @select-petition="selectPetition" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import ContentApiService from "@/services/contentApiService";
import EditCard from "@/components/dashboard/EditCard.vue";
import OverviewCard from "@/components/dashboard/OverviewCard.vue";
import { ref,computed, onMounted } from 'vue';
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import InstructionCard from "@/components/dashboard/InstructionCard.vue";

const store = useStore();
const { t } = useI18n();

const petitions = ref([]);
const selectedPetition = ref(null);
const isLoading = ref(true);

const token = computed(() => store.getters["auth/accessToken"]);
const userRole = computed(() => store.getters["auth/userRole"]);
const instructionCardTitle = computed(() => {
  return userRole.value === 0 ? t("instructionCard.title.student") : t("instructionCard.title.supervisor");
});
const instructionCardText = computed(() => {
  return userRole.value === 0 ? t("instructionCard.text.student") : t("instructionCard.text.supervisor");
})
const selectPetition = (petition) => {
  selectedPetition.value = petition;
};
const deselectPetition = () => {
  selectedPetition.value = null;
};
const fetchPetitions =async () => {
 isLoading.value = true;
 try {
  if (token.value) {
    ContentApiService.setAccessToken(token.value);
  }
   const response = await ContentApiService.get(`${userRole.value===0?"/students":"/supervisor"}/petitions`);
   petitions.value = response.data;
   console.log("Fetched petitions:", petitions.value);
 } catch (err) {
  //404 is supposed to be when there are no petitions
  // so we don't want to show an error in that case
  if(err.response?.status !== 404){
  console.error("Error fetching petitions:", err);
  store.dispatch("snackbar/setErrorSnacks", {
      message: t("errors.petition.fetching")
   });
  }
 } finally {
   isLoading.value = false;
 }
}
const handleRefresh = (payload) => {
  if (payload) {
    switch(payload.type) {
      case 'update':
        // Update the selected petition's data if it's the one that was updated
        if (selectedPetition.value?.id === payload.data.id) {
          selectPetition(payload.data);
        }
        break;
      case 'delete':
        // Deselect the petition if it's the one being deleted
        if (selectedPetition.value?.id === payload.data) {
          deselectPetition();
        }
        // Immediately update the local petitions array to remove the deleted item
        petitions.value = petitions.value.filter(p => p.id !== payload.data);
        break;
    }
  }
  // Re-fetch all petitions to ensure data consistency with the server
  fetchPetitions();
};
onMounted(() => {
  fetchPetitions();
});
</script>
