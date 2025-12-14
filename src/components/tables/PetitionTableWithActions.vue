<template>
  <div>
    <!-- All the dialogs are placed here  -->
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
    <PetitionRevisionDialog
      v-model="showPetitionRevisionDialog"
      :petition="petition"
      @refresh="emit('refresh', $event)"
      @close="showPetitionRevisionDialog = false"
    ></PetitionRevisionDialog>

    <!-- main table -->
    <PetitionTable :petition="petition">
      <!-- All the actions button on top of table-->
      <template #top>
        <div class="d-flex justify-space-between align-center">
          <RoleActionButton
            color="error"
            :roles="[0, 1, 2]"
            :icon="icons.mdiClose"
            :tooltip="$t('actions.close')"
            @click="emit('close')"
          />
          <div class="d-flex align-center ga-3 ml-1">
            <RoleActionButton
              color="warning"
              :roles="[0, 2, 3]"
              :icon="icons.mdiAlertCircleOutline"
              :tooltip="$t('actions.requestChange')"
              @click="showPetitionRevisionDialog = true"
            />
            <RoleActionButton
              color="primary"
              :roles="[1]"
              :icon="icons.mdiPencil"
              :disabled="!canEditPetition"
              :tooltip="$t('actions.edit')"
              @click="showPetitionFormDialog = true"
            />
            <RoleActionButton
              color="error"
              :roles="[1]"
              :icon="icons.mdiTrashCan"
              :tooltip="$t('actions.delete')"
              @click="showDeleteConfirmationDialog = true"
            />
          </div>
        </div>
      </template>
      <template #bottom>
        <slot name="bottom"></slot>
      </template>
    </PetitionTable>
  </div>
</template>

<script setup>
import { PETITION_STATUS } from '@/utils/statusUtils';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import {
  mdiClose,
  mdiPencil,
  mdiTrashCan,
  mdiAlertCircleOutline,
} from '@mdi/js';
import ContentApiService from '@/services/contentApiService.js';
import PetitionTable from './PetitionTable.vue';
import PetitionFormDialog from '@/components/dialogs/PetitionFormDialog.vue';
import ConfirmationDialog from '@/components/dialogs/base/ConfirmationDialog.vue';
import PetitionRevisionDialog from '@/components/dialogs/PetitionRevisionDialog.vue';
import RoleActionButton from '../ui/RoleActionButton.vue';

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
const showPetitionRevisionDialog = ref(false);
const showPetitionFormDialog = ref(false);

const userRole = computed(() => store.getters['auth/userRole']);
const canEditPetition = computed(() => {
  return [
    PETITION_STATUS.PETITIONEER_ACTION,
    PETITION_STATUS.APPROVER_REVISION,
    PETITION_STATUS.STUDENT_REVISION,
  ].some((status) => props.petition.status.includes(status));
});

const deletePetition = async () => {
  try {
    const role = userRole.value === 2 ? 'clerk' : 'supervisor';
    await ContentApiService.delete(`/${role}/petitions/${props.petition.id}`);
    emit('refresh', {
      type: 'delete',
      data: props.petition.id,
    });
  } catch (error) {
    console.error('Error deleting petition:', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.petition.deletion', 'Failed to delete petition.'),
    });
  }
};
</script>
