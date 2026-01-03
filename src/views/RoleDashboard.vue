<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <InstructionCard :role="currentRole" />
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
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { Roles, currentRole } from '@/utils/roleUtils';
import  Petition from '@/models/Petition';
import ContentApiService from '@/services/contentApiService';
import EditCard from '@/components/dashboard/EditCard.vue';
import OverviewCard from '@/components/dashboard/OverviewCard.vue';
import InstructionCard from '@/components/dashboard/InstructionCard.vue';

const store = useStore();
const { t } = useI18n();

const petitions = ref([]);
const selectedPetition = ref(null);
const isLoading = ref(true);

const selectPetition = (petition) => (selectedPetition.value = petition);
const deselectPetition = () => (selectedPetition.value = null);

const fetchPetitions = async () => {
  isLoading.value = true;
  try {
    const response = await ContentApiService.get(
      currentRole.value === Roles.SUPERVISOR
        ? '/supervisor/petitions'
        : '/students/petitions'
    );
    petitions.value = response.data.map((item) => new Petition(item));
  } catch (err) {
    if (err.response?.status === 404) {
      petitions.value = [];
    } else {
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
        // optimistic update of selected petition's data if it's the one that was edited
        if (selectedPetition.value?.id === payload.data.id) {
          selectedPetition.value = payload.data;
        }
        break;
      case 'delete':
        // optimistic deselection of petition if it's the one being deleted
        if (selectedPetition.value?.id === payload.data) {
          selectedPetition.value = null;
        }
        // optimistic deletion of petition
        petitions.value = petitions.value.filter((p) => p.id !== payload.data);
        break;
    }
  }
  fetchPetitions();
};

// sync selectedPetition with petitions
watch(petitions, (newPetitions) => {
  const updatedSelectedPetition = newPetitions.find(
    (petition) => petition.id === selectedPetition.value?.id
  );
  if (updatedSelectedPetition) {
    selectedPetition.value = updatedSelectedPetition;
  } else {
    selectedPetition.value = null;
  }
});
onMounted(() => {
  fetchPetitions();
});
</script>
