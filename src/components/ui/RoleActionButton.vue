<template>
    <div v-if="hasPermission">
        <v-btn
            :color="color"
            :icon="icon"
            :variant="variant"
            :density="density"
            :rounded="rounded"
            :aria-label="tooltip"
            @click="action"
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
import { computed } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  roles: {
    type: Array,
    required: true
  },
  color: {
    type: String,
    default: 'primary'
  },
  icon: {
    type: String,
    required: true
  },
  density: {
    type: String,
    default: 'default'
  },
  variant: {
    type: String,
    default: 'elevated'
  },
  rounded: {
    type: String,
    default: 'sm'
  },
  tooltip: {
    type: String,
    default: ''
  },
  tooltipLocation: {
    type: String,
    default: 'top'
  },
  action: {
    type: Function,
    default: () => {}
  }
});

const store = useStore();
const userRole = computed(() => store.getters['auth/userRole']);
const hasPermission = computed(() => props.roles.includes(userRole.value));
</script>