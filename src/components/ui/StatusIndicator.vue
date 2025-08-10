<template>
    <div>
        <v-btn
          :color="modelValue? 'success' : 'error'"
          :icon="modelValue? icons.mdiCheck : icons.mdiClose "
          :variant="variant"
          :density="density"
          :aria-label="tooltip"

         />
        <v-tooltip 
            v-if="tooltip" 
            activator="parent" 
            location="top" 
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
const props= defineProps({
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
  }
});
const modelValue =defineModel({
  type: Boolean,
  default: false
});
</script>