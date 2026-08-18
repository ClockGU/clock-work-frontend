<script setup>
import InstructionContentText from '@/components/dashboard/instruction_texts/InstructionContentText.vue';
import SupervisorInstruction from '@/components/dashboard/instruction_texts/SupervisorInstruction.vue';
const props = defineProps({
  locale: {
    type: String,
    default: 'de',
  },
});
</script>

<template>
  <InstructionContentText :locale="locale">
    <template #left-col="props">
      <SupervisorInstruction v-bind="props" />
    </template>
  </InstructionContentText>
</template>

<style scoped></style>
