<template>
  <v-card class="pa-4 w-100" elevation="2">
    <v-card-title class="mt-2 mb-4">
      {{ $t('petitionDataDisplay.title') }}
    </v-card-title>
    <v-card-text>
      <v-row class="mb-6">
        <v-col cols="12" md="6" class="d-flex flex-column">
          <FreeFormData
            class="flex-grow-1"
            style="overflow-y: auto"
            :petition="petition"
            @close="emit('close')"
            @refresh="handleRefresh"
          />
        </v-col>
        <v-col cols="12" md="6" class="d-flex flex-column">
          <UploadedFiles class="flex-grow-1" :petition="petition" />
        </v-col>
      </v-row>
      <div class="d-flex justify-space-around mt-6">
        <v-btn
          color="warning"
          size="large"
          class="px-6"
          :disabled="!petition"
          @click="showRevisionDialog = true"
        >
          {{ $t('actions.requestChange') }}
        </v-btn>
        <v-btn
          color="success"
          size="large"
          class="px-10"
          :disabled="!petition"
          @click="approve"
        >
          {{ $t('actions.approve') }}
        </v-btn>
      </div>
    </v-card-text>

    <PetitionRevisionDialog
      v-model="showRevisionDialog"
      :petition="petition"
      @close="showRevisionDialog = false"
    />
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import PetitionRevisionDialog from '../dialogs/PetitionRevisionDialog.vue';
import FreeFormData from './FreeFormData.vue';
import UploadedFiles from './UploadedFiles.vue';

const props = defineProps({
  petition: {
    type: [Object, null],
    required: false,
  },
});

const emit = defineEmits(['close', 'refresh', 'approve']);

const showRevisionDialog = ref(false);

const approve = () => {
  if (props.petition?.id) emit('approve', props.petition.id);
};

const handleRefresh = (payload) => {
  emit('refresh', payload);
};
</script>
