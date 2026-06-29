<template>
  <v-dialog
    v-model="model"
    persistent
    :max-width="maxWidth"
    :fullscreen="fullscreen"
  >
    <!-- Optional Activator Slot -->
    <template #activator="props">
      <slot name="activator" v-bind="props"></slot>
    </template>

    <v-card>
      <div class="d-flex justify-end pa-2">
        <v-btn icon variant="text" class="ma-0" @click="close">
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>
      </div>

      <!-- Content Slot  -->
      <v-card-text class="px-8 py-4">
        <slot name="content"></slot>
      </v-card-text>

      <!-- Centered Actions -->
      <v-card-actions class="justify-center mb-4">
        <v-btn
          color="grey-darken-1"
          variant="elevated"
          class="mx-2 mt-2"
          @click="close"
        >
          {{ t('actions.cancel') }}
        </v-btn>

        <v-btn
          color="primary"
          variant="elevated"
          class="mx-2 mt-2"
          :disabled="isActionDisabled"
          @click="handleAction"
        >
          {{ computedActionText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { mdiClose } from '@mdi/js';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  maxWidth: {
    type: [Number, String],
    default: 500,
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
  actionText: {
    type: String,
    default: null,
  },
  action: {
    type: Function,
    default: () => {},
  },
  confirmDelayMs: {
    type: Number,
    default: 0, //0 means no delay
  },
  //Show countdown next to actionText while waiting.
  hideCountdownInActionText: {
    type: Boolean,
    default: false,
  },
});

const icons = { mdiClose };

const model = defineModel({
  type: Boolean,
  default: false,
});

const remainingMs = ref(0);
let intervalId = null;

const clearTimer = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const startTimerIfNeeded = () => {
  clearTimer();
  //if no delay return
  if (props.confirmDelayMs <= 0) return;

  remainingMs.value = props.confirmDelayMs;
  const startedAt = Date.now();
  intervalId = setInterval(() => {
    const elapsed = Date.now() - startedAt;
    remainingMs.value = Math.max(0, props.confirmDelayMs - elapsed);
    if (remainingMs.value <= 0) clearTimer();
  }, 100);
};

watch(
  () => model.value,
  (isOpen) => {
    if (isOpen) startTimerIfNeeded();
    else {
      remainingMs.value = 0;
      clearTimer();
    }
  }
);

onBeforeUnmount(() => clearTimer());

const isActionDisabled = computed(() => remainingMs.value > 0);
const remainingSeconds = computed(() => Math.ceil(remainingMs.value / 1000));

const computedActionText = computed(() => {
  const text = props.actionText ?? t('actions.confirm');
  if (props.hideCountdownInActionText || remainingMs.value <= 0) {
    return text;
  }
  return `${text} (${remainingSeconds.value})`;
});

const close = () => (model.value = false);

const handleAction = () => {
  if (isActionDisabled.value) return;
  return props.action();
};
</script>
