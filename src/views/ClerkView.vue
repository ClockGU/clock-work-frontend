<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <PetitionDataDisplay
          :petition="selectedPetition"
          @close="selectPetition(null)"
          @refresh="handleRefresh"
          @approve="handleApproval"
        />
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title class="ml-4 mt-2">
            {{ $t('overview') }}
          </v-card-title>
          <v-card-text>
            <ClerkPetitionTable
              :items="petitions"
              :selected-petition="selectedPetition"
              @row-click="selectPetition"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import ContentApiService from '@/services/contentApiService';
import PetitionDataDisplay from '@/components/clerk/PetitionDataDisplay.vue';
import ClerkPetitionTable from '@/components/tables/ClerkPetitionTable.vue';
import loginErrorHandler from '@/utils/loginErrorHandler';
import { log } from '@/utils/log';

const store = useStore();
const { t } = useI18n();

let socket = null;

const selectedPetition = ref(null);
const petitions = ref([]);

const userRole = computed(() => store.getters['auth/userRole']);
const connectWebSocket = () => {
  //this is temporary clerk id for testing
  const clerkId = 1234;
  const wsUrl = `ws://localhost:8030/ws/${clerkId}`;

  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    log('WebSocket connected');
  };
  socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  log('WebSocket message received:', message);

  if (
    message.type === 'new_petition' ||
    message.type === 'updated_petitions'
  ) {
    const incomingPetitions = message.data;
    
    // 1. Update the main table list immediately
    petitions.value = incomingPetitions;

    // 2. Check if the currently selected petition was updated
    if (selectedPetition.value) {
      const updatedPetition = incomingPetitions.find(
        (petition) => petition.id === selectedPetition.value.id
      );

      // If the selected petition is in the new data, update its details
      if (updatedPetition) {
        selectedPetition.value = updatedPetition;
      } 
    }
  }
};
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    log('WebSocket disconnected');
  };
};
const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
  }
};
const fetchPetitions = async () => {
  try {
    const response = await ContentApiService.get('/clerk/petitions');
    petitions.value = response.data;
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error('Error fetching petitions:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: t('errors.petition.fetching'),
      });
    }
  }
};
const checkClerkAuthorization = (role) => {
  if (role !== 2) {
    loginErrorHandler.setLoginError(t('errors.clerkView.unauthorized'));
  }
};
const selectPetition = (petition) => {
  selectedPetition.value = petition;
};
const handleApproval = async (petitionId) => {
  try {
    await ContentApiService.patch(`/clerk/petitions/${petitionId}`, {
      approved: true,
    });
    selectedPetition.value = null;
    store.dispatch('snackbar/setSnack', {
      message: t('approverView.approveSuccess'),
    });
    handleRefresh();
  } catch (error) {
    console.error('Error accepting petition:', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.petition.approval'),
    });
  }
};
const handleRefresh = (payload) => {
  if (payload) {
    switch (payload.type) {
      case 'update':
        if (selectedPetition.value?.id === payload.data.id) {
          selectedPetition.value = payload.data;
        }
        break;
      case 'delete':
        if (selectedPetition.value?.id === payload.data) {
          selectedPetition.value = null;
        }
        break;
    }
  }
  fetchPetitions();
};
watch(userRole, (newRole) => {
  checkClerkAuthorization(newRole);
  if (newRole === 2) {
    connectWebSocket();
  } else {
    disconnectWebSocket();
  }
});

onMounted(() => {
  checkClerkAuthorization(userRole.value);
  fetchPetitions();
  if (userRole.value === 2) {
    connectWebSocket();
  }
});
onUnmounted(() => {
  disconnectWebSocket();
});
</script>
