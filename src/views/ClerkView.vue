<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <ClerkDataDisplay
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
import { log } from '@/utils/log';
import Petition from '@/models/Petition';
import ContentApiService from '@/services/contentApiService';
import ClerkDataDisplay from '@/components/clerk/ClerkDataDisplay.vue';
import ClerkPetitionTable from '@/components/tables/ClerkPetitionTable.vue';

const store = useStore();
const { t } = useI18n();

let socket = null;
const selectedPetition = ref(null);
const petitions = ref([]);

const user = computed(() => store.getters['auth/user']);

const connectWebSocket = () => {
  const clerkId = user.value.id;
  const baseUri = import.meta.env.VITE_WEBSOCKET_URI;
  
  const isLocal = baseUri.includes('localhost');
  const protocol = isLocal ? 'ws' : 'wss';

  const wsUrl = `${protocol}://${baseUri}/ws/${clerkId}`;

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
      const incomingPetitions = message.data.map((item) => new Petition(item));
      petitions.value = incomingPetitions;
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
    socket = null;
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
    // Force refresh the data after approval
    await handleRefresh();
  } catch (error) {
    console.error('Error accepting petition:', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.petition.approval'),
    });
  }
};
//refresh by fetching all petitions
const handleRefresh = async () => {
  try {
    const response = await ContentApiService.get('/clerk/petitions');
    petitions.value = response.data.map((item) => new Petition(item));
  } catch (error) {
    if (error.response?.status === 404) {
      petitions.value = [];
    } else {
      console.error('Error fetching petitions:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: t('errors.petition.fetching'),
      });
    }
  }
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
  connectWebSocket();
});

onUnmounted(() => {
  disconnectWebSocket();
});
</script>
