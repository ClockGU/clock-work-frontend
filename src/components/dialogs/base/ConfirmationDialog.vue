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
          {{ $t('actions.cancel') }}
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
import VueI18n from '@/plugins/i18n';
import { computed, onBeforeUnmount, ref, watch } from 'vue';

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
    default: () => VueI18n.global.t('actions.confirm'),
  },
  action: {
    type: Function,
    default: () => {},
  },

  /**
   * NEW: If > 0, the confirm button is disabled for this amount of time
   * after the dialog opens.
   */
  confirmDelayMs: {
    type: Number,
    default: 0,
  },

  /**
   * NEW: Show countdown next to actionText while waiting.
   */
  showCountdownInActionText: {
    type: Boolean,
    default: true,
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

  const delay = Math.max(0, Number(props.confirmDelayMs || 0));
  remainingMs.value = delay;

  if (delay <= 0) return;

  const startedAt = Date.now();
  intervalId = setInterval(() => {
    const elapsed = Date.now() - startedAt;
    remainingMs.value = Math.max(0, delay - elapsed);
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
  if (!props.showCountdownInActionText || remainingMs.value <= 0) {
    return props.actionText;
  }
  return `${props.actionText} (${remainingSeconds.value})`;
});

const close = () => (model.value = false);

const handleAction = () => {
  if (isActionDisabled.value) return;
  return props.action();
};
</script>
