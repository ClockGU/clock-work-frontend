<template>
  <v-container class="mx-4" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <header>
          <h1 class="text-center text-h5 text-sm-h4 font-weight-medium mb-8">
            {{ headerMessage }}
          </h1>
        </header>

        <main>
          <!-- Loading State -->
          <template v-if="isLoading">
            <v-card class="mb-4" elevation="2">
              <v-skeleton-loader
                type="card"
              ></v-skeleton-loader>
            </v-card>
          </template>

          <!-- Petition Content (when loaded and available) -->
          <template v-else-if="petition">
            <section aria-labelledby="petition-data-heading">
              <v-card class="d-flex flex-column align-center" elevation="2">
                <v-card-title>
                  <h2 id="petition-data-heading" class="text-h4 font-weight-medium my-4">
                    {{ $t('approverView.petitionData') }}
                  </h2>
                </v-card-title>
                <v-card-text>
                  <PetitionTableWithActions
                    :petition="petition"
                    aria-labelledby="petition-data-heading"
                  />
                </v-card-text>
              </v-card>
            </section>

            <section aria-label="Approval actions" class="d-flex justify-space-around mt-6 ga-4">
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
                color="success" 
                size="large" 
                class="px-10" 
                @click="handleApproval"
                :aria-label="$t('actions.approve') "
              >
                {{ $t('actions.approve') }}
              </v-btn>
            </section>
          </template>
          <!-- No Petition Available State -->
          <template v-else>
            <v-card class="text-center py-8" elevation="2">
              <h2 class="text-h5 mb-4">{{ $t('approverView.noPetition') }}</h2>
              <p class="text-body-1 mb-4">{{ noPetitionMessage }}</p>
            </v-card>
          </template>
        </main>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import ContentApiService from '@/services/contentApiService';
import PetitionTableWithActions from '@/components/tables/PetitionTableWithActions.vue';

const { t } = useI18n();
const route = useRoute();
const store = useStore();

const petitionId = route.query.petition_id;
const signature = route.query.signature;
const budgetPositionId= route.query.budget_position_id ;

const petition = ref(null);
const isLoading = ref(true);
const actionCompleted = ref(false);

const headerMessage = computed(() => actionCompleted.value ? t('approverView.headerComplete') : t('approverView.header'));
const noPetitionMessage = computed(() => actionCompleted.value ? t('approverView.noPetitionComplete') : t('approverView.noPetition'));
const user= computed(() => store.getters['auth/user']);

const fetchPetition = async () => {
  try {
    isLoading.value = true;
    actionCompleted.value = false;
    const response = await ContentApiService.get(`/approver/petitions/${petitionId}`);
    petition.value = response.data;
  } catch (err) {
    console.error(err);
    store.dispatch("snackbar/setErrorSnacks", {
      message: t('errors.approverView.loadPetitionError')
    });
  } finally {
    isLoading.value = false;
  }
};

const handleApproval = async () => {
  try {
    isLoading.value = true;
    await ContentApiService.patch(`/approver/petitions/${petitionId}/${signature}/${budgetPositionId}`, { 
      status: "student_action",
      budget_position_status: "approved",
     });
    store.dispatch("snackbar/setSnack", {
      message: t('approverView.approveSuccess')
    });
    actionCompleted.value = true;
    petition.value = null;
  } catch (error) {
    console.error("Error accepting petition:", error);
    store.dispatch("snackbar/setErrorSnacks", {
      message: t('errors.approverView.approveError')
    });
  } finally {
    isLoading.value = false;
  }
};
const handleRejection = async () => {
  try {
    isLoading.value = true;
    await ContentApiService.patch(`/approver/petitions/${petitionId}/${signature}/${budgetPositionId}`, { 
      budget_position_status: "rejected",});
    store.dispatch("snackbar/setSnack", {
      message: t('approverView.rejectSuccess')
    });
    actionCompleted.value = true;
    petition.value = null;
  } catch (error) {
    console.error("Error rejecting petition:", error);
    store.dispatch("snackbar/setErrorSnacks", {
      message: t('errors.approverView.rejectError')
    });
  } finally {
    isLoading.value = false;
  }
};
onMounted(() => {
  store.dispatch("auth/setUser",{
    ...user.value,
    user_role:3 // Approver role
  });
  fetchPetition();
});
</script>
