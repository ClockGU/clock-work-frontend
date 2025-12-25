<template>
  <v-container class="mx-4" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <header>
          <h2
            id="main-heading"
            class="text-center text-h5 text-sm-h4 font-weight-medium mb-8"
          >
            {{ headerMessage }}
          </h2>
        </header>

        <main>
          <!-- Loading State -->
          <template v-if="isLoading">
            <v-card
              class="mb-4"
              elevation="2"
              role="region"
              aria-labelledby="loading-message"
            >
              <v-skeleton-loader type="card" />
              <p id="loading-message" class="sr-only">
                {{ $t('app.loading') }}
              </p>
            </v-card>
          </template>

          <!-- Petition Content (when loaded and available) -->
          <template v-else-if="petition">
            <section>
              <v-card
                class="d-flex flex-column align-center"
                elevation="2"
                role="region"
                aria-labelledby="petition-data-heading"
                tabindex="0"
              >
                <v-card-title>
                  <h3
                    id="petition-data-heading"
                    class="text-h4 font-weight-medium my-4"
                  >
                    {{ $t('approverView.petitionData') }}
                  </h3>
                </v-card-title>
                <v-card-text>
                  <PetitionTable :petition="petition" />
                </v-card-text>
              </v-card>
            </section>

            <section
              class="d-flex justify-space-around mt-6 ga-4"
              role="region"
            >
              <v-btn
                color="error"
                size="large"
                class="px-10"
                @click="handleRejection"
                :aria-label="$t('actions.reject')"
              >
                {{ $t('actions.reject') }}
              </v-btn>
              <v-btn
                color="warning"
                size="large"
                class="px-8"
                @click="showPetitionRevisionDialog = true"
                :aria-label="$t('actions.requestChange')"
              >
                {{ $t('actions.requestChange') }}
              </v-btn>
              <v-btn
                color="success"
                size="large"
                class="px-10"
                @click="handleApproval"
                :aria-label="$t('actions.approve')"
              >
                {{ $t('actions.approve') }}
              </v-btn>
            </section>
          </template>
          <!-- No Petition Available State -->
          <template v-else>
            <v-card
              class="text-center py-8"
              elevation="2"
              role="region"
              aria-labelledby="no-petition-message"
            >
              <h3 class="text-h5 mb-4" id="no-petition-message">
                {{ $t('approverView.noPetition') }}
              </h3>
              <p class="text-body-1 mb-4">{{ noPetitionMessage }}</p>
            </v-card>
          </template>
        </main>
      </v-col>
    </v-row>

    <!-- Petition Revision Dialog -->
    <PetitionRevisionDialog
      v-if="petition"
      :petition="petition"
      v-model="showPetitionRevisionDialog"
      @close="handleDialogClose"
      @refresh="markPetitionRevisionAsComplete"
    />
  </v-container>
</template>

<script setup>
import { PETITION_STATUS } from '@/utils/statusUtils';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import ContentApiService from '@/services/contentApiService';
import PetitionTable from '@/components/tables/base/PetitionTable.vue';
import PetitionRevisionDialog from '@/components/dialogs/PetitionRevisionDialog.vue';

const { t } = useI18n();
const route = useRoute();
const store = useStore();

const petitionId = route.query.petition_id;
const signature = route.query.signature;
const budgetPositionId = route.query.budget_position_id;

const petition = ref(null);
const isLoading = ref(true);
const actionCompleted = ref(false);
const showPetitionRevisionDialog = ref(false);

const headerMessage = computed(() =>
  actionCompleted.value
    ? t('approverView.headerComplete')
    : t('approverView.header')
);
const noPetitionMessage = computed(() =>
  actionCompleted.value
    ? t('approverView.noPetitionComplete')
    : t('approverView.noPetition')
);

const markPetitionRevisionAsComplete = () => {
  actionCompleted.value = true;
  petition.value = null;
};
const fetchPetition = async () => {
  try {
    isLoading.value = true;
    actionCompleted.value = false;
    const response = await ContentApiService.get(
      `/approver/petitions/${petitionId}/${signature}`
    );
    petition.value = response.data;
  } catch (err) {
    console.error(err);
    const errorMessage = err.response?.data?.detail
      ? err.response.data.detail
      : t('errors.approverView.loadPetitionError');
    store.dispatch('snackbar/setErrorSnacks', {
      message: errorMessage,
    });
  } finally {
    isLoading.value = false;
  }
};

const handleApproval = async () => {
  try {
    isLoading.value = true;
    await ContentApiService.patch(
      `/approver/petitions/${petitionId}/${signature}/${budgetPositionId}`,
      {
        budget_position_approved: true,
      }
    );
    store.dispatch('snackbar/setSnack', {
      message: t('approverView.approveSuccess'),
    });
    actionCompleted.value = true;
    petition.value = null;
  } catch (error) {
    console.error('Error accepting petition:', error);
    const errorMessage = error.response?.data?.detail
      ? error.response.data.detail
      : t('errors.approverView.approveError');
    store.dispatch('snackbar/setErrorSnacks', {
      message: errorMessage,
    });
  } finally {
    isLoading.value = false;
  }
};

const handleRejection = async () => {
  try {
    isLoading.value = true;
    await ContentApiService.patch(
      `/approver/petitions/${petitionId}/${signature}/${budgetPositionId}`,
      {
        budget_position_approved: false,
        revision_requested: false,
      }
    );
    store.dispatch('snackbar/setSnack', {
      message: t('approverView.rejectSuccess'),
    });
    actionCompleted.value = true;
    petition.value = null;
  } catch (error) {
    console.error('Error rejecting petition:', error);
    const errorMessage = error.response?.data?.detail
      ? error.response.data.detail
      : t('errors.approverView.rejectError');
    store.dispatch('snackbar/setErrorSnacks', {
      message: errorMessage,
    });
  } finally {
    isLoading.value = false;
  }
};

const handleDialogClose = () => {
  showPetitionRevisionDialog.value = false;
};

onMounted(() => {
  fetchPetition();
});
</script>
