<template>
  <div>
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

    <PetitionTable :petition="petition">
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
            <PetitionRevisionDialog
              v-model="showPetitionRevisionDialog"
              :petition="petition"
              @refresh="emit('refresh', $event)"
              @close="showPetitionRevisionDialog = false"
            >
              <template #activator="{ props }">
                <v-btn
                  v-if="userRole === 0 || userRole === 2 || userRole === 3"
                  color="warning"
                  :icon="icons.mdiAlertCircleOutline"
                  variant="elevated"
                  rounded="sm"
                  :aria-label="$t('actions.requestChange')"
                  @click="showPetitionRevisionDialog = true"
                  v-bind="props"
                />
              </template>
            </PetitionRevisionDialog>
            <RoleActionButton
              color="primary"
              :roles="[1,2]"
              :icon="icons.mdiPencil"
              :tooltip="$t('actions.edit')"
              :action="()=>showPetitionFormDialog = true"
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