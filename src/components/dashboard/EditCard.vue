<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 font-weight-bold">
      {{ role==="supervisor" ? 'Create Petition' : 'Manage Personal Information' }}
    </v-card-title>
    <v-card-text>
      <!-- Button to open the form dialog -->
      <v-btn
        color="primary"
        class="mb-4"
        @click="openDialog"
      >
        {{ role==="supervisor" ? 'Create Petition' : 'Edit Personal Information' }}
      </v-btn>

      <!-- PetitionFormDialog -->
      <PetitionFormDialog
        v-if="role==='supervisor'"
        v-model="dialog"
        :role="role"
        :petition="petition"
        @close="dialog = false"
      />
      <StudentDataManagementDialog
        v-else
        v-model="dialog"
        @close="dialog = false"
      ></StudentDataManagementDialog>
  
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import PetitionFormDialog from '@/components/dialogs/PetitionFormDialog.vue';
import StudentDataManagementDialog from '../dialogs/StudentDataManagementDialog.vue';

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

const dialog = ref(false);

const openDialog = () => {
  dialog.value = true;
};
</script>