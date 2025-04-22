<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <!-- EditCard with a ref to allow communication -->
        <EditCard
        ref="editCardRef"
        :role="role"
        @refresh="fetchPetitions"  />
      </v-col>
      <v-col cols="12" md="6">
        <!-- OverviewCard with event listener for select-petition -->
        <OverviewCard 
        :key="petitions.length" 
        :petitions="petitions"
        :isLoading ="isLoading"
        @select-petition="handleSelectPetition" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import ContentApiService from "@/services/contentApiService";
import EditCard from "@/components/dashboard/EditCard.vue";
import OverviewCard from "@/components/dashboard/OverviewCard.vue";
import { ref,computed, onMounted } from 'vue';
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();
const role = route.params.role; // Get the role from the route

const petitions = ref([]);
const isLoading = ref(true);
// Create a ref for the EditCard component
const editCardRef = ref(null);

const token = computed(() => store.getters["auth/accessToken"]);

const handleSelectPetition = (petition) => {
  // Pass the selected petition to the EditCard component to handle the selection
  if (editCardRef.value) {
    editCardRef.value.selectPetition(petition);
  }
};
const fetchPetitions =async () => {
 isLoading.value = true;
 try {
  if (token.value) {
    ContentApiService.setAccessToken(token.value);
  }
   const response = await ContentApiService.get(`${role==="student"?"/students":"/supervisor"}/petitions`);
   petitions.value = response.data;
 } catch (err) {
  //404 is supposed to be when there are no petitions
  // so we don't want to show an error in that case
  if(err.response?.status !== 404){
  console.error("Error fetching petitions:", err);
  store.dispatch("snackbar/setErrorSnacks", {
      message: "Error fetching petitions",
   });
  }
 } finally {
   isLoading.value = false;
 }
}
onMounted(() => {
  fetchPetitions();
});
</script>
