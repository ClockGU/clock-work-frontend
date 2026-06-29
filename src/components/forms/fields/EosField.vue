<template>
  <div>
    <label for="eosNumber">{{ $t('petition.eosNumber') }}</label>

    <v-text-field
      id="eosNumber"
      v-model="eosNumber"
      outlined
      dense
      placeholder="F123456"
      :rules="[requiredRule, eosRule]"
    >
      <template #prepend>
        <div class="d-flex align-center me-2">
          <v-icon :icon="icons.mdiAlphaF" size="small" />
          <v-icon :icon="icons.mdiNumeric" size="small" class="ml-n2" />
        </div>
      </template>
      <template #append-inner>
        <v-btn
          variant="plain"
          flat
          icon
          class="help-icon"
          @click="tooltip = !tooltip"
          v-click-outside="onClickOutside"
        >
          <v-icon :icon="icons.mdiHelpCircleOutline" />
          <v-tooltip
            v-model="tooltip"
            :text="$t('petition.hint.eosNumber')"
            location="bottom"
            activator="parent"
            :open-on-hover="false"
            max-width="180"
            :offset="[20, -30]"
          >
          </v-tooltip>
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<script setup>
import { mdiNumeric, mdiAlphaF, mdiHelpCircleOutline } from '@mdi/js';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const eosNumber = defineModel({
  type: [String, null],
  default: null,
});

const icons = {
  mdiNumeric,
  mdiAlphaF,
  mdiHelpCircleOutline,
};

const { t } = useI18n();
const tooltip = ref(false);

function onClickOutside() {
  tooltip.value = false;
}

const requiredRule = (v) => !!v || t('validationRule.required');
const eosRule = (v) => /^F\d{6}$/.test(v) || t('validationRule.eosNumber');
</script>

<style scoped>
label {
  display: block;
  font-weight: 500;
  font-size: 1rem;
  margin-left: 2.5rem;
  margin-bottom: 4px;
}

.help-icon {
  cursor: help;
  opacity: 0.8;
}

.help-icon:hover {
  opacity: 1;
}
:deep(.v-input--horizontal .v-input__prepend) {
  margin-inline-end: 0px;
}
</style>
