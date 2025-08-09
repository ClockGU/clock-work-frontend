<template>
  <v-label class="text-subtitle-1 font-weight-medium">
    {{ $t('petition.budgetPositions') }}:
  </v-label>
  
  <div v-for="(position, index) in budgetPositions" :key="index" class="d-flex flex-wrap align-center my-4 ga-2" >
    <!-- Budget Position Field -->
    <v-text-field
      v-model="position.budget_position"
      outlined
      dense
      style="width: 30%; min-width: 150px;"
      :label="$t('petition.budgetPosition')"
      :rules="[requiredRule]"
    />
    
    <!-- Approver Email Field -->
    <v-text-field
      v-model="position.budget_approver"
      type="email"
      outlined
      dense
      style="width: 35%; min-width: 200px;"
      :prepend-inner-icon="icons.mdiEmail"
      :label="$t('petition.budgetApprover')"
      :rules="[requiredRule, emailRule]"
    />
    
    <!-- Percentage Field -->
    <v-text-field
      v-model.number="position.percentage"
      type="number"
      outlined
      dense
      style="width: 10%; min-width: 80px;"
      :label="$t('percentage')"
      :rules="[requiredRule, percentageRule]"
      suffix="%"
    />

    <!-- Approval Status Button -->
    <v-tooltip location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          :icon="position.budget_approved ? icons.mdiCheck : icons.mdiClose"
          :color="position.budget_approved ? 'success' : 'error'"
          density="compact"
          class="mb-4"
        />
      </template>
      <span>{{ position.budget_approved ? $t('approved') : $t('notApproved') }}</span>
    </v-tooltip>
    <!-- Add Button  -->
    <v-btn
      v-if="index === 0"
      :icon="icons.mdiPlus"
      variant="tonal"
      rounded="sm"
      size="small"
      color="primary"
      class="mb-4"
      @click="addPosition"
    />
    <!-- Remove Button  -->
    <v-btn
      v-else
      :icon="icons.mdiMinus"
      variant="tonal"
      rounded="sm"
      size="small"
      color="error"
      class="mb-4"
      @click="removePosition(index)"
    />

  </div>
</template>

<script setup>
import { 
  mdiEmail, 
  mdiCheck, 
  mdiClose, 
  mdiPlus, 
  mdiMinus 
} from '@mdi/js';

const icons = {
  mdiEmail,
  mdiCheck,
  mdiClose,
  mdiPlus,
  mdiMinus
};

const budgetPositions = defineModel({
  type: Array,
  default: () => ([
    { 
      budget_position: '', 
      budget_approver: '', 
      percentage: 0, 
      budget_approved: false 
    }
  ])
});

// Add new position
function addPosition() {
  budgetPositions.value.push({
    budget_position: '',
    budget_approver: '',
    percentage: 0,
    budget_approved: false
  });
}

// Remove position
function removePosition(index) {
  budgetPositions.value.splice(index, 1);
}

// Validation rules
const requiredRule = (value) => !!value || 'Required field';
const emailRule = (value) => /.+@.+\..+/.test(value) || 'Invalid email';
const percentageRule = (value) => 
  (value >= 0 && value <= 100) || 'Must be between 0-100';
</script>