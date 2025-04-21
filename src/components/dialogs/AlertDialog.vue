<template>
    <v-dialog
      v-model="model"
      persistent
      :max-width="maxWidth"
      :fullscreen="fullscreen"
    >
      <!-- Optional Activator Slot -->
      <template #activator="props">
        <slot name="activator" v-bind="props"></slot>
      </template>
  
      <v-card>
        <div class="d-flex justify-end pa-2">
            <v-btn
            icon
            variant="text"
            class="ma-0"
            @click="close"
            >
                <v-icon>{{ icons.mdiClose }}</v-icon>
            </v-btn>
        </div>

        <!-- Content Slot  -->
        <v-card-text class="px-8 py-4">
          <slot name="content"></slot>
        </v-card-text>
  
        <!-- Centered Actions -->
        <v-card-actions class="justify-center mb-4">
          <v-btn
            color="grey-darken-1"
            variant="elevated"
            class="mx-2 mt-2"
            @click="close"
          >
            {{ $t('actions.cancel') }}
          </v-btn>
          <slot name="actions"></slot>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { mdiClose } from '@mdi/js';

  const icons = { mdiClose };
  const props = defineProps({
    maxWidth: {
      type: [Number, String],
      default: 500
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
  });
  
  const model = defineModel({
    type: Boolean,
    default: false
  });
  
  const close = () => {
    model.value = false;
  };
  </script>