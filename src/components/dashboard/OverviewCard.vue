<template>
  <v-card>
    <v-card-title>Overview</v-card-title>
    <v-card-text>
      <!-- Data Table -->
      <v-data-table :headers="headers" :items="petitions" item-selectable>
        <template v-slot:item="{ item }">
          <tr @click="openPetition(item)">
            <td>{{ item.student_mail }}</td>
            <td>{{ item.start_date }}</td>
            <td>{{ item.end_date }}</td>
          </tr>
        </template>
      </v-data-table>

      <!-- PetitionDetailsDialog -->
      <PetitionDetailsDialog
        :petition="selectedPetition"
        :role="role"
        v-model="isDialogOpen"
        @editPetition="isEditing = true"
        @deletePetition="deletePetition"
      />
      <PetitionFormDialog
        :petition="selectedPetition"
        :role="role"
        :isEditing="isEditing"
        v-model="isEditing"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import PetitionDetailsDialog from "@/components/dashboard/dialogs/PetitionDetailsDialog.vue";
import PetitionFormDialog from "@/components/dashboard/dialogs/PetitionFormDialog.vue";

const store = useStore();
const props = defineProps({
  role: {
    type: String,
    required: true,
  },
});

// Headers for the data table
const headers = [
  { title: "Student Mail", key: "student_mail" },
  { title: "Start Date", key: "start_date" },
  { title: "End Date", key: "end_date" },
];

// Dialog state
const isDialogOpen = ref(false);
const selectedPetition = ref(null);
const isEditing = ref(false);

// Get petitions directly from the store
const petitions = computed(() => store.getters["petitions/petitions"]);

// Open petition in view mode
const openPetition = (petition) => {
  selectedPetition.value = petition;
  isDialogOpen.value = true;
};

// Delete a petition
const deletePetition = () => {
  store.dispatch("petitions/removePetition", selectedPetition.value);
  selectedPetition.value = null;
};
</script>