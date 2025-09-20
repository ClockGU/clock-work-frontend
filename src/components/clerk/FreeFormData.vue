<template>
  <v-card class="px-4 h-100">
    <v-card-title class="text-h6 px-4">
      {{ $t('freeFormData.title') }}
    </v-card-title>
    <v-card-text>
      <PetitionTableWithActions
        v-if="petition"
        :petition="petition"
        @close="emit('close')"
        @refresh="handleRefresh"
      />
      <!-- Placeholder when no petition is selected -->
      <v-alert v-else type="info" variant="tonal" density="comfortable">
        {{ $t('editCard.noPetitionSelected') }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup>
import PetitionTableWithActions from '../tables/PetitionTableWithActions.vue';
const props = defineProps({
  petition: {
    type: [Object, null],
    required: true,
  },
});
const emit = defineEmits(['close', 'refresh']);
const handleRefresh = (payload) => {
  emit('refresh', payload);
};
</script>
