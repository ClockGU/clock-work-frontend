<template>
  <v-card>
    <v-card-title>{{ $t('overviewCard.overviewTitle') }}</v-card-title>
    <v-card-text>
      <!-- Data Table -->
      <v-data-table :headers="headers" :items="petitions" item-selectable hover>
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
