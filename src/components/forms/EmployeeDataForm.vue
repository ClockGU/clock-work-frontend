<template>
  <v-form ref="form" v-model="isFormValid">
    <v-row>
      <v-col cols="12" md="6">
        <label for="firstName">{{ $t('employeeDataForm.firstName') }}</label>
        <v-text-field
          id="firstName"
          v-model="formData.first_name"
          outlined
          dense
          :prepend-icon="icons.mdiAccount"
          :aria-label="$t('employeeDataForm.firstName')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="lastName">{{ $t('employeeDataForm.lastName') }}</label>
        <v-text-field
          id="lastName"
          v-model="formData.last_name"
          outlined
          dense
          :prepend-icon="icons.mdiAccount"
          :aria-label="$t('employeeDataForm.lastName')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="formOfAddress">{{
          $t('employeeDataForm.formOfAddress')
        }}</label>
        <v-select
          id="formOfAddress"
          v-model="formData.form_of_address"
          outlined
          dense
          :prepend-icon="icons.mdiAccountBox"
          :aria-label="$t('employeeDataForm.formOfAddress')"
          :items="['Mr.', 'Ms.', 'Mrs.', 'Dr.']"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="gender">{{ $t('employeeDataForm.gender') }}</label>
        <v-select
          id="gender"
          v-model="formData.gender"
          outlined
          dense
          :prepend-icon="icons.mdiGenderMaleFemale"
          :aria-label="$t('employeeDataForm.gender')"
          :items="['Male', 'Female', 'Other']"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="dateOfBirth">{{
          $t('employeeDataForm.dateOfBirth')
        }}</label>
        <v-date-input
          id="dateOfBirth"
          v-model="formData.date_of_birth"
          placeholder="DD.MM.YYYY"
          :display-format="formatDate"
          :aria-label="$t('employeeDataForm.dateOfBirth')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="cityOfBirth">{{
          $t('employeeDataForm.cityOfBirth')
        }}</label>
        <v-text-field
          id="cityOfBirth"
          v-model="formData.city_of_birth"
          outlined
          dense
          :prepend-icon="icons.mdiCity"
          :aria-label="$t('employeeDataForm.cityOfBirth')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="address">{{ $t('employeeDataForm.address') }}</label>
        <v-text-field
          id="address"
          v-model="formData.address"
          outlined
          dense
          :prepend-icon="icons.mdiHomeMapMarker"
          :aria-label="$t('employeeDataForm.address')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="postalCode">{{ $t('employeeDataForm.postalCode') }}</label>
        <v-text-field
          id="postalCode"
          v-model="formData.postal_code"
          outlined
          dense
          :prepend-icon="icons.mdiNumeric"
          :aria-label="$t('employeeDataForm.postalCode')"
          :rules="[requiredRule, postalCodeRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="nationality">{{
          $t('employeeDataForm.nationality')
        }}</label>
        <v-text-field
          id="nationality"
          v-model="formData.nationality"
          outlined
          dense
          :prepend-icon="icons.mdiFlag"
          :aria-label="$t('employeeDataForm.nationality')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="telephoneNumber">{{
          $t('employeeDataForm.telephoneNumber')
        }}</label>
        <v-text-field
          id="telephoneNumber"
          v-model="formData.telephone_number"
          outlined
          dense
          :prepend-icon="icons.mdiPhone"
          :aria-label="$t('employeeDataForm.telephoneNumber')"
          :rules="[requiredRule, phoneRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="healthInsurance">{{
          $t('employeeDataForm.healthInsurance')
        }}</label>
        <v-text-field
          id="healthInsurance"
          v-model="formData.health_insurance"
          outlined
          dense
          :prepend-icon="icons.mdiHospital"
          :aria-label="$t('employeeDataForm.healthInsurance')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <label for="iban">{{ $t('employeeDataForm.iban') }}</label>
        <v-text-field
          id="iban"
          v-model="formData.iban"
          outlined
          dense
          :prepend-icon="icons.mdiBank"
          :aria-label="$t('employeeDataForm.iban')"
          :rules="[requiredRule, ibanRule]"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          id="married"
          v-model="formData.married"
          :label="$t('employeeDataForm.married')"
          :aria-label="$t('employeeDataForm.married')"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          id="previousEmployment"
          v-model="formData.previous_employment"
          :label="$t('employeeDataForm.previousEmployment')"
          :aria-label="$t('employeeDataForm.previousEmployment')"
          @update:model-value="handlePreviousEmploymentChange"
        />
      </v-col>
      <v-col v-if="formData.previous_employment" cols="12" md="6">
        <label for="prevEmpDuration">{{
          $t('employeeDataForm.duration')
        }}</label>
        <v-date-input
          id="prevEmpDuration"
          v-model="formData.prev_emp_duration"
          multiple="range"
          placeholder="DD.MM.YYYY – DD.MM.YYYY"
          :display-format="formatDate"
          :aria-label="$t('employeeDataForm.duration')"
          :rules="formData.previous_employment ? [requiredRule] : []"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
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
import ContentApiService from '@/services/contentApiService';
import { VDateInput } from 'vuetify/labs/VDateInput';
import { format } from 'date-fns';
import EmployeeData from '@/models/EmployeeData'; 

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

const store = useStore();
const { t } = useI18n();

const formData = ref(new EmployeeData()); 
const isFormValid = ref(false);

// Validation Rules
const requiredRule = (v) => !!v || t('validationRule.required');
const postalCodeRule = (v) =>
  /^\d{5}$/.test(v) || t('validationRule.postalCode');
const phoneRule = (v) =>
  /^\d{10,15}$/.test(v) || t('validationRule.invalidPhone');
const ibanRule = (v) =>
  /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(v) || t('validationRule.invalidIban');

const formatDate = (date) => {
  if (!date) return null;
  return format(new Date(date), 'dd.MM.yyyy');
};

const handlePreviousEmploymentChange = (value) => {
  if (!value) {
    formData.value.prev_emp_duration = null;
  } else {
    formData.value.prev_emp_duration = [];
  }
  formData.value.previous_employment = value;
};

const fetchEmployeeData = async () => {
  try {
    const response = await ContentApiService.get('/employees');
    if (response.data) {
      // Use the static method to parse and load the backend data into the model
      formData.value = EmployeeData.fromBackendResponse(response.data); 
    }
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error('Error fetching employee data:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: t('errors.studentData.fetchingData'),
      });
    }
  }
};

onMounted(() => {
  fetchEmployeeData();
});

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