<template>
  <v-card>
    <v-card-title>{{ $t('overviewCard.overviewTitle') }}</v-card-title>
    <v-card-text>
      <!-- Loading Spinner -->
      <v-progress-circular
        v-if="isLoading"
        class="d-flex justify-center my-5"
        indeterminate
        color="primary"
      ></v-progress-circular>
      <PetitionsTable
        v-else
        :headers="headers" 
        :items="petitions" 
        @row-click="selectPetition"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import ApiService from "@/services/api"; // Import your API service
import PetitionsTable from "@/components/tables/PetitionsTable.vue";
import { ref,computed,onMounted} from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

const props = defineProps({
  role: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["select-petition"]);

const store = useStore();
const { t } = useI18n();

const petitions = ref([]);
const isLoading = ref(true);
const token = computed(() => store.getters["auth/accessToken"]);

const headers = computed(() => [
  { title: t('petition.studentMail'), key: "student_mail" },
  { title: t('petition.startDate'), key: "start_date" },
  { title: t('petition.endDate'), key: "end_date" },
  { title: t('petition.minutes'), key: "minutes" }
]);
// Fetch petitions from the backend
onMounted(async () => {
  console.log(token.value);
 isLoading.value = true;
 try {
     // Ensure token is set in API headers
    if (token.value) {
      ApiService.setAccessToken(token.value);
    }
   const response = await ApiService.get(`${props.role==="student"?"/students":"/supervisor"}/petitions`); 
   petitions.value = response.data;
 } catch (err) {
  //404 is supposed to be when there are no petitions
  // so we don't want to show an error in that case
  if(err.response?.status !== 404){
  store.dispatch("snackbar/setErrorSnacks", {
      message: "Error fetching petitions",
   });
   console.error("Error fetching petitions:", err);
  }
 } finally {
   isLoading.value = false;
 }
});
const selectPetition = (petition) => {
  emit("select-petition", petition);
};
</script>
