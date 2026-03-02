<template>
  <div>
    <label :for="type === 'start' ? 'startDate' : 'endDate'">{{ label }}</label>

    <v-date-input
      :id="type === 'start' ? 'startDate' : 'endDate'"
      v-model="model"
      :prepend-icon="prependIcon"
      :display-format="displayFormat"
      :input-format="inputFormat"
      :output-format="outputFormat"
      :placeholder="placeholder"
      :aria-label="label"
      :rules="rules"
      :allowed-dates="type === 'start' ? allowedStartDates : allowedEndDates"
    />
  </div>
</template>

<script setup>
import { isLastDayOfMonth, getDate } from 'date-fns';

const model = defineModel({
  type: [String, Date],
  default: null,
});

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (v) => ['start', 'end'].includes(v),
  },
  label: {
    type: String,
    default: '',
  },
  prependIcon: {
    type: String,
    default: 'mdi-calendar',
  },
  displayFormat: {
    type: String,
    default: 'dd.MM.yyyy',
  },
  inputFormat: {
    type: String,
    default: 'dd.MM.yyyy',
  },
  outputFormat: {
    type: String,
    default: 'dd-MM-yyyy',
  },
  placeholder: {
    type: String,
    default: 'DD.MM.YYYY',
  },
  rules: {
    type: Array,
    default: () => [],
  },
});

const allowedStartDates = (val) => {
  const day = getDate(val);
  return day === 1 || day === 16;
};

const allowedEndDates = (val) => {
  const day = getDate(val);
  return day === 15 || isLastDayOfMonth(val);
};
</script>

<style scoped>
label {
  font-weight: 500;
  font-size: 1rem;
  margin-left: 2.5rem;
}
</style>
