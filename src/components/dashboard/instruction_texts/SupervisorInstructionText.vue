<script setup>
import { mdiAccountCog, mdiSchool, mdiNumeric8Box, mdiMailbox } from '@mdi/js';
import InstructionContentText from '@/components/dashboard/instruction_texts/InstructionContentText.vue';
import SupervisorInstruction from '@/components/dashboard/instruction_texts/SupervisorInstruction.vue';
</script>

<template>
  <InstructionContentText>
    <template #left-col="{props}">
      <SupervisorInstruction v-bind="props"/>
    </template>
  </InstructionContentText>
</template>

<style scoped>
</style>
