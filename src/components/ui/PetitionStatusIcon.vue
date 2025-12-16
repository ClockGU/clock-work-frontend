<template>
  <v-tooltip
    :location="tooltipLocation"
    open-on-hover
    open-on-click
  >
    <template #activator="{ props: tipProps }">
      <!-- Button activator works on mobile (tap) and desktop (hover). -->
      <v-btn
        v-bind="tipProps"
        icon
        variant="text"
        density="compact"
        class="petition-status-btn"
        :aria-label="label"
        @click.stop
        @mousedown.stop
        @touchstart.stop
        @keydown.enter.stop
        @keydown.space.stop
      >
        <v-icon :icon="icon" :size="size" />
      </v-btn>
    </template>

    <span>{{ label }}</span>
  </v-tooltip>
</template>

<script setup>
import { computed } from 'vue';
import { getStatusDisplayIcon, getStatusDisplayText } from '@/utils/statusUtils';

const props = defineProps({
  status: { type: String, default: '' },
  size: { type: [Number, String], default: 20 },
  tooltipLocation: { type: String, default: 'top' },
});

const icon = computed(() => getStatusDisplayIcon(props.status));
const label = computed(() => getStatusDisplayText(props.status));
</script>

<style scoped>
.petition-status-btn {
  min-width: auto;
}
</style>
