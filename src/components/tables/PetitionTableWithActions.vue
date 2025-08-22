<template>
  <div>
    <!-- Dialogs for petition actions -->
    <PetitionFormDialog
      v-model="showPetitionFormDialog"
      :petition="petition"
      @close="showPetitionFormDialog = false"
      @refresh="emit('refresh', $event)"
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
          <RoleActionButton
            color="error"
            :roles="[0,1,2]"
            :icon="icons.mdiClose"
            :tooltip="$t('actions.close')"
            :action="()=>$emit('close') "
          />
          <div class="d-flex align-center ga-3 ml-1">
            <RoleActionButton
              color="warning"
              :roles="[0,2]"
              :icon="icons.mdiAlertCircleOutline"
              :tooltip="$t('actions.report')"
              :action="()=>showPetitionIssueDialog = true"
            />
            <RoleActionButton
              color="primary"
              :roles="[1,2]"
              :icon="icons.mdiPencil"
              :tooltip="$t('actions.edit')"
              :action="()=>$emit('edit')"
            />
            <RoleActionButton
              color="error"
              :roles="[1,2]"
              :icon="icons.mdiTrashCan"
              :tooltip="$t('actions.delete')"
              :action="()=>showDeleteConfirmationDialog = true"
            />
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
import RoleActionButton from '../ui/RoleActionButton.vue';

const props = defineProps({
  petition: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'refresh', 'edit']);

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
  }
};
</script>
