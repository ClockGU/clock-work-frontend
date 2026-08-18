<script setup>
import ProcessInstruction from '@/components/dashboard/instruction_texts/ProcessInstruction.vue';

const props = defineProps({
  locale:{
    type:String,
    default:"de"
  }
})
</script>

<template>
  <v-card-text>
    <v-row>
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

<style scoped></style>
