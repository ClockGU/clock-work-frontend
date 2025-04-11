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
import PetitionsTable from "@/components/tables/PetitionsTable.vue";
import { computed} from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  petitions: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["select-petition"]);
const { t } = useI18n();

const headers = computed(() => [
  { title: t('petition.studentMail'), key: "student_mail" },
  { title: t('petition.startDate'), key: "start_date" },
  { title: t('petition.endDate'), key: "end_date" },
  { title: t('petition.minutes'), key: "minutes" }
]);
const selectPetition = (petition) => {
  emit("select-petition", petition);
};
</script>
