<script setup>
import { mdiMinus, mdiPlus } from '@mdi/js';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { format } from 'date-fns';
import ContentApiService from '@/services/contentApiService';
import { useStore } from 'vuex';

const icons = {
  mdiPlus,
  mdiMinus,
};
const { t } = useI18n();
const store = useStore();

const props = defineProps({
  initialEmploymentData: {
    type: Array,
    default: () => [
      {
        id: undefined,
        start: undefined,
        end: undefined,
        notGuEmployment: false,
        employerName: undefined,
        proof: undefined,
      },
    ],
  },
});
const hasPrevEmployment = ref(false);
const prevEmployments = ref(null);
const isSaving = ref(false);

const initialSnapshots = ref(new Map());

const allEmploymentsFilledOut = computed(() =>
  prevEmployments.value.every((item) => allFieldsProvided(item))
);
const isFormValid = computed(() =>
  hasPrevEmployment.value ? allEmploymentsFilledOut.value : true
);

function normalizedDate(value) {
  return value instanceof Date ? format(value, 'yyyy-MM-dd') : value;
}

function hasEntryChanged(entry) {
  if (!entry.id) return true; // never saved before, always needs to be created
  const original = initialSnapshots.value.get(entry.id);
  if (!original) return true;
  return (
    normalizedDate(entry.start) !== normalizedDate(original.start) ||
    normalizedDate(entry.end) !== normalizedDate(original.end) ||
    entry.notGuEmployment !== original.notGuEmployment ||
    entry.employerName !== original.employerName
  );
}

function allFieldsProvided(object) {
  return (
    object.start &&
    object.end &&
    object.proof &&
    (object.notGuEmployment ? !!object.employerName : true)
  );
}

function addEntry() {
  prevEmployments.value.push({
    start: undefined,
    end: undefined,
    notGuEmployment: false,
    employerName: undefined,
    proof: undefined,
  });
}

async function removeEntry(index) {
  const prevEmployment = prevEmployments.value[index];
  if (prevEmployment.id) {
    const success = await deletePrevEmployment(prevEmployment);
    if (success) {
      prevEmployments.value.splice(index, 1);
    }
  } else {
    prevEmployments.value.splice(index, 1);
  }
}

const deletePrevEmployment = async (prevEmployment) => {
  try {
    isSaving.value = true;
    const response = await ContentApiService.delete(
      `/prev_employments/${prevEmployment.id}`
    );
    return response.status === 204;
  } catch (error) {
    console.error('Error deleting prev_employment:', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.employmentData.deletingEntry'),
    });
    return false;
  } finally {
    isSaving.value = false;
  }
};

watch(
  () => props.initialEmploymentData,
  (newData) => {
    if (newData) {
      // clone so editing a field doesn't mutate the prop (and the snapshot below)
      prevEmployments.value = newData.map((entry) => ({ ...entry }));
      hasPrevEmployment.value = true;
      initialSnapshots.value = new Map(
        prevEmployments.value
          .filter((entry) => entry.id)
          .map((entry) => [entry.id, { ...entry }])
      );
    } else {
      prevEmployments.value = [
        {
          id: undefined,
          start: undefined,
          end: undefined,
          notGuEmployment: false,
          employerName: undefined,
          proof: undefined,
        },
      ];
      initialSnapshots.value = new Map();
    }
  },
  { immediate: true }
);

defineExpose({
  prevEmployments,
  isFormValid,
  allFieldsProvided,
  hasEntryChanged,
});
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-checkbox
        id="previousEmployment"
        v-model="hasPrevEmployment"
        :label="$t('employeeData.previousEmployment')"
        :aria-label="$t('employeeData.previousEmployment')"
        :error="!isFormValid"
        :error-messages="!isFormValid ? ['enter stuff or deselect'] : []"
      />
      <v-alert v-if="hasPrevEmployment" type="warning">
        Warning: By deselecting the checkbox you <strong>DELETE</strong> all
        entries below.
      </v-alert>
    </v-col>
  </v-row>
  <div v-if="hasPrevEmployment">
    <v-row v-for="(entry, i) in prevEmployments" :key="10 + i">
      <v-col cols="6">
        <v-date-input
          v-model="entry.start"
          input-format="dd.MM.yyyy"
          label="start"
        ></v-date-input>
        <v-date-input
          v-model="entry.end"
          input-format="dd.MM.yyyy"
          class="my-auto"
          label="end"
        ></v-date-input>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          v-model="entry.notGuEmployment"
          label="Employment not at GU?"
        ></v-checkbox>
        <v-text-field
          v-model="entry.employerName"
          :disabled="!entry.notGuEmployment"
          label="Employer name"
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="d-flex">
        <v-file-input
          v-model="entry.proof"
          label="Proof of employment"
          name="name"
        >
          <template v-if="typeof entry.proof === 'string'" #selection>
            <span>{{ entry.proof }}</span>
          </template>
        </v-file-input>
        <div class="d-flex align-center ga-2 mx-4 mb-4">
          <v-btn
            v-if="i === 0"
            :icon="icons.mdiPlus"
            :disabled="prevEmployments.length === 4 || isSaving"
            :loading="isSaving"
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
            :loading="isSaving"
            :disabled="isSaving"
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
</template>

<style scoped></style>
