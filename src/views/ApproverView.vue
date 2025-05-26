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
                    Petition Data
                  </h2>
                </v-card-title>
                <v-card-text>
                  <PetitionDetailsTable
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
                aria-label="Reject petition"
              >
                {{ $t('petitionDataDisplay.btn.reject') }}
              </v-btn>
              <v-btn 
                color="success" 
                size="large" 
                class="px-10" 
                @click="handleApproval"
                aria-label="Approve petition"
              >
                {{ $t('petitionDataDisplay.btn.approve') }}
              </v-btn>
            </section>
          </template>

          <!-- No Petition Available State -->
          <template v-else>
            <v-card class="text-center py-8" elevation="2">
              <v-icon size="64" color="grey lighten-1" class="mb-4">mdi-file-remove</v-icon>
              <h2 class="text-h5 mb-4">No Petition to Review</h2>
              <p class="text-body-1 mb-4">{{ noPetitionMessage }}</p>
              <v-btn 
                color="primary" 
                @click="fetchPetition"
                aria-label="Refresh petition"
              >
                Refresh
              </v-btn>
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
import ContentApiService from '@/services/contentApiService';

const route = useRoute();
const store = useStore();
const petitionId = route.params.uuid;
const signature = route.query.signature;
const petition = ref(null);
const isLoading = ref(true);
const actionCompleted = ref(false);

const headerMessage = computed(() => {
  if (actionCompleted.value) {
    return "Petition Review Completed";
  }
  return "You have been requested to approve the following hire petition";
});

const noPetitionMessage = computed(() => {
  if (actionCompleted.value) {
    return "This petition has already been processed. Thank you for your review.";
  }
  return "No petition available for review at this time.";
});

const fetchPetition = async () => {
  try {
    isLoading.value = true;
    actionCompleted.value = false;
    const response = await ContentApiService.get(`/approver/petitions/${petitionId}`);
    petition.value = response.data;
  } catch (err) {
    console.error(err);
    store.dispatch("snackbar/setErrorSnacks", {
      message: "Failed to load petition"
    });
  } finally {
    isLoading.value = false;
  }
};

const handleApproval = async () => {
  try {
    isLoading.value = true;
    await ContentApiService.patch(`/approver/petitions/${petitionId}`, { 
      status: "student_action",
      budget_approved: true,
     });
    store.dispatch("snackbar/setSnack", {
      message: "Petition approved successfully"
    });
    actionCompleted.value = true;
    petition.value = null;
  } catch (error) {
    console.error("Error accepting petition:", error);
    store.dispatch("snackbar/setErrorSnacks", {
      message: "Error approving petition"
    });
  } finally {
    isLoading.value = false;
  }
};

const handleRejection = async () => {
  try {
    isLoading.value = true;
    await ContentApiService.patch(`/approver/petitions/${petitionId}/${signature}`, { 
      status: "rejected",
      budget_approved: false,});
    store.dispatch("snackbar/setSnack", {
      message: "Petition rejected successfully"
    });
    actionCompleted.value = true;
    petition.value = null;
  } catch (error) {
    console.error("Error rejecting petition:", error);
    store.dispatch("snackbar/setErrorSnacks", {
      message: "Error rejecting petition"
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchPetition();
});
</script>