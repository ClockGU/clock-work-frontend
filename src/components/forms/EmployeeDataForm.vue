<template>
  <v-form ref="form" v-model="isFormValid">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiAccount"
          label="First Name / Vorname"
          v-model="formData.first_name"
          :rules="[requiredRule]"
          outlined
          dense
          aria-labelledby="first-name"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiAccount"
          label="Last Name / Nachname"
          v-model="formData.last_name"
          :rules="[requiredRule]"
          outlined
          dense
          aria-labelledby="last-name"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          :prepend-icon="icons.mdiAccountBox"
          label="Form of Address / Anrede"
          v-model="formData.form_of_address"
          :items="['Mr.', 'Ms.', 'Mrs.', 'Dr.']"
          :rules="[requiredRule]"
          outlined
          dense
          aria-labelledby="form-of-address"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          :prepend-icon="icons.mdiGenderMaleFemale"
          label="Gender / Geschlecht"
          v-model="formData.gender"
          :items="['Male', 'Female', 'Other']"
          :rules="[requiredRule]"
          outlined
          dense
          aria-labelledby="gender"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiCalendar"
          label="Date of Birth / Geburtsdatum"
          v-model="formData.date_of_birth"
          type="date"
          :rules="[requiredRule]"
          outlined
          dense
          aria-labelledby="date-of-birth"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiCity"
          label="City of Birth / Geburtsort"
          v-model="formData.city_of_birth"
          :rules="[requiredRule]"
          outlined
          dense
          aria-labelledby="city-of-birth"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiHomeMapMarker"
          label="Address / Adresse"
          v-model="formData.address"
          :rules="[requiredRule]"
          outlined
          dense
          aria-labelledby="address"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiNumeric"
          label="Postal Code / Postleitzahl"
          v-model="formData.postal_code"
          :rules="[requiredRule, postalCodeRule]"
          outlined
          dense
          aria-labelledby="postal-code"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiFlag"
          label="Nationality / Nationalität"
          v-model="formData.nationality"
          :rules="[requiredRule]"
          outlined
          dense
          aria-labelledby="nationality"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiPhone"
          label="Telephone Number / Telefonnummer"
          v-model="formData.telephone_number"
          :rules="[requiredRule, phoneRule]"
          outlined
          dense
          aria-labelledby="telephone-number"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiHospital"
          label="Health Insurance / Krankenversicherung"
          v-model="formData.health_insurance"
          :rules="[requiredRule]"
          outlined
          dense
          aria-labelledby="health-insurance"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :prepend-icon="icons.mdiBank"
          label="IBAN"
          v-model="formData.iban"
          :rules="[requiredRule, ibanRule]"
          outlined
          dense
          aria-labelledby="iban"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          label="Married / Verheiratet"
          v-model="formData.married"
          aria-labelledby="married"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          label="Previous Employment at Universities / Vorherige Anstellung an Universitäten"
          v-model="formData.previous_employment"
          aria-labelledby="previous-employment"
        />
      </v-col>
      <v-col cols="12" md="6" v-if="formData.previous_employment">
        <v-text-field
          :prepend-icon="icons.mdiClock"
          label="Duration / Zeitraum"
          v-model="formData.prev_emp_duration"
          :rules="formData.previous_employment ? [requiredRule] : []"
          outlined
          dense
          placeholder="DD.MM.YYYY – DD.MM.YYYY"
          aria-labelledby="duration"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { mdiAccount, mdiGenderMaleFemale, mdiCity, mdiHomeMapMarker, mdiNumeric, mdiFlag, mdiPhone, mdiHospital, mdiBank,mdiCalendar,  mdiClock,mdiAccountBox } from '@mdi/js';

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
