<template>
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
</template>

<script setup>
import PetitionsTable from "@/components/tables/PetitionsTable.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

const store = useStore();
const { t } = useI18n();
const props = defineProps({
  role: {
    type: String,
    required: true,
  },
});

const headers = computed(() => [
  { title: t('petition.studentMail'), key: "student_mail" },
  { title: t('petition.startDate'), key: "start_date" },
  { title: t('petition.endDate'), key: "end_date" },
  { title: t('petition.minutes'), key: "minutes" }
]);

const emit = defineEmits(["select-petition"]);

const petitions = computed(() => store.getters["petitions/petitions"]);
const selectPetition = (petition) => {
  emit("select-petition", petition);
};
</script>
