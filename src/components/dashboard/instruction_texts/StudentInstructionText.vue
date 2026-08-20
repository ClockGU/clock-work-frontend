<script setup>
import InstructionContentText from '@/components/dashboard/instruction_texts/InstructionContentText.vue';
import StudentInstruction from '@/components/dashboard/instruction_texts/StudentInstruction.vue';

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
      <StudentInstruction v-bind="props" />
    </template>
  </InstructionContentText>
</template>

<style scoped></style>
