<template>
  <div>
    <!-- Dialogs for petition actions -->
    <PetitionFormDialog
      v-model="showPetitionFormDialog"
      :petition="petition"
      @close="showPetitionFormDialog = false"
      @refresh="handleRefresh"
    />
    <ConfirmationDialog
      v-model="showDeleteConfirmationDialog"
      :action="deletePetition"
    >
      <template #content>
        <p>{{ $t('confirmationDialog.PetitionDeletion') }}</p>
      </template>
    </ConfirmationDialog>
    <PetitionIssueDialog
      v-model="showPetitionIssueDialog"
      :petition="petition"
      @close="showPetitionIssueDialog = false"
    ></PetitionIssueDialog>

    <!-- The PetitionTable component is used here -->
    <PetitionTable :petition="petition">
      <!-- Action buttons are injected into the 'top' slot of the table component -->
      <template #top>
        <div class="d-flex justify-space-between align-center">
          <v-btn
            v-if="userRole != 3"
            color="error"
            :aria-label="$t('actions.close')"
            @click="$emit('close')"
          >
            <v-icon>{{ icons.mdiClose }}</v-icon>
            <v-tooltip activator="parent" location="top" :text="$t('actions.close')"></v-tooltip>
          </v-btn>

          <div class="d-flex align-center ga-3 ml-1">
            <v-btn
              v-if="userRole != 1"
              color="warning"
              :aria-label="$t('actions.report')"
              @click="showPetitionIssueDialog = true"
            >
              <v-icon>{{ icons.mdiAlertCircleOutline }}</v-icon>
              <v-tooltip activator="parent" location="top" :text="$t('actions.report')"></v-tooltip>
            </v-btn>
            <v-btn
              v-if="userRole === 1 || userRole === 2"
              color="primary"
              :aria-label="$t('actions.edit')"
              @click="showPetitionFormDialog = true"
            >
              <v-icon>{{ icons.mdiPencil }}</v-icon>
              <v-tooltip activator="parent" location="top" :text="$t('actions.edit')"></v-tooltip>
            </v-btn>
            <v-btn
              v-if="userRole === 1 || userRole === 2"
              color="error"
              :aria-label="$t('actions.delete')"
              @click="showDeleteConfirmationDialog = true"
            >
              <v-icon>{{ icons.mdiTrashCan }}</v-icon>
              <v-tooltip activator="parent" location="top" :text="$t('actions.delete')"></v-tooltip>
            </v-btn>
          </div>
        </div>
      </template>
    </PetitionTable>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { mdiClose, mdiPencil, mdiTrashCan, mdiAlertCircleOutline } from '@mdi/js';
import ContentApiService from '@/services/contentApiService.js';
import PetitionTable from './PetitionTable.vue';
import PetitionFormDialog from '@/components/dialogs/PetitionFormDialog.vue'; 
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';
import PetitionIssueDialog from '@/components/dialogs/PetitionIssueDialog.vue';

const props = defineProps({
  petition: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'refresh']);

const store = useStore();
const { t } = useI18n();

const icons = { mdiClose, mdiPencil, mdiTrashCan, mdiAlertCircleOutline };
const showDeleteConfirmationDialog = ref(false);
const showPetitionIssueDialog = ref(false);
const showPetitionFormDialog = ref(false);
const userRole = computed(() => store.getters['auth/userRole']);

const deletePetition = async () => {
  try {
    const role = userRole.value === 2 ? 'clerk' : 'supervisor';
    await ContentApiService.delete(`${role}/petitions/${props.petition.id}`);
    emit('refresh', {
      type: 'delete',
      data: props.petition.id,
    });
  } catch (error) {
    console.error("Error deleting petition:", error);
    store.dispatch("snackbar/setErrorSnacks", {
      message: t("errors.petition.deletion", "Failed to delete petition."),
    });
  } finally {
    showDeleteConfirmationDialog.value = false;
  }
};

const handleRefresh = (payload) => {
  emit('refresh', payload);
};
</script>
