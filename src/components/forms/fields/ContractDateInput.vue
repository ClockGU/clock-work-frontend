<template>
  <div>
    <label :for="id">{{ label }}</label>

    <v-date-input
      :id="id"
      v-model="model"
      :prepend-icon="prependIcon"
      :display-format="displayFormat"
      :input-format="inputFormat"
      :output-format="outputFormat"
      :placeholder="placeholder"
      :aria-label="label"
      :rules="rules"
      :allowed-dates="allowedDates"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const model = defineModel({
  type: [String, Date],
  default: null,
})

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: v => ['start', 'end'].includes(v),
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
})

const id = computed(() =>
  props.type === 'start' ? 'startDate' : 'endDate'
)

function allowedDates(date) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return false

  const day = d.getDate()

  if (props.type === 'start') {
    return day === 1 || day === 16
  }

  if (props.type === 'end') {
    const lastDayOfMonth = new Date(
      d.getFullYear(),
      d.getMonth() + 1,
      0
    ).getDate()

    return day === 15 || day === lastDayOfMonth
  }

  return true
}
</script>

<style scoped>
label {
  font-weight: 500;
  font-size: 1rem;
  margin-left: 2.5rem;
}
</style>
