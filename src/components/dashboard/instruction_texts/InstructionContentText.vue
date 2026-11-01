<script setup>
import ProcessInstruction from '@/components/dashboard/instruction_texts/ProcessInstruction.vue';
import { useDisplay } from 'vuetify';

const props = defineProps({
  locale: {
    type: String,
    default: 'de',
  },
});
const { mdAndDown } = useDisplay();
</script>

<template>
  <v-card-text>
    <v-row v-if="mdAndDown">
      <v-col>
        <slot name="left-col" :locale="locale"></slot>
      </v-col>
      <v-col>
        <slot name="right-col" :locale="locale">
          <ProcessInstruction :locale="locale"></ProcessInstruction>
        </slot>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="6">
        <slot name="left-col" :locale="locale"></slot>
      </v-col>
      <v-col cols="6">
        <slot name="right-col" :locale="locale">
          <ProcessInstruction :locale="locale"></ProcessInstruction>
        </slot>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<style>
/*
Style for Instruction cards.
*/

.inset-lg-and-up {
  margin-inline-start: 6rem;
  margin-top: 8px;
}
.inset-md-and-down {
  margin-inline-start: 2rem;
  margin-top: 8px;
}
.shift-lists {
  margin-inline-start: 1rem;
}
</style>
