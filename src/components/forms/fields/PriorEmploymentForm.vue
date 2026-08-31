<script setup>
import { mdiMinus, mdiPlus } from '@mdi/js';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const icons = {
  mdiPlus,
  mdiMinus,
};
const { t } = useI18n();

const props = defineProps({
  initialEmploymentData: {
    type: Array,
    default: () => [
      {
        from: undefined,
        to: undefined,
        notGuEmployment: false,
        employerName: undefined,
        proof: undefined,
      },
    ],
  },
});
const hasPrevEmployment = ref(false);
const prevEmployments = ref(null);
const isFormValid = ref(null);

function allFieldsProvided(object) {
  return (
    object.from &&
    object.to &&
    object.proof &&
    (object.notGuEmployment ? !!object.employerName : true)
  );
}
const allEmploymentsFilledOut = computed(() =>
  prevEmployments.value.every((item) => allFieldsProvided(item))
);
const contentInputProvided = () =>
  hasPrevEmployment.value ? allEmploymentsFilledOut.value : true;

watch(
  () => props.initialEmploymentData,
  (newData) => {
    if (newData) {
      prevEmployments.value = newData;
      hasPrevEmployment.value = true;
    } else {
      prevEmployments.value = [
        {
          from: undefined,
          to: undefined,
          notGuEmployment: false,
          employerName: undefined,
          proof: undefined,
        },
      ];
    }
  },
  { immediate: true }
);

function addEntry() {
  prevEmployments.value.push({
    from: undefined,
    to: undefined,
    notGuEmployment: false,
    employerName: undefined,
    proof: undefined,
  });
}

function removeEntry(index) {
  prevEmployments.value.splice(index, 1);
}

defineExpose({ prevEmployments, isFormValid });
</script>

<template>
  <v-form ref="form" v-model="isFormValid">
    <p> Everything filled out: {{ allEmploymentsFilledOut }}</p>
    <v-row>
      <v-col cols="12">
        <v-checkbox
          id="previousEmployment"
          v-model="hasPrevEmployment"
          :label="$t('employeeData.previousEmployment')"
          :aria-label="$t('employeeData.previousEmployment')"
          :rules="[contentInputProvided]"
        />
      </v-col>
    </v-row>
    <div v-if="hasPrevEmployment">
      <v-row v-for="(entry, i) in prevEmployments" :key="10 + i">
        <v-col cols="6">
          <v-date-input
            v-model="entry.from"
            :rules="[contentInputProvided]"
            label="from"
          ></v-date-input>
          <v-date-input
            v-model="entry.to"
            :rules="[contentInputProvided]"
            class="my-auto"
            label="to"
          ></v-date-input>
        </v-col>
        <v-col cols="6">
          <v-checkbox
            v-model="entry.notGuEmployment"
            :rules="[contentInputProvided]"
            label="Employment not at GU?"
          ></v-checkbox>
          <v-text-field
            v-model="entry.employerName"
            :rules="[contentInputProvided]"
            :disabled="!entry.notGuEmployment"
            label="Employer name"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="d-flex">
          <v-file-input
            v-model="entry.proof"
            :rules="[contentInputProvided]"
            label="Proof of employment"
          ></v-file-input>
          <div class="d-flex align-center ga-2 mx-4 mb-4">
            <v-btn
              v-if="i === 0"
              :icon="icons.mdiPlus"
              :disabled="prevEmployments.length === 4"
              variant="tonal"
              rounded="sm"
              size="small"
              color="primary"
              @click="addEntry"
            />
            <v-btn
              v-else
              :icon="icons.mdiMinus"
              variant="tonal"
              rounded="sm"
              size="small"
              color="error"
              @click="removeEntry(i)"
            />
          </div>
        </v-col>
        <v-col v-if="prevEmployments.length === 4 && i === 0">
          <v-alert type="warning">
            Only 4 prior employemnts can be added. In case of more prior
            employments pleas contact [Support]
          </v-alert>
        </v-col>
      </v-row>
    </div>
  </v-form>
</template>

<style scoped></style>
