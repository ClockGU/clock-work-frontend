<template>
  <v-card>
    <v-card-title>Overview</v-card-title>
    <v-card-text>
      <!-- Data Table -->
      <v-data-table :headers="headers" :items="petitions" item-selectable>
        <template v-slot:item="{ item }">
          <tr @click="openPetition(item)">
            <!--<td>{{ item.petitioneer }}</td>-->
            <td>{{ item.student_mail }}</td>
            <td>{{ item.start_date }}</td>
            <td>{{ item.end_date }}</td>
            <!--<td>{{ item.org_unit }}</td>
            <td>{{ item.eos_number }}</td>
            <td>{{ item.minutes }}</td>
            <td>{{ item.ba_degree ? 'Yes' : 'No' }}</td>
            <td>{{ item.budget_position }}</td>
            <td>{{ item.budget_approver }}</td>
            -->

            <!-- 
            <td colspan="3" style="text-align: center; background-color: #f0f0f0;">
            </td>
            <td>{{ item.time_exce_name }}</td>
            <td>{{ item.time_exce_start }}</td>
            <td>{{ item.time_exce_end }}</td>

            <td colspan="3" style="text-align: center;">
            </td>
            <td>{{ item.duration_exce_name }}</td>
            <td>{{ item.duration_exce_start }}</td>
            <td>{{ item.duration_exce_end }}</td>
           -->
          </tr>
        </template>
      </v-data-table>

      <!-- PetitionDetailsDialog -->
      <PetitionDetailsDialog
        v-model="isDialogOpen"
        :petition="selectedPetition"
        :role="role"
        @editPetition="isEditing = true"
        @deletePetition="deletePetition"
        @close="isDialogOpen = false"
      />
      <PetitionFormDialog
        v-model="isEditing"
        :petition="selectedPetition"
        :role="role"
        :isEditing="isEditing"
        @close="isEditing = false"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import PetitionDetailsDialog from "@/components/dialogs/PetitionDetailsDialog.vue";
import PetitionFormDialog from "@/components/dialogs/PetitionFormDialog.vue";

const store = useStore();
const props = defineProps({
  role: {
    type: String,
    required: true,
  },
});

// Headers for the data table
const headers = [
  //{ title: "Petitioneer", key: "petitioneer" },
  { title: "Student Mail", key: "student_mail" },
  { title: "Start Date", key: "start_date" },
  { title: "End Date", key: "end_date" },
  /*{ title: "Organisation Unit", key: "org_unit" },
  { title: "EOS Number", key: "eos_number" },
  { title: "Debit Worktime (Minutes)", key: "minutes" },
  { title: "Bachelor Degree", key: "ba_degree" },
  { title: "Budget Position", key: "budget_position" },
  { title: "Budget Approver", key: "budget_approver" },

  /*
  { title: "Exception of Minimum Debit Worktime", key: "time_exce_group", colspan: 3, children: [
    { title: "Event Name", key: "time_exce_name" },
    { title: "Start Date", key: "time_exce_start" },
    { title: "End Date", key: "time_exce_end" },
  ]},

  // Group: Exception from minimum contract duration
  { title: "Exception from Minimum Contract Duration", key: "duration_exce_group", colspan: 3, children: [
    { title: "Event Name", key: "duration_exce_name" },
    { title: "Start Date", key: "duration_exce_start" },
    { title: "End Date", key: "duration_exce_end" },
  ]},*/
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