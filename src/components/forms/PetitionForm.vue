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

        <!-- FIX:
             - display-format makes sure the field really shows DD.MM.YYYY (via localizedFormat)
             - input-format enables manual typing; uses Vuetify tokens dd.mm.yyyy (NOT date-fns)
        -->
        <v-date-input
          id="startDate"
          v-model="formData.start_date"
          :prepend-icon="icons.mdiCalendar"
          :display-format="displayDate"
          input-format="dd.mm.yyyy"
          output-format="dd-MM-yyyy"
          placeholder="DD.MM.YYYY"
          :aria-label="$t('petition.startDate')"
          :rules="[requiredRule]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <label for="endDate">{{ $t('petition.endDate') }}</label>

        <v-date-input
          id="endDate"
          v-model="formData.end_date"
          :prepend-icon="icons.mdiCalendar"
          :display-format="displayDate"
          input-format="dd.mm.yyyy"
          output-format="dd-MM-yyyy"
          placeholder="DD.MM.YYYY"
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

          <label for="timeExecActualTime">{{
            $t('petition.timeExecActualTime')
          }}</label>
          <v-text-field
            id="timeExecActualTime"
            v-model="formData.time_exce_time"
            type="number"
            outlined
            dense
            :prepend-icon="icons.mdiClock"
            :aria-label="$t('petition.timeExecActualTime')"
            :rules="[requiredRule, positiveNumberRule]"
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
            :display-format="displayDate"
            input-format="dd.mm.yyyy"
            output-format="dd-MM-yyyy"
            placeholder="DD.MM.YYYY"
            :aria-label="$t('petition.durationExceStart')"
            :rules="[requiredRule]"
          />

          <label for="durationExceEnd" class="ml-0">{{
            $t('petition.durationExceEnd')
          }}</label>
          <v-date-input
            id="durationExceEnd"
            v-model="formData.duration_exce_end"
            :display-format="displayDate"
            input-format="dd.mm.yyyy"
            output-format="dd-MM-yyyy"
            placeholder="DD.MM.YYYY"
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
  mdiAccountCog,
} from '@mdi/js';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import Petition from '@/models/Petition';
import { makeDisplayDate, toDate } from '@/utils/date';
import BudgetPositionsFields from '@/components/forms/fields/BudgetPositionsFields.vue';

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

// Clear time exception fields when checkbox is unchecked
const handleTimeExceptionChange = (value) => {
  formData.value.time_exce_course = value;
  // Always reset the fields when the checkbox state changes
  formData.value.time_exce_name = '';
  formData.value.time_exce_time = '';
};

const handleDurationExceptionChange = (value) => {
  formData.value.duration_exce_course = value;
  formData.value.duration_exce_name = '';
  formData.value.duration_exce_start = null;
  formData.value.duration_exce_end = null;
};

const displayDate = makeDisplayDate({
  displayFormat: 'dd.MM.yyyy',
  primaryParseFormat: 'dd-MM-yyyy',
});
// Validation rules
const requiredRule = (v) => !!v || t('validationRule.required');
const emailRule = (v) =>
  /.+@.+\..+/.test(v) || t('validationRule.invalidEmail');
const positiveNumberRule = (v) => v > 0 || t('validationRule.positiveNumber');

const endDateRule = (v) => {
  const start = toDate(formData.value.start_date, {
    primaryFormat: 'dd-MM-yyyy',
  });
  const end = toDate(v, { primaryFormat: 'dd-MM-yyyy' });
  if (!start || !end) return true;
  return end > start || t('validationRule.endDateAfterStart');
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
