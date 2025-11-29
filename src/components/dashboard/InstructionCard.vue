<template>
  <v-card class="mb-4 pa-4" role="article">
    <v-card-title>
      <h2 class="text-h5 font-weight-bold mb-4">
        {{ instructionCardTitle }}
      </h2>
    </v-card-title>
  <PetitioneerInstructionTextEnglish v-if="role===1 && selectedLocale==='en'"/>
  <PetitioneerInstructionTextGerman v-if="role===1 && selectedLocale==='de'"/>
  <StudentInstructionTextEnglish v-if="role===0 && selectedLocale==='en'"/>
  <StudentInstructionTextGerman v-if="role===0 && selectedLocale==='de'"/>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import PetitioneerInstructionTextEnglish
  from "@/components/dashboard/instruction_texts/PetitioneerInstructionTextEnglish.vue";
import PetitioneerInstructionTextGerman
  from "@/components/dashboard/instruction_texts/PetitioneerInstructionTextGerman.vue";
import StudentInstructionTextEnglish from "@/components/dashboard/instruction_texts/StudentInstructionTextEnglish.vue";
import StudentInstructionTextGerman from "@/components/dashboard/instruction_texts/StudentInstructionTextGerman.vue";
import { getCurrentLocale } from "@/plugins/i18n";

const { t } = useI18n();
const props = defineProps({
  role: {
    type: Number,
    required: true,
  }
});

const selectedLocale = computed(() => {
  return getCurrentLocale();
});

const instructionCardTitle = computed(() =>
  props.role === 0
    ? t('instructionCard.title.student')
    : t('instructionCard.title.supervisor')
);
const instructionCardText = computed(() =>
  props.role === 0
    ? t('instructionCard.text.student')
    : t('instructionCard.text.supervisor')
);
</script>
