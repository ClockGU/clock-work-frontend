<template>
  <v-card>
    <v-card-title>{{ $t('overview') }}</v-card-title>
    <v-card-text>
      <!-- Loading Spinner -->
      <v-progress-circular
        v-if="isLoading"
        class="d-flex justify-center my-5"
        indeterminate
        color="primary"
      ></v-progress-circular>
      <PetitionsOverviewTable
        v-else
        :headers="headers" 
        :items="petitions" 
        @row-click="selectPetition"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import PetitionsOverviewTable from "@/components/tables/PetitionsOverviewTable.vue";
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
  role: {
    type: String,
    required: true
  }
});
const emit = defineEmits(["select-petition"]);
const { t } = useI18n();

const headers = computed(() => {
  const baseHeaders = [
    { title: t('petition.startDate'), key: "start_date" },
    { title: t('petition.endDate'), key: "end_date" },
    { title: t('petition.minutes'), key: "minutes" }
  ];
  
  if (props.role === "student") {
    return [
      { title: t('petition.supervisorMail'), key: "supervisor_mail" },
      ...baseHeaders
    ];
  } else {
    return [
      { title: t('petition.studentMail'), key: "student_mail" },
      ...baseHeaders
    ];
  }
});
const selectPetition = (petition) => {
  emit("select-petition", petition);
};
</script>
