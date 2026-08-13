<template>
  <div>
    <v-radio-group
      ref="radio"
      id="timeException"
      v-model="exception"
      inline
      :label="$t('petition.timeExceCourse')"
      :aria-label="$t('petition.timeExceCourse')"
      :rules="exceptionRules"
      :disabled="disabled"
    >
      <v-radio
        :label="$t('petition.timeExceReasonStudentWish')"
        :value="1"
        @click="handleReselect(1)"
      ></v-radio>
      <v-radio
        :label="$t('petition.timeExceReasonStudentCourse')"
        class="ml-8"
        :value="2"
        @click="handleReselect(2)"
      >
      </v-radio>
    </v-radio-group>
    <div v-if="exception" class="mx-4">
      <label for="timeExceName" class="ml-8">
        {{ $t('petition.timeExceName') }}
      </label>
      <v-text-field
        id="timeExceName"
        v-model="name"
        outlined
        dense
        class="ml-8"
        :aria-label="$t('petition.timeExceName')"
        :rules="[requiredRule]"
      />

      <label for="timeExecActualTime">
        {{ $t('petition.timeExecActualTime') }}
      </label>
      <v-text-field
        id="timeExecActualTime"
        v-model="time"
        type="number"
        outlined
        dense
        :prepend-icon="icons.mdiClock"
        :aria-label="$t('petition.timeExecActualTime')"
        :rules="[requiredRule, positiveNumberRule]"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { mdiClock } from '@mdi/js';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

const exception = defineModel('exception', {
  type: [Number, null],
  default: null,
});
const name = defineModel('name', { type: String, default: '' });
const time = defineModel('time', { type: [String, Number], default: '' });

const emit = defineEmits(['update:exception']);
const { t } = useI18n();

const radio = ref(null);
const icons = { mdiClock };

const requiredRule = (v) => !!v || t('validationRule.required');
const positiveNumberRule = (v) =>
  Number(v) > 0 || t('validationRule.positiveNumber');

async function handleReselect(value) {
  if (value === exception.value) {
    emit('update:exception', null);
    await radio.value.reset()
    await radio.value.validate();

    return;
  }
  emit('update:exception', value);
}

const exceptionRules = computed(() => [
  (v) =>
    !props.required || !!v || t('validationRule.timeExceptionRequired'),
]);

// Reset fields when unchecked
watch(
  () => exception.value,
  (value) => {
    if (!value) {
      name.value = '';
      time.value = '';
    }
  }
);
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
