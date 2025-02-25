<template>
    <v-dialog
      v-model="dialog"
      :persistent="persistent"
      :fullscreen="fullscreen"
      :max-width="maxWidth"
      transition="slide-y-reverse-transition"
      @click:outside="close"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <!-- Activator Slot -->
      <template #activator="props">
        <slot name="activator" v-bind="props"></slot>
      </template>
  
      <v-card>

        <v-card-title class="text-h6 font-weight-bold bg-grey-lighten-2 d-flex justify-space-between align-center">
          <span class="text-h6 font-weight-bold">{{ title }}</span>

          <v-btn icon @click="close">
            <v-icon>{{icons.mdiClose}}</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider class="my-0" />
  
        <!-- Slot for Main Content -->
        <v-card-text class="px-6">
          <slot name="content" :events="{ close }"></slot>
        </v-card-text>
  
        <!-- Slot for Actions (e.g., buttons) -->
        <v-card-actions class="pa-4">
            <v-btn color="grey darken-1" text @click="close">CANCEL</v-btn>
            <slot name="actions" ></slot>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { mdiClose } from '@mdi/js';

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    maxWidth: {
      type: [Number, String],
      default: 800,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      required: false,
    },

  });
  const icons={mdiClose}
  
  const emit = defineEmits(['update:modelValue']);
  
  const dialog = ref(props.modelValue);
  
  // Watch for changes in modelValue prop
  watch(
    () => props.modelValue,
    (newValue) => {
      dialog.value = newValue;
    }
  );
  
  // Watch dialog state and emit update to parent
  watch(dialog, (newValue) => {
    emit('update:modelValue', newValue);
  });
  
  // Close dialog function
  const close = () => {
    dialog.value = false;
  };
  </script>
  
  <style scoped>
  /* Custom Styles */
  .bg-grey-lighten-2 {
    background-color: #eeeeee; /* Light gray background for the title area */
  }
  
  .v-card-title {
    padding: 16px; /* Add padding to the title area */
  }
  
  .v-card-text {
    padding: 24px; /* Add padding to the main content area */
  }
  
  .v-card-actions {
    padding: 16px; /* Add padding to the actions area */
  }
  </style>