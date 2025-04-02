<template>
  <v-card>
    <v-card-title>{{ $t('overviewCard.overviewTitle') }}</v-card-title>
    <v-card-text>
      <!-- Loading Spinner -->
      <v-progress-circular
        v-if="isLoading"
        indeterminate
        color="primary"
        class="my-5"
      ></v-progress-circular>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Data Table -->
      <v-data-table
        v-if="!isLoading && !error"
        :headers="headers"
        :items="petitions"
        item-selectable
        hover
      >
        <template v-slot:item="{ item }">
          <tr @click="selectPetition(item)">
            <td>{{ item.student_mail }}</td>
            <td>{{ item.start_date }}</td>
            <td>{{ item.end_date }}</td>
            <td>{{ item.minutes }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import ApiService from "@/services/api"; // Import your API service

const { t } = useI18n();

const headers = computed(() => [
  { title: t('petition.studentMail'), key: "student_mail" },
  { title: t('petition.startDate'), key: "start_date" },
  { title: t('petition.endDate'), key: "end_date" },
  { title: t('petition.minutes'), key: "minutes" }
]);

const petitions = ref([]); // Local state for petitions
const isLoading = ref(true); // Loading state
const error = ref(null); // Error state

const emit = defineEmits(["select-petition"]);

const selectPetition = (petition) => {
  emit("select-petition", petition);
};

// Fetch petitions from the backend
onMounted(async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await ApiService.get("/petitions/"); // Replace with your API endpoint
    petitions.value = response.data;
  } catch (err) {
    error.value = "Failed to fetch petitions.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});
</script>
