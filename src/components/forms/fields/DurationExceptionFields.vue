<template>
  <div>
    <v-checkbox
      id="durationException"
      v-model="exception"
      :label="$t('petition.durationException')"
      :aria-label="$t('petition.durationException')"
      :rules="exceptionRules"
    />

    <div v-if="exception" class="mx-4">
      <label for="durationExceName" class="ml-8">
        {{ $t('petition.durationExceName') }}
      </label>
      <v-text-field
        id="durationExceName"
        v-model="name"
        outlined
        dense
        class="ml-8"
        :aria-label="$t('petition.durationExceName')"
        :rules="[requiredRule]"
      />

      <label for="durationExceStart" class="ml-8">
        {{ $t('petition.durationExceStart') }}
      </label>
      <v-date-input
        id="durationExceStart"
        v-model="start"
        :display-format="displayDate"
        input-format="dd.mm.yyyy"
        output-format="dd-MM-yyyy"
        placeholder="DD.MM.YYYY"
        :aria-label="$t('petition.durationExceStart')"
        :rules="[requiredRule]"
      />

      <label for="durationExceEnd" class="ml-8">
        {{ $t('petition.durationExceEnd') }}
      </label>
      <v-date-input
        id="durationExceEnd"
        v-model="end"
        :display-format="displayDate"
        input-format="dd.mm.yyyy"
        output-format="dd-MM-yyyy"
        placeholder="DD.MM.YYYY"
        :aria-label="$t('petition.durationExceEnd')"
        :rules="[requiredRule]"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  displayDate: { type: Function, required: true },
  forceRequired: { type: Boolean, default: false },
});

const exception = defineModel('exception', { type: Boolean, default: false });
const name = defineModel('name', { type: String, default: '' });
const start = defineModel('start', {
  type: [String, Date, null],
  default: null,
});
const end = defineModel('end', { type: [String, Date, null], default: null });

const { t } = useI18n();

const requiredRule = (v) => !!v || t('validationRule.required');

const exceptionRules = computed(() => [
  (v) =>
    !props.forceRequired ||
    !!v ||
    t('validationRule.durationExceptionRequired'),
]);

// Reset fields when unchecked
watch(
  () => exception.value,
  (value) => {
    if (!value) {
      name.value = '';
      start.value = null;
      end.value = null;
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
