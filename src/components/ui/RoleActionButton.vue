<template>
  <div v-if="hasPermission" role="button">
    <v-btn
      :color="color"
      :icon="icon"
      :variant="variant"
      :density="density"
      :rounded="rounded"
      :disabled="disabled"
      :aria-label="tooltip"
      @click="emit('click')"
    />
    <v-tooltip
      v-if="tooltip && !disabled"
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
    required: true,
  },
  color: {
    type: String,
    default: 'primary',
  },
  icon: {
    type: String,
    required: true,
  },
  density: {
    type: String,
    default: 'default',
  },
  variant: {
    type: String,
    default: 'elevated',
  },
  rounded: {
    type: String,
    default: 'sm',
  },
  tooltip: {
    type: String,
    default: '',
  },
  tooltipLocation: {
    type: String,
    default: 'top',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['click']);
const store = useStore();
const userRole = computed(() => store.getters['auth/userRole']);
const hasPermission = computed(() => props.roles.includes(userRole.value));
</script>
