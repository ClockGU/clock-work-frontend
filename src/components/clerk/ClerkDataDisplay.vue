<template>
  <v-card class="pa-4 w-100" elevation="2">
    <v-card-title class="mt-2 mb-4">
      {{ $t('petitionDataDisplay.title') }}
    </v-card-title>
    <v-card-text>
      <v-row class="mb-6">
        <v-col cols="12" md="6" class="d-flex flex-column">
          <ClerkFreeFormData
            class="flex-grow-1"
            style="overflow-y: auto"
            :petition="petition"
            :revision-disabled="disabledRevisionButton"
            @close="emit('close')"
            @refresh="handleRefresh"
          />
          <PrevEmploymentTable
            :employment-data="employmentData"
          ></PrevEmploymentTable>
        </v-col>
        <v-col cols="12" md="6" class="d-flex flex-column">
          <ClerkUploadedFiles class="flex-grow-1" :petition="petition" />
        </v-col>
      </v-row>
      <div class="d-flex justify-space-around mt-6">
        <v-btn
          color="warning"
          size="large"
          class="px-6"
          :disabled="disabledRevisionButton"
          @click="showRevisionDialog = true"
        >
          {{ $t('actions.requestChange') }}
        </v-btn>
        <v-btn
          color="success"
          size="large"
          class="px-10"
          :disabled="disabledApproveButton"
          @click="approve"
        >
          {{
            petition && petition.status === PETITION_STATUS.AWAITING_SIGNATURE
              ? $t('actions.finishProcess')
              : $t('actions.approve')
          }}
        </v-btn>
      </div>
    </v-card-text>

    <PetitionRevisionDialog
      v-model="showRevisionDialog"
      :petition="petition"
      @close="showRevisionDialog = false"
    />
  </v-card>
</template>

<script setup>
import { PETITION_STATUS } from '@/utils/statusUtils';
import { ref, computed, watch } from 'vue';
import PetitionRevisionDialog from '../dialogs/PetitionRevisionDialog.vue';
import ClerkUploadedFiles from '@/components/clerk/ClerkUploadedFiles.vue';
import ClerkFreeFormData from '@/components/clerk/ClerkFreeFormData.vue';
import PrevEmploymentTable from '@/components/tables/PrevEmploymentTable.vue';
import { useStore } from 'vuex';
import ContentApiService from '@/services/contentApiService';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  petition: {
    type: [Object, null],
    required: false,
  },
});

const emit = defineEmits(['close', 'refresh', 'approve']);
const store = useStore();
const { t } = useI18n();

const showRevisionDialog = ref(false);

const disabledApproveButton = computed(
  () =>
    !props.petition ||
    (props.petition.status !== PETITION_STATUS.CLERK_ACTION &&
      props.petition.status !== PETITION_STATUS.AWAITING_SIGNATURE)
);

const disabledRevisionButton = computed(
  () =>
    !props.petition || props.petition.status !== PETITION_STATUS.CLERK_ACTION
);

const approve = () => {
  if (props.petition?.id) emit('approve', props.petition.id);
};

const handleRefresh = (payload) => {
  emit('refresh', payload);
};

const employmentData = ref(undefined);
const isLoadingPrevEmploymentData = ref(false);

const fetchPrevEmploymentData = async () => {
  if (isLoadingPrevEmploymentData.value) return;

  isLoadingPrevEmploymentData.value = true;
  try {
    const response = await ContentApiService.get(
      `/clerk/prev_employments/petition/${props.petition.id}`
    );
    const data = response.data;
    if (data) {
      employmentData.value =
        Array.isArray(data) && data.length > 0 ? data : null;
    }
  } catch (error) {
    if (error.response?.status === 404) {
      employmentData.value = null;
    } else if (error.response?.status !== 404) {
      console.error('Error fetching documents:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: t('errors.studentData.fetchingEmployment'),
      });
    }
  } finally {
    isLoadingPrevEmploymentData.value = false;
  }
};

watch(
  () => props.petition,
  (petition) => petition ? fetchPrevEmploymentData() : null,
  { immediate: true }
);
</script>
