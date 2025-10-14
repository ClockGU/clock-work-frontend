<template>
  <v-form ref="form" v-model="isFormValid">
    <v-row>
      <v-col cols="12" md="6">
        <label for="supervisorMail">{{ $t('petition.supervisorMail') }}</label>
        <v-text-field
          id="supervisorMail"
          v-model="formData.supervisor_mail"
          outlined
          dense
          disabled
          :prepend-icon="icons.mdiAccount"
          :aria-label="$t('petition.supervisorMail')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="studentMail">{{ $t('petition.studentMail') }}</label>
        <v-text-field
          id="studentMail"
          v-model="formData.student_mail"
          type="email"
          outlined
          dense
          :prepend-icon="icons.mdiEmail"
          :aria-label="$t('petition.studentMail')"
          :rules="[requiredRule, emailRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="orgUnit">{{ $t('petition.orgUnit') }}</label>
        <v-text-field
          id="orgUnit"
          v-model="formData.org_unit"
          outlined
          dense
          :prepend-icon="icons.mdiOfficeBuilding"
          :aria-label="$t('petition.orgUnit')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="eosNumber">{{ $t('petition.eosNumber') }}</label>
        <v-text-field
          id="eosNumber"
          v-model="formData.eos_number"
          outlined
          dense
          :prepend-icon="icons.mdiNumeric"
          :aria-label="$t('petition.eosNumber')"
          :rules="[requiredRule, eosRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="startDate">{{ $t('petition.startDate') }}</label>
        <v-date-input
          id="startDate"
          v-model="formData.start_date"
          placeholder="DD.MM.YYYY"
          :display-format="formatDateForDisplay"
          :aria-label="$t('petition.startDate')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="endDate">{{ $t('petition.endDate') }}</label>
        <v-date-input
          id="endDate"
          v-model="formData.end_date"
          placeholder="DD.MM.YYYY"
          :display-format="formatDateForDisplay"
          :aria-label="$t('petition.endDate')"
          :rules="[requiredRule, endDateRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="minutes">{{ $t('petition.minutes') }}</label>
        <v-text-field
          id="minutes"
          v-model="formData.minutes"
          type="number"
          outlined
          dense
          :prepend-icon="icons.mdiClock"
          :aria-label="$t('petition.minutes')"
          :rules="[requiredRule, positiveNumberRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="baDegree">{{ $t('petition.baDegree') }}</label>
        <v-select
          id="baDegree"
          v-model="formData.ba_degree"
          :items="degreeOptions"
          item-title="text"
          item-value="value"
          outlined
          dense
          :prepend-icon="icons.mdiSchool"
          :aria-label="$t('petition.baDegree')"
        />
      </v-col>
      <v-col cols="12">
        <BudgetPositionsFields
          v-model="formData.budget_positions"
          ref="budgetPositionsRef"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          id="timeExceCourse"
          v-model="formData.time_exce_course"
          :label="$t('petition.timeExceCourse')"
          :aria-label="$t('petition.timeExceCourse')"
          @update:model-value="handleTimeExceptionChange"
        />
        <div v-if="formData.time_exce_course" class="mx-4">
          <label for="timeExceName" class="ml-0">{{
            $t('petition.timeExceName')
          }}</label>
          <v-text-field
            id="timeExceName"
            v-model="formData.time_exce_name"
            outlined
            dense
            :aria-label="$t('petition.timeExceName')"
            :rules="[requiredRule]"
          />
          <label for="timeExceStart" class="ml-0">{{
            $t('petition.timeExceStart')
          }}</label>
          <v-date-input
            id="timeExceStart"
            v-model="formData.time_exce_start"
            placeholder="DD.MM.YYYY"
            :display-format="formatDateForDisplay"
            :aria-label="$t('petition.timeExceStart')"
            :rules="[requiredRule]"
          />
          <label for="timeExceEnd" class="ml-0">{{
            $t('petition.timeExceEnd')
          }}</label>
          <v-date-input
            id="timeExceEnd"
            v-model="formData.time_exce_end"
            placeholder="DD.MM.YYYY"
            :display-format="formatDateForDisplay"
            :aria-label="$t('petition.timeExceEnd')"
            :rules="[requiredRule]"
          />
        </div>
      </v-col>
      <v-col cols="12">
        <v-checkbox
          id="durationExceCourse"
          v-model="formData.duration_exce_course"
          :label="$t('petition.durationException')"
          :aria-label="$t('petition.durationException')"
          @update:model-value="handleDurationExceptionChange"
        />
        <div v-if="formData.duration_exce_course" class="mx-4">
          <label for="durationExceName" class="ml-0">{{
            $t('petition.durationExceName')
          }}</label>
          <v-text-field
            id="durationExceName"
            v-model="formData.duration_exce_name"
            outlined
            dense
            :aria-label="$t('petition.durationExceName')"
            :rules="[requiredRule]"
          />
          <label for="durationExceStart" class="ml-0">{{
            $t('petition.durationExceStart')
          }}</label>
          <v-date-input
            id="durationExceStart"
            v-model="formData.duration_exce_start"
            placeholder="DD.MM.YYYY"
            :display-format="formatDateForDisplay"
            :aria-label="$t('petition.durationExceStart')"
            :rules="[requiredRule]"
          />
          <label for="durationExceEnd" class="ml-0">{{
            $t('petition.durationExceEnd')
          }}</label>
          <v-date-input
            id="durationExceEnd"
            v-model="formData.duration_exce_end"
            placeholder="DD.MM.YYYY"
            :display-format="formatDateForDisplay"
            :aria-label="$t('petition.durationExceEnd')"
            :rules="[requiredRule]"
          />
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import {
  mdiAccount,
  mdiEmail,
  mdiOfficeBuilding,
  mdiNumeric,
  mdiSchool,
  mdiCalendar,
  mdiClock,
  mdiCurrencyUsd,
} from '@mdi/js';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import BudgetPositionsFields from './BudgetPositionsFields.vue';
import Petition from '@/models/Petition';
import { VDateInput } from 'vuetify/labs/VDateInput';
import { format } from 'date-fns';

const props = defineProps({
  petition: {
    type: [Object, null],
    required: false,
    default: null,
  },
});

const icons = {
  mdiAccount,
  mdiEmail,
  mdiOfficeBuilding,
  mdiNumeric,
  mdiCalendar,
  mdiClock,
  mdiCurrencyUsd,
  mdiSchool,
};

const { t } = useI18n();
const store = useStore();

const formData = ref(new Petition());
const form = ref(null);
const budgetPositionsRef = ref(null);
const isFormValid = ref(false);

const user = computed(() => store.getters['auth/user']);
const degreeOptions = computed(() => [
  { text: t('petitionFormDialog.bachlor.yes'), value: true },
  { text: t('petitionFormDialog.bachlor.no'), value: false },
]);

// Combine the form validity and the budget position validation
const isAllValid = computed(() => {
  const isBudgetValid = budgetPositionsRef.value?.percentageTotalRule === true;
  const isOtherFieldsValid = isFormValid.value;

  return isOtherFieldsValid && isBudgetValid;
});

// Populate form data when petition prop changes
watch(
  () => props.petition,
  (newPetition) => {
    if (newPetition) {
      formData.value = Petition.fromBackendResponse(newPetition);
    } else {
      formData.value = new Petition();
    }
  },
  { immediate: true}
);

const formatDateForDisplay = (date) => {
  if (!date) return null;
  return format(new Date(date), 'dd.MM.yyyy');
};

// Clear time exception fields when checkbox is unchecked
const handleTimeExceptionChange = (value) => {
  formData.value.time_exce_course = value;
  // Always reset the fields when the checkbox state changes
  formData.value.time_exce_name = '';
  formData.value.time_exce_start = null;
  formData.value.time_exce_end = null;
};

const handleDurationExceptionChange = (value) => {
  formData.value.duration_exce_course = value;
  formData.value.duration_exce_name = '';
  formData.value.duration_exce_start = null;
  formData.value.duration_exce_end = null;
};

// Validation rules
const requiredRule = (v) => !!v || t('validationRule.required');
const emailRule = (v) =>
  /.+@.+\..+/.test(v) || t('validationRule.invalidEmail');
const positiveNumberRule = (v) => v > 0 || t('validationRule.positiveNumber');
const endDateRule = (v) => {
  if (!formData.value.start_date || !v) return true;
  const startDate = new Date(formData.value.start_date);
  const endDate = new Date(v);
  return endDate > startDate || t('validationRule.endDateAfterStart');
};
const eosRule = (v) => /^F\d{6}$/.test(v) || t('validationRule.eosNumber');

onMounted(() => {
  // Set supervisor email if user is a supervisor
  if (user.value?.user_role === 1) {
    formData.value.supervisor_mail = user.value.email;
  }
});

defineExpose({ formData, isAllValid });
</script>

<style scoped>
label {
  font-weight: 500;
  font-size: 1rem;
  margin-left: 2.5rem;
}
.v-checkbox :deep(.v-label) {
  opacity: 1;
  font-weight: normal;
  margin-left: 0;
  font-size: inherit;
}
</style>
