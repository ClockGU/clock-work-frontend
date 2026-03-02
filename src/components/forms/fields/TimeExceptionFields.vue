<template>
  <div>
    <v-checkbox
      id="timeException"
      v-model="exception"
      :label="$t('petition.timeExceCourse')"
      :aria-label="$t('petition.timeExceCourse')"
      :rules="exceptionRules"
    />

    <div v-if="exception" class="mx-4">
      <label for="timeExceName" class="ml-0">
        {{ $t('petition.timeExceName') }}
      </label>
      <v-text-field
        id="timeExceName"
        v-model="name"
        outlined
        dense
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
import { computed, watch } from 'vue';
import { mdiClock } from '@mdi/js';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  forceRequired: { type: Boolean, default: false },
});

const exception = defineModel('exception', { type: Boolean, default: false });
const name = defineModel('name', { type: String, default: '' });
const time = defineModel('time', { type: [String, Number], default: '' });

const { t } = useI18n();

const icons = { mdiClock };

const requiredRule = (v) => !!v || t('validationRule.required');
const positiveNumberRule = (v) =>
  Number(v) > 0 || t('validationRule.positiveNumber');

const exceptionRules = computed(() => [
  (v) =>
    !props.forceRequired || !!v || t('validationRule.timeExceptionRequired'),
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
