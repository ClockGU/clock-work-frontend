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
        <label for="studentUserAccount">{{
          $t('petition.studentAccount')
        }}</label>
        <v-text-field
          id="studentUserAccount"
          v-model="formData.student_username"
          type="email"
          outlined
          dense
          :prepend-icon="icons.mdiAccountCog"
          :aria-label="$t('petition.studentAccount')"
          :rules="[requiredRule]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <label for="orgUnit">{{ $t('petition.orgUnit') }}</label>
        <v-text-field
          id="orgUnit"
          v-model="formData.org_unit"
          outlined
          dense
          :placeholder="$t('petition.orgUnitPlaceholder')"
          :prepend-icon="icons.mdiOfficeBuilding"
          :aria-label="$t('petition.orgUnit')"
          :rules="[requiredRule]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <EosField v-model="formData.eos_number" />
      </v-col>

      <v-col cols="12" md="6">
        <ContractDateInput
          v-model="formData.start_date"
          type="start"
          :display-format="displayDate"
          :label="$t('petition.startDate')"
          :placeholder="$t('datePlaceholder')"
          :rules="[requiredRule]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <ContractDateInput
          v-model="formData.end_date"
          type="end"
          :display-format="displayDate"
          :label="$t('petition.endDate')"
          :placeholder="$t('datePlaceholder')"
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
        <label for="baDegree" class="mb-2 d-block">{{
          $t('petition.baDegreeLabel')
        }}</label>
        <v-checkbox
          id="baDegree"
          v-model="formData.ba_degree"
          :prepend-icon="icons.mdiSchool"
          :label="$t('petition.baDegree')"
          :aria-label="$t('petition.baDegree')"
          class="ma-0 ba-degree-checkbox"
        />
      </v-col>

      <v-col cols="12">
        <BudgetPositionsFields
          ref="budgetPositionsRef"
          v-model="formData.budget_positions"
        />
      </v-col>

      <v-col cols="12">
        <TimeExceptionFields
          v-model:exception="timeExceReason"
          v-model:name="formData.time_exce_name"
          v-model:time="formData.time_exce_time"
          :required="worktimeRequiresTimeException"
          :disabled="!worktimeRequiresTimeException"
        />
      </v-col>

      <v-col cols="12">
        <DurationExceptionFields
          v-model:exception="durationExceReason"
          v-model:name="formData.duration_exce_name"
          v-model:start="formData.duration_exce_start"
          v-model:end="formData.duration_exce_end"
          :display-date="displayDate"
          :required="durationRequiresException"
          :disabled="!durationRequiresException"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { addYears, isAfter, isBefore, isValid, parse } from 'date-fns';
import {
  mdiAccount,
  mdiEmail,
  mdiOfficeBuilding,
  mdiNumeric,
  mdiSchool,
  mdiCalendar,
  mdiClock,
  mdiCurrencyUsd,
  mdiAccountCog,
} from '@mdi/js';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import Petition from '@/models/Petition';
import { makeDisplayDate } from '@/utils/date';
import ContractDateInput from '@/components/forms/fields/ContractDateInput.vue';
import EosField from '@/components/forms/fields/EosField.vue';
import BudgetPositionsFields from '@/components/forms/fields/BudgetPositionsFields.vue';
import DurationExceptionFields from '@/components/forms/fields/DurationExceptionFields.vue';
import TimeExceptionFields from '@/components/forms/fields/TimeExceptionFields.vue';

const props = defineProps({
  petition: {
    type: [Object, null],
    required: false,
    default: null,
  },
});

const icons = {
  mdiAccountCog,
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

//Contract exception reason handling

const REASON_STUDENT_WISH = 1;
const REASON_COURSE = 2;

const timeExceReason = computed({
  get() {
    if (formData.value.time_exce_student) return REASON_STUDENT_WISH;
    if (formData.value.time_exce_course) return REASON_COURSE;
    return null;
  },
  set(value) {
    formData.value.time_exce_student = value === REASON_STUDENT_WISH;
    formData.value.time_exce_course = value === REASON_COURSE;
  },
});

const durationExceReason = computed({
  get() {
    if (formData.value.duration_exce_student) return REASON_STUDENT_WISH;
    if (formData.value.duration_exce_course) return REASON_COURSE;
    return null;
  },
  set(value) {
    formData.value.duration_exce_student = value === REASON_STUDENT_WISH;
    formData.value.duration_exce_course = value === REASON_COURSE;
  },
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
  { immediate: true }
);

const displayDate = makeDisplayDate({
  displayFormat: 'dd.MM.yyyy',
  primaryParseFormat: 'dd-MM-yyyy',
});

const parseContractDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = parse(String(value), 'dd-MM-yyyy', new Date());
  return isValid(parsed) ? parsed : null;
};

const MIN_WORKING_HOURS = 40;

// Worktime (< 40h/month) requires a time exception
const worktimeRequiresTimeException = computed(() => {
  const workingHours = Number(formData.value.minutes);
  if (!Number.isFinite(workingHours)) return false;
  return workingHours > 0 && workingHours < MIN_WORKING_HOURS;
});

// Contract duration (< 1 year) requires a duration exception
const durationRequiresException = computed(() => {
  const start = parseContractDate(formData.value.start_date);
  const end = parseContractDate(formData.value.end_date);
  if (!start || !end) return false;
  if (!isAfter(end, start)) return false;
  return isBefore(end, addYears(start, 1));
});
// Validation rules
const requiredRule = (v) => !!v || t('validationRule.required');
const positiveNumberRule = (v) => v > 0 || t('validationRule.positiveNumber');

const endDateRule = (v) => {
  const start = parseContractDate(formData.value.start_date);
  const end = parseContractDate(v);
  if (!start || !end) return true;
  return isAfter(end, start) || t('validationRule.endDateAfterStart');
};

onMounted(() => {
  // Set supervisor email if user is a supervisor
  if (user.value?.user_role === 1) {
    formData.value.supervisor_mail = user.value.email;
  }
});

// Ensure cross-field rules are re-evaluated immediately
watch(
  () => [durationRequiresException.value, worktimeRequiresTimeException.value],
  () => {
    //trigger form  validation
    form.value?.validate?.();
  }
);

defineExpose({ formData, isAllValid });
</script>

<style scoped>
.ba-degree-checkbox :deep(.v-selection-control__wrapper) {
  margin-left: -8px;
}
</style>
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
