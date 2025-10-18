<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <InstructionCard
          :title="instructionCardTitle"
          :text="instructionCardText"
        />
      </v-col>
      <v-col cols="12" md="6">
        <EditCard
          :selectedPetition="selectedPetition"
          :petitions="petitions"
          @refresh="handleRefresh"
          @deselect-petition="deselectPetition"
        />
      </v-col>
      <v-col cols="12" md="6">
        <OverviewCard
          :key="petitions.length"
          :petitions="petitions"
          :selectedPetition="selectedPetition"
          :isLoading="isLoading"
          @select-petition="selectPetition"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import ContentApiService from '@/services/contentApiService';
import EditCard from '@/components/dashboard/EditCard.vue';
import OverviewCard from '@/components/dashboard/OverviewCard.vue';
import InstructionCard from '@/components/dashboard/InstructionCard.vue';

import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import loginErrorHandler from '@/utils/loginErrorHandler';

const store = useStore();
const { t } = useI18n();

const petitions = ref([]);
const selectedPetition = ref(null);
const isLoading = ref(true);

const userRole = computed(() => store.getters['auth/userRole']);
const instructionCardTitle = computed(() =>
  userRole.value === 0
    ? t('instructionCard.title.student')
    : t('instructionCard.title.supervisor')
);
const instructionCardText = computed(() =>
  userRole.value === 0
    ? t('instructionCard.text.student')
    : t('instructionCard.text.supervisor')
);

const selectPetition = (petition) => (selectedPetition.value = petition);
const deselectPetition = () => (selectedPetition.value = null);

const checkRoleAuthorization = (role) => {
  if (role !== 0 && role !== 1) {
    loginErrorHandler.setLoginError(t('errors.RoleDashboardView.unauthorized'));
  }
};
const fetchPetitions = async () => {
  isLoading.value = true;
  try {
    const response = await ContentApiService.get(
      `${userRole.value === 0 ? '/students' : '/supervisor'}/petitions`
    );
    petitions.value = response.data;
  } catch (err) {
    //404 is supposed to be when there are no petitions
    // so we don't want to show an error in that case
    if (err.response?.status !== 404) {
      console.error('Error fetching petitions:', err);
      store.dispatch('snackbar/setErrorSnacks', {
        message: t('errors.petition.fetching'),
      });
    }
  } finally {
    isLoading.value = false;
  }
};
const handleRefresh = (payload) => {
  if (payload) {
    switch (payload.type) {
      case 'update':
        // Update the selected petition's data if it's the one that was updated
        if (selectedPetition.value?.id === payload.data.id) {
          selectPetition(payload.data);
        }
        break;
      case 'delete':
        // Deselect the petition if it's the one being deleted
        if (selectedPetition.value?.id === payload.data) {
          deselectPetition();
        }
        // Immediately update the local petitions array to remove the deleted item
        petitions.value = petitions.value.filter((p) => p.id !== payload.data);
        break;
    }
  }
  fetchPetitions();
};
watch(userRole, (newRole) => {
  checkRoleAuthorization(newRole);
});
onMounted(() => {
  checkRoleAuthorization(userRole.value);
  fetchPetitions();
});
</script>
