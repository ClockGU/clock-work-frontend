<template>
  <v-form ref="form" v-model="isFormValid">
    <v-row>
      <v-col cols="12" md="6">
        <label for="firstName">{{ $t('employeeData.firstName') }}</label>
        <v-text-field
          id="firstName"
          v-model="formData.first_name"
          outlined
          dense
          :prepend-icon="icons.mdiAccount"
          :aria-label="$t('employeeData.firstName')"
          :rules="[requiredRule]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <label for="lastName">{{ $t('employeeData.lastName') }}</label>
        <v-text-field
          id="lastName"
          v-model="formData.last_name"
          outlined
          dense
          :prepend-icon="icons.mdiAccount"
          :aria-label="$t('employeeData.lastName')"
          :rules="[requiredRule]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <label for="formOfAddress">{{
          $t('employeeData.formOfAddress')
        }}</label>
        <v-select
          id="formOfAddress"
          v-model="formData.form_of_address"
          outlined
          dense
          :prepend-icon="icons.mdiAccountBox"
          :aria-label="$t('employeeData.formOfAddress')"
          :items="['Mr.', 'Ms.', 'Mrs.', 'Dr.']"
          :rules="[requiredRule]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <label for="gender">{{ $t('employeeData.gender') }}</label>
        <v-select
          id="gender"
          v-model="formData.gender"
          outlined
          dense
          :prepend-icon="icons.mdiGenderMaleFemale"
          :aria-label="$t('employeeData.gender')"
          :items="['Male', 'Female', 'Other']"
          :rules="[requiredRule]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <label for="dateOfBirth">{{ $t('employeeData.dateOfBirth') }}</label>

        <!-- FIX:
             - display-format ensures the field text is really DD.MM.YYYY (date-fns via localizedFormat)
             - input-format controls MANUAL typing and uses Vuetify tokens: dd.mm.yyyy (NOT date-fns)
        -->
        <v-date-input
          id="dateOfBirth"
          v-model="formData.date_of_birth"
          :prepend-icon="icons.mdiCalendar"
          :display-format="displayDate"
          input-format="dd.mm.yyyy"
          output-format="dd-MM-yyyy"
          :aria-label="$t('employeeData.dateOfBirth')"
          :rules="[requiredRule]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <label for="cityOfBirth">{{ $t('employeeData.cityOfBirth') }}</label>
        <v-text-field
          id="cityOfBirth"
          v-model="formData.city_of_birth"
          outlined
          dense
          :prepend-icon="icons.mdiCity"
          :aria-label="$t('employeeData.cityOfBirth')"
          :rules="[requiredRule]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <label for="address">{{ $t('employeeData.address') }}</label>
        <v-text-field
          id="address"
          v-model="formData.address"
          outlined
          dense
          :prepend-icon="icons.mdiHomeMapMarker"
          :aria-label="$t('employeeData.address')"
          :rules="[requiredRule]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <label for="postalCode">{{ $t('employeeData.postalCode') }}</label>
        <v-text-field
          id="postalCode"
          v-model="formData.postal_code"
          outlined
          dense
          :prepend-icon="icons.mdiNumeric"
          :aria-label="$t('employeeData.postalCode')"
          :rules="[requiredRule, postalCodeRule]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <label for="nationality">{{ $t('employeeData.nationality') }}</label>
        <v-text-field
          id="nationality"
          v-model="formData.nationality"
          outlined
          dense
          :prepend-icon="icons.mdiFlag"
          :aria-label="$t('employeeData.nationality')"
          :rules="[requiredRule]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <label for="telephoneNumber">{{
          $t('employeeData.telephoneNumber')
        }}</label>
        <v-text-field
          id="telephoneNumber"
          v-model="formData.telephone_number"
          outlined
          dense
          :prepend-icon="icons.mdiPhone"
          :aria-label="$t('employeeData.telephoneNumber')"
          :rules="[requiredRule, phoneRule]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <label for="healthInsurance">{{
          $t('employeeData.healthInsurance')
        }}</label>
        <v-text-field
          id="healthInsurance"
          v-model="formData.health_insurance"
          outlined
          dense
          :prepend-icon="icons.mdiHospital"
          :aria-label="$t('employeeData.healthInsurance')"
          :rules="[requiredRule]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <label for="iban">{{ $t('employeeData.iban') }}</label>
        <v-text-field
          id="iban"
          v-model="formData.iban"
          outlined
          dense
          :prepend-icon="icons.mdiBank"
          :aria-label="$t('employeeData.iban')"
          :rules="[requiredRule, ibanRule]"
        />
      </v-col>

      <v-col cols="12">
        <v-checkbox
          id="married"
          v-model="formData.married"
          :label="$t('employeeData.married')"
          :aria-label="$t('employeeData.married')"
        />
      </v-col>

      <v-col cols="12">
        <v-checkbox
          id="previousEmployment"
          v-model="formData.previous_employment"
          :label="$t('employeeData.previousEmployment')"
          :aria-label="$t('employeeData.previousEmployment')"
          @update:model-value="handlePreviousEmploymentChange"
        />
      </v-col>

      <v-col v-if="formData.previous_employment" cols="12" md="6">
        <label for="prevEmpDuration">{{ $t('employeeData.duration') }}</label>

        <!-- FIX:
             - Range display is formatted as "DD.MM.YYYY – DD.MM.YYYY" via displayDate()
             - Manual typing uses input-format="dd.mm.yyyy"
        -->
        <v-date-input
          id="prevEmpDuration"
          v-model="formData.prev_emp_duration"
          :prepend-icon="icons.mdiCalendar"
          :display-format="displayDate"
          input-format="dd.mm.yyyy"
          output-format="dd-MM-yyyy"
          multiple="range"
          placeholder="DD.MM.YYYY – DD.MM.YYYY"
          :aria-label="$t('employeeData.duration')"
          :rules="formData.previous_employment ? [requiredRule] : []"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  mdiAccount,
  mdiGenderMaleFemale,
  mdiCity,
  mdiHomeMapMarker,
  mdiNumeric,
  mdiFlag,
  mdiPhone,
  mdiHospital,
  mdiBank,
  mdiCalendar,
  mdiClock,
  mdiAccountBox,
} from '@mdi/js';
import EmployeeData from '@/models/EmployeeData';
import { makeDisplayDate } from '@/utils/date';

const icons = {
  mdiAccount,
  mdiGenderMaleFemale,
  mdiCity,
  mdiHomeMapMarker,
  mdiNumeric,
  mdiFlag,
  mdiPhone,
  mdiHospital,
  mdiBank,
  mdiClock,
  mdiCalendar,
  mdiAccountBox,
};

const props = defineProps({
  initialData: {
    type: Object,
    default: null,
  },
});

const { t } = useI18n();
const formData = ref(new EmployeeData());
const isFormValid = ref(false);

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = EmployeeData.fromBackendResponse(newData);
    } else {
      formData.value = new EmployeeData();
    }
  },
  { immediate: true }
);

const displayDate = makeDisplayDate({
  displayFormat: 'dd.MM.yyyy',
  primaryParseFormat: 'dd-MM-yyyy',
});

// Validation Rules
const requiredRule = (v) => !!v || t('validationRule.required');
const postalCodeRule = (v) =>
  /^\d{5}$/.test(v) || t('validationRule.postalCode');
const phoneRule = (v) =>
  /^\d{10,15}$/.test(v) || t('validationRule.invalidPhone');
const ibanRule = (v) =>
  /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(v) || t('validationRule.invalidIban');

const handlePreviousEmploymentChange = (value) => {
  if (!value) {
    formData.value.prev_emp_duration = null;
  } else {
    formData.value.prev_emp_duration = [];
  }
  formData.value.previous_employment = value;
};

defineExpose({
  formData,
  isFormValid,
});
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
