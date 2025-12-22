<template>
  <v-label class="text-subtitle-1 font-weight-medium">
    {{ $t('petition.budgetPositions') }}:
  </v-label>

  <div
    v-for="(position, index) in budgetPositions"
    :key="index"
    class="d-flex flex-wrap align-center my-4 ga-2"
  >
    <v-text-field
      v-model="position.budget_position"
      outlined
      dense
      style="width: 30%; min-width: 150px"
      :label="$t('petition.budgetPosition')"
      :rules="[requiredRule]"
    />

    <v-text-field
      v-model="position.budget_approver"
      type="email"
      outlined
      dense
      style="width: 35%; min-width: 200px"
      :prepend-inner-icon="icons.mdiEmail"
      :label="$t('petition.budgetApprover')"
      :rules="[requiredRule, emailRule]"
    />

    <v-text-field
      v-model.number="position.percentage"
      type="number"
      outlined
      dense
      style="width: 10%; min-width: 80px"
      :label="$t('petition.percentage')"
      :rules="[requiredRule, percentageRule]"
      suffix="%"
    />
    <div class="d-flex align-center ga-2 mb-4">
      <v-btn
        v-if="index === 0"
        :icon="icons.mdiPlus"
        variant="tonal"
        rounded="sm"
        size="small"
        color="primary"
        @click="addPosition"
      />
      <v-btn
        v-else
        :icon="icons.mdiMinus"
        variant="tonal"
        rounded="sm"
        size="small"
        color="error"
        @click="removePosition(index)"
      />
    </div>
  </div>
  <div v-if="percentageTotalRule !== true" class="text-error mb-3">
    {{ percentageTotalRule }}
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { mdiEmail, mdiPlus, mdiMinus } from '@mdi/js';

const icons = {
  mdiEmail,
  mdiPlus,
  mdiMinus,
};
const { t } = useI18n();

const budgetPositions = defineModel({
  type: Array,
  default: () => [
    {
      budget_position: '',
      budget_approver: '',
      percentage: 0,
      budget_position_approved: false,
    },
  ],
});

function addPosition() {
  budgetPositions.value.push({
    budget_position: '',
    budget_approver: '',
    percentage: 0,
    budget_position_approved: false,
  });
}

function removePosition(index) {
  budgetPositions.value.splice(index, 1);
}

// Validation rules
const requiredRule = (value) => !!value || t('validationRule.required');
const emailRule = (value) =>
  /.+@.+\..+/.test(value) || t('validationRule.invalidEmail');
const percentageRule = (value) =>
  (value >= 0 && value <= 100) || t('validationRule.percentage');

// New computed property for total percentage validation
const percentageTotalRule = computed(() => {
  const totalPercentage = budgetPositions.value.reduce(
    (sum, position) => sum + (Number(position.percentage) || 0),
    0
  );

  return totalPercentage === 100
    ? true
    : t('validationRule.percentageTotal', { totalPercentage });
});
defineExpose({ percentageTotalRule });
</script>
