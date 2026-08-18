<template>
  <v-card class="mb-4 pa-4" role="article">
    <v-card-title>
      <h2 class="text-h5 font-weight-bold mb-4">
        {{ instructionCardTitle }}
      </h2>
    </v-card-title>
    <SupervisorInstructionText
      v-if="role === Roles.SUPERVISOR"
      :locale="selectedLocale"
    />
    <StudentInstructionText
      v-if="role === Roles.STUDENT"
      :locale="selectedLocale"
    />
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Roles } from '@/utils/roleUtils';
import StudentInstructionTextEnglish from '@/components/dashboard/instruction_texts/StudentInstructionTextEnglish.vue';
import StudentInstructionTextGerman from '@/components/dashboard/instruction_texts/StudentInstructionTextGerman.vue';
import { getCurrentLocale } from '@/plugins/i18n';
import SupervisorInstructionText from '@/components/dashboard/instruction_texts/SupervisorInstructionText.vue';
import StudentInstructionText from '@/components/dashboard/instruction_texts/StudentInstructionText.vue';

const { t } = useI18n();
const props = defineProps({
  role: {
    type: String,
    required: true,
  },
});

const selectedLocale = computed(() => {
  return getCurrentLocale();
});

const instructionCardTitle = computed(() =>
  props.role === Roles.STUDENT
    ? t('instructionCard.title.student')
    : t('instructionCard.title.supervisor')
);
</script>
<style>
/*
Style for Instruction cards.
*/

.inset {
  margin-inline-start: 6rem;
  margin-top: 8px;
}
.shift-lists {
  margin-inline-start: 1rem;
}
</style>
