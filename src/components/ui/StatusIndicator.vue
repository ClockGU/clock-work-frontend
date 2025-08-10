<template>
  <div>
    <v-btn
      :color="status ? 'success' : 'error'"
      :icon="status ? icons.mdiCheck : icons.mdiClose"
      :variant="variant"
      :density="density"
      :aria-label="tooltip"
    />
    <v-tooltip 
      v-if="tooltip" 
      activator="parent" 
      :location="tooltipLocation" 
      :text="tooltip"
    />
  </div>
</template>

<script setup>
import { 
  mdiCheck, 
  mdiClose
} from '@mdi/js';

const icons = {
  mdiCheck,
  mdiClose,
};

const props = defineProps({
    //the status we want to track Whether it should be green (true) or red (false).
  status: {
    type: Boolean,
    required: true,
  },
  tooltip: {
    type: String,
    default: ''
  },
  density: {
    type: String,
    default: 'compact'
  },
  variant: {
    type: String,
    default: 'flat'
  },
  tooltipLocation: {
    type: String,
    default: 'top'
  }
});
</script>