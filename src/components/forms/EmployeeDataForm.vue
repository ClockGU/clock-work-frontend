<template>
  <v-form ref="form" v-model="isFormValid">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          label="First Name / Vorname"
          v-model="formData.first_name"
          :rules="[requiredRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Last Name / Nachname"
          v-model="formData.last_name"
          :rules="[requiredRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          label="Form of Address / Anrede"
          v-model="formData.form_of_address"
          :items="['Mr.', 'Ms.', 'Mrs.', 'Dr.']"
          :rules="[requiredRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          label="Gender / Geschlecht"
          v-model="formData.gender"
          :items="['Male', 'Female', 'Other']"
          :rules="[requiredRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Date of Birth / Geburtsdatum"
          v-model="formData.date_of_birth"
          type="date"
          :rules="[requiredRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="City of Birth / Geburtsort"
          v-model="formData.city_of_birth"
          :rules="[requiredRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Address / Adresse"
          v-model="formData.address"
          :rules="[requiredRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Postal Code / Postleitzahl"
          v-model="formData.postal_code"
          :rules="[requiredRule, postalCodeRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Nationality / Nationalität"
          v-model="formData.nationality"
          :rules="[requiredRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Telephone Number / Telefonnummer"
          v-model="formData.telephone_number"
          :rules="[requiredRule, phoneRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Health Insurance / Krankenversicherung"
          v-model="formData.health_insurance"
          :rules="[requiredRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="IBAN"
          v-model="formData.iban"
          :rules="[requiredRule, ibanRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          label="Married / Verheiratet"
          v-model="formData.married"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          label="Previous Employment at Universities / Vorherige Anstellung an Universitäten"
          v-model="formData.previous_employment"
        />
      </v-col>
      <v-col cols="12" md="6" v-if="formData.previous_employment">
        <v-text-field
          label="Duration / Zeitraum"
          v-model="formData.prev_emp_duration"
          :rules="formData.previous_employment ? [requiredRule] : []"
          outlined
          dense
          placeholder="DD.MM.YYYY – DD.MM.YYYY"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

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