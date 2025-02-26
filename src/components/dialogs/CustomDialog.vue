<template>
  <v-dialog
    v-model="model"
    :persistent="persistent"
    :fullscreen="fullscreen"
    :max-width="maxWidth"
    transition="slide-y-reverse-transition"
    @click:outside="close"
  >
    <!-- Activator Slot -->
    <template #activator="props">
      <slot name="activator" v-bind="props"></slot>
    </template>

    <v-card>
      <!-- Title Section -->
      <v-card-title class="text-h6 font-weight-bold bg-grey-lighten-2 d-flex justify-space-between align-center">
        <span class="text-h6 pa-2">{{ title }}</span>

        <!-- Close Button -->
        <v-btn
          icon
          @click="close"
          variant="text"
          class="text-grey-darken-2"
          :ripple="false"
        >
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Divider -->
      <v-divider class="my-0" />

      <!-- Main Content Slot -->
      <v-card-text class="px-6">
        <slot name="content" :events="{ close }"></slot>
      </v-card-text>

      <!-- Actions Slot -->
      <v-card-actions class="pa-4">
        <v-btn color="grey-darken-1" variant="text" @click="close">CANCEL</v-btn>
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useModel } from 'vue';
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

const icons = { mdiClose };

const model = useModel(props, 'modelValue');

const close = () => {
  model.value = false;
};
</script>

<style scoped>
/* Remove ripple effect globally for the close button */
.v-btn--icon.v-btn--density-default {
  background-color: transparent !important;
  box-shadow: none !important;
}

</style>