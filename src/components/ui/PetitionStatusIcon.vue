<template>
  <span class="d-inline-flex align-center">
    <v-tooltip :location="tooltipLocation" open-on-hover>
      <template #activator="{ props: tipProps }">
        <v-btn
          v-bind="tipProps"
          icon
          variant="text"
          density="compact"
          :aria-label="label"
          @click.stop="legendOpen = true"
          @mousedown.stop
          @touchstart.stop
          @keydown.enter.stop.prevent="legendOpen = true"
          @keydown.space.stop.prevent="legendOpen = true"
        >
          <v-icon :color="color" :size="size">
            {{ icon }}
          </v-icon>
        </v-btn>
      </template>

      <span>{{ label }}</span>
    </v-tooltip>

    <PetitionStatusLegendDialog v-model="legendOpen" :current-status="status" />
  </span>
</template>

<script setup>
import { computed, ref } from 'vue';
import PetitionStatusLegendDialog from '@/components/dialogs/PetitionStatusLegendDialog.vue';
import {
  getStatusDisplayIcon,
  getStatusDisplayText,
  getStatusDisplayColor,
} from '@/utils/statusUtils';

const props = defineProps({
  status: { type: String, default: '' },
  size: { type: [Number, String], default: 24 },
  tooltipLocation: { type: String, default: 'top' },
});

const legendOpen = ref(false);

const icon = computed(() => getStatusDisplayIcon(props.status));
const label = computed(() => getStatusDisplayText(props.status));
const color = computed(() => getStatusDisplayColor(props.status));
</script>
