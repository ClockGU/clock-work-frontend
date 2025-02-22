<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 font-weight-bold">
      {{ role === 'supervisor' ? 'Create New Petition' : 'Edit Petition' }}
    </v-card-title>
    <v-card-text>
      <!-- Button to open the form dialog -->
      <v-btn
        color="primary"
        class="mb-4"
        @click="openDialog"
      >
        {{ role === 'supervisor' ? 'Create Petition' : 'Edit Petition' }}
      </v-btn>

      <!-- PetitionFormDialog -->
      <PetitionFormDialog
        v-model="dialog"
        :role="role"
        :petition="petition"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import PetitionFormDialog from './dialogs/PetitionFormDialog.vue';

// Props for role and petition
const props = defineProps({
  role: {
    type: String,
    required: true,
  },
  petition: {
    type: [Object,null],
    required: false,
  },
});

// Dialog visibility state
const dialog = ref(false);

// Function to open the dialog
const openDialog = () => {
  dialog.value = true;
};
</script>