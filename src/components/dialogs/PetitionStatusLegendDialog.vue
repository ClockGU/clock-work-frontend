<template>
  <CustomDialog
    :title="$t('petitionStatusDisplayDialog.title')"
    :max-width="600"
  >
    <template #content>
      <v-stepper-vertical
        :model-value="activeStep"
        non-linear
        editable
        hide-actions
        flat
      >
        <v-stepper-vertical-item
          v-for="(item, index) in statusItems"
          :key="item.key"
          :value="index + 1"
          :edit-icon="icons.mdiEye"
        >
          <template #title>
            <div class="d-flex align-center justify-center ga-2 ml-2 mb-2">
              <v-icon :icon="item.icon" :color="item.color" size="25" />
              <span class="font-weight-semibold text-high-emphasis">{{
                item.title
              }}</span>
            </div>
          </template>
          <p class="pa-4">
            {{ item.description }}
          </p>
        </v-stepper-vertical-item>
      </v-stepper-vertical>
    </template>
  </CustomDialog>
</template>

<script setup>
import { computed } from 'vue';
import { mdiEye } from '@mdi/js';
import { useI18n } from 'vue-i18n';
import {
  PETITION_STATUS,
  getStatusDisplayText,
  getStatusDisplayIcon,
  getStatusDisplayColor,
} from '@/utils/statusUtils';
import CustomDialog from '@/components/dialogs/base/CustomDialog.vue';

const props = defineProps({
  currentStatus: {
    type: String,
    default: '',
  },
});

const icons = { mdiEye };
const { t } = useI18n();

// Map statuses to items for the stepper
const statusItems = computed(() =>
  Object.entries(PETITION_STATUS).map(([StatusKey, statusValue], index) => ({
    key: StatusKey,
    value: statusValue,
    title: getStatusDisplayText(statusValue, t),
    description: t(`petitionStatusDisplayDialog.description.${statusValue}`),
    icon: getStatusDisplayIcon(statusValue),
    color: getStatusDisplayColor(statusValue),
    stepNumber: index + 1,
  }))
);

// Compute active step based on currentStatus
const activeStep = computed(() => {
  if (!props.currentStatus) return 1;

  const item = statusItems.value.find(
    (item) => item.value === props.currentStatus
  );
  return item ? item.stepNumber : 1;
});
</script>
