<template>
  <v-form ref="form" v-model="isFormValid">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.first_name"
          outlined
          dense
          :prepend-icon="icons.mdiAccount"
          :label="$t('employeeDataForm.firstName')"
          :aria-label="$t('employeeDataForm.firstName')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.last_name"
          outlined
          dense
          :prepend-icon="icons.mdiAccount"
          :label="$t('employeeDataForm.lastName')"
          :aria-label="$t('employeeDataForm.lastName')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="formData.form_of_address"
          outlined
          dense
          :prepend-icon="icons.mdiAccountBox"
          :label="$t('employeeDataForm.formOfAddress')"
          :aria-label="$t('employeeDataForm.formOfAddress')"
          :items="['Mr.', 'Ms.', 'Mrs.', 'Dr.']"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="formData.gender"
          outlined
          dense
          :prepend-icon="icons.mdiGenderMaleFemale"
          :label="$t('employeeDataForm.gender')"
          :aria-label="$t('employeeDataForm.gender')"
          :items="['Male', 'Female', 'Other']"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.date_of_birth"
          type="date"
          outlined
          dense
          :prepend-icon="icons.mdiCalendar"
          :label="$t('employeeDataForm.dateOfBirth')"
          :aria-label="$t('employeeDataForm.dateOfBirth')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.city_of_birth"
          outlined
          dense
          :prepend-icon="icons.mdiCity"
          :label="$t('employeeDataForm.cityOfBirth')"
          :aria-label="$t('employeeDataForm.cityOfBirth')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.address"
          outlined
          dense
          :prepend-icon="icons.mdiHomeMapMarker"
          :label="$t('employeeDataForm.address')"
          :aria-label="$t('employeeDataForm.address')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.postal_code"
          outlined
          dense
          :prepend-icon="icons.mdiNumeric"
          :label="$t('employeeDataForm.postalCode')"
          :rules="[requiredRule, postalCodeRule]"
          :aria-label="$t('employeeDataForm.postalCode')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.nationality"
          outlined
          dense
          :prepend-icon="icons.mdiFlag"
          :label="$t('employeeDataForm.nationality')"
          :aria-label="$t('employeeDataForm.nationality')"
          :rules="[requiredRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.telephone_number"
          outlined
          dense
          :prepend-icon="icons.mdiPhone"
          :label="$t('employeeDataForm.telephoneNumber')"
          :aria-label="$t('employeeDataForm.telephoneNumber')"
          :rules="[requiredRule, phoneRule]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.health_insurance"
          :prepend-icon="icons.mdiHospital"
          :label="$t('employeeDataForm.healthInsurance')"
          :aria-label="$t('employeeDataForm.healthInsurance')"
          :rules="[requiredRule]"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.iban"
          outlined
          dense
          :prepend-icon="icons.mdiBank"
          :label="$t('employeeDataForm.iban')"
          :aria-label="$t('employeeDataForm.iban')"
          :rules="[requiredRule, ibanRule]"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="formData.married"
          :label="$t('employeeDataForm.married')"
          :aria-label="$t('employeeDataForm.married')"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="formData.previous_employment"
          :label="$t('employeeDataForm.previousEmployment')"
          :aria-label="$t('employeeDataForm.previousEmployment')"
        />
      </v-col>
      <v-col 
      v-if="formData.previous_employment" 
      cols="12" md="6" >
        <v-text-field
          v-model="formData.prev_emp_duration"
          outlined
          dense
          placeholder="DD.MM.YYYY – DD.MM.YYYY"
          :prepend-icon="icons.mdiClock"
          :label="$t('employeeDataForm.duration')"
          :aria-label="$t('employeeDataForm.duration')"
          :rules="formData.previous_employment ? [requiredRule] : []"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { mdiAccount, mdiGenderMaleFemale, mdiCity, mdiHomeMapMarker, mdiNumeric, mdiFlag, mdiPhone, mdiHospital, mdiBank, mdiCalendar, mdiClock, mdiAccountBox } from '@mdi/js';
import ContentApiService from '@/services/contentApiService';

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
const { t } = useI18n();
const initialFormData = {
  id: '',
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
};

const formData = ref({ ...initialFormData });
const isFormValid = ref(false);
const fetchEmployeeData = async () => {
  try{
    const response = await ContentApiService.get('/employees');
    if (response.data) {
      formData.value = { ...initialFormData, ...response.data };
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error fetching employee data:', error);
        store.dispatch('snackbar/setErrorSnacks', {
          message: t("errors.studentData.fetchingData"),
        });
      }
    }
}
onMounted(() => {
  fetchEmployeeData();
});

// Validation Rules
const requiredRule = (v) => !!v || 'This field is required';
const postalCodeRule = (v) => /^\d{5}$/.test(v) || 'Postal code must be 5 digits';
const phoneRule = (v) => /^\d{10,15}$/.test(v) || 'Invalid phone number';
const ibanRule = (v) => /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(v) || 'Invalid IBAN';
// Validation Rules
defineExpose({ formData,isFormValid });
</script>


