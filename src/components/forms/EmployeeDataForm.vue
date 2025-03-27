<template>
  <v-form ref="form" v-model="isFormValid">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiAccount"
          :label="$t('employeeDataForm.firstName')"
          v-model="formData.first_name"
          :rules="[requiredRule]"
          outlined
          dense
          :aria-label="$t('employeeDataForm.firstName')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiAccount"
          :label="$t('employeeDataForm.lastName')"
          v-model="formData.last_name"
          :rules="[requiredRule]"
          outlined
          dense
          :aria-label="$t('employeeDataForm.lastName')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          :prepend-icon="icons.mdiAccountBox"
          :label="$t('employeeDataForm.formOfAddress')"
          v-model="formData.form_of_address"
          :items="['Mr.', 'Ms.', 'Mrs.', 'Dr.']"
          :rules="[requiredRule]"
          outlined
          dense
          :aria-label="$t('employeeDataForm.formOfAddress')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          :prepend-icon="icons.mdiGenderMaleFemale"
          :label="$t('employeeDataForm.gender')"
          v-model="formData.gender"
          :items="['Male', 'Female', 'Other']"
          :rules="[requiredRule]"
          outlined
          dense
          :aria-label="$t('employeeDataForm.gender')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiCalendar"
          :label="$t('employeeDataForm.dateOfBirth')"
          v-model="formData.date_of_birth"
          type="date"
          :rules="[requiredRule]"
          outlined
          dense
          :aria-label="$t('employeeDataForm.dateOfBirth')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiCity"
          :label="$t('employeeDataForm.cityOfBirth')"
          v-model="formData.city_of_birth"
          :rules="[requiredRule]"
          outlined
          dense
          :aria-label="$t('employeeDataForm.cityOfBirth')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiHomeMapMarker"
          :label="$t('employeeDataForm.address')"
          v-model="formData.address"
          :rules="[requiredRule]"
          outlined
          dense
          :aria-label="$t('employeeDataForm.address')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiNumeric"
          :label="$t('employeeDataForm.postalCode')"
          v-model="formData.postal_code"
          :rules="[requiredRule, postalCodeRule]"
          outlined
          dense
          :aria-label="$t('employeeDataForm.postalCode')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiFlag"
          :label="$t('employeeDataForm.nationality')"
          v-model="formData.nationality"
          :rules="[requiredRule]"
          outlined
          dense
          :aria-label="$t('employeeDataForm.nationality')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiPhone"
          :label="$t('employeeDataForm.telephoneNumber')"
          v-model="formData.telephone_number"
          :rules="[requiredRule, phoneRule]"
          outlined
          dense
          :aria-label="$t('employeeDataForm.telephoneNumber')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiHospital"
          :label="$t('employeeDataForm.healthInsurance')"
          v-model="formData.health_insurance"
          :rules="[requiredRule]"
          outlined
          dense
          :aria-label="$t('employeeDataForm.healthInsurance')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiBank"
          :label="$t('employeeDataForm.iban')"
          v-model="formData.iban"
          :rules="[requiredRule, ibanRule]"
          outlined
          dense
          :aria-label="$t('employeeDataForm.iban')"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          :label="$t('employeeDataForm.married')"
          v-model="formData.married"
          :aria-label="$t('employeeDataForm.married')"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          :label="$t('employeeDataForm.previousEmployment')"
          v-model="formData.previous_employment"
          :aria-label="$t('employeeDataForm.previousEmployment')"
        />
      </v-col>
      <v-col cols="12" md="6" v-if="formData.previous_employment">
        <v-text-field
          :prepend-icon="icons.mdiClock"
          :label="$t('employeeDataForm.duration')"
          v-model="formData.prev_emp_duration"
          :rules="formData.previous_employment ? [requiredRule] : []"
          outlined
          dense
          placeholder="DD.MM.YYYY – DD.MM.YYYY"
          :aria-label="$t('employeeDataForm.duration')"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { mdiAccount, mdiGenderMaleFemale, mdiCity, mdiHomeMapMarker, mdiNumeric, mdiFlag, mdiPhone, mdiHospital, mdiBank, mdiCalendar, mdiClock, mdiAccountBox } from '@mdi/js';

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
  mdiAccountBox
};

const store = useStore();

const initialFormData = {
  first_name: '',
  last_name: '',
  form_of_address: '',
  gender: '',
  date_of_birth: '',
  city_of_birth: '',
  address: '',
  postal_code: '',
  married: false,
  nationality: '',
  telephone_number: '',
  health_insurance: '',
  previous_employment: false,
  prev_emp_duration: '',
  iban: '',
  elstam: null,
  studienbescheinigung: null,
  versicherungsbescheinigung: null,
};

const formData = ref({ ...initialFormData });
const isFormValid = ref(false);

const employeeData = computed(() => store.getters['employeeData/employeeData']);

watch(
  employeeData,
  (newEmployeeData) => {
    if (newEmployeeData) {
      formData.value = { ...newEmployeeData };
    }
  },
  { immediate: true }
);

// Validation Rules
const requiredRule = (v) => !!v || 'This field is required';
const postalCodeRule = (v) => /^\d{5}$/.test(v) || 'Postal code must be 5 digits';
const phoneRule = (v) => /^\d{10,15}$/.test(v) || 'Invalid phone number';
const ibanRule = (v) => /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(v) || 'Invalid IBAN';

defineExpose({ formData, isFormValid });
</script>

