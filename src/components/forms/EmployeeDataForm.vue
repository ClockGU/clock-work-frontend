<template>

      <v-form ref="form">
        <v-row>
          <!-- Personal Information -->
          <v-col cols="12" md="6">
            <v-text-field
              label="First Name / Vorname"
              v-model="formData.first_name"
              outlined
              dense
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Last Name / Nachname"
              v-model="formData.last_name"
              outlined
              dense
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              label="Form of Address / Anrede"
              v-model="formData.form_of_address"
              :items="['Mr.', 'Ms.', 'Mrs.', 'Dr.']"
              outlined
              dense
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              label="Gender / Geschlecht"
              v-model="formData.gender"
              :items="['Male', 'Female', 'Other']"
              outlined
              dense
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Date of Birth / Geburtsdatum"
              v-model="formData.date_of_birth"
              type="date"
              outlined
              dense
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="City of Birth / Geburtsort"
              v-model="formData.city_of_birth"
              outlined
              dense
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Address / Adresse"
              v-model="formData.address"
              outlined
              dense
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Postal Code / Postleitzahl"
              v-model="formData.postal_code"
              outlined
              dense
              required
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              label="Nationality / Nationalität"
              v-model="formData.nationality"
              outlined
              dense
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Telephone Number / Telefonnummer"
              v-model="formData.telephone_number"
              outlined
              dense
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Health Insurance / Krankenversicherung"
              v-model="formData.health_insurance"
              outlined
              dense
              required
            />
          </v-col>
            
          <!-- IBAN -->
          <v-col cols="12" md="6">
            <v-text-field
              label="IBAN"
              v-model="formData.iban"
              outlined
              dense
              required
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
              outlined
              dense
              required
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
  
  // Initial form data
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
  
  defineExpose({ formData });
</script>