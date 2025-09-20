<template>
  <CustomDialog :title="$t('actions.requestChange')">
    <template #content>
      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="12" sm="12">
            <p
              class="text-body-1 text-justify text-medium-emphasis px-10 mb-2 mt-6"
            >
              {{ RevisionDialogInstruction }}
            </p>
          </v-col>
          <v-col cols="12" sm="6">
            <label class="text-subtitle-1 font-weight-medium ml-10">
              {{ $t('PetitionRevisionDialog.fromLabel') }}
            </label>
            <v-text-field
              :model-value="senderEmail"
              :readonly="true"
              variant="outlined"
              class="mt-1"
              :prepend-icon="icons.mdiAccountOutline"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <label class="text-subtitle-1 font-weight-medium ml-10">
              {{ $t('PetitionRevisionDialog.toLabel') }}
            </label>
            <v-text-field
              :model-value="recipientMail"
              :readonly="true"
              variant="outlined"
              class="mt-1"
              :prepend-icon="icons.mdiAccountOutline"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>

        <v-form ref="form" v-model="isValid">
          <div v-if="userRole !== 3">
            <label
              for="reportSubject"
              class="text-subtitle-1 font-weight-medium ml-10"
            >
              {{ $t('PetitionRevisionDialog.subjectLabel') }}
            </label>
            <v-select
              id="reportSubject"
              v-model="reportSubject"
              :rules="[requiredRule]"
              :items="subjects"
              :label="$t('PetitionRevisionDialog.subjectPlaceholder')"
              class="mb-4"
              clearable
              :prepend-icon="icons.mdiEmailOutline"
            ></v-select>
          </div>

          <label
            for="reportText"
            class="text-subtitle-1 font-weight-medium ml-10"
          >
            {{ $t('PetitionRevisionDialog.messageLabel') }}
          </label>
          <v-textarea
            id="reportText"
            v-model="reportText"
            rows="6"
            auto-grow
            clearable
            counter
            :placeholder="$t('PetitionRevisionDialog.messagePlaceholder')"
            :prepend-icon="icons.mdiMessageTextOutline"
            :maxlength="500"
            :rules="[requiredRule]"
          ></v-textarea>
        </v-form>
      </v-card-text>
    </template>
    <template #actions>
      <v-btn :disabled="!isValid" color="primary" @click="handleRevision">
        {{ $t('actions.send') }}
      </v-btn>
    </template>
    <template #activator="{ props: activatorProps }">
      <slot name="activator" :props="activatorProps"></slot>
    </template>
  </CustomDialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import {
  mdiEmailOutline,
  mdiMessageTextOutline,
  mdiAccountOutline,
} from '@mdi/js';
import ContentApiService from '@/services/contentApiService.js';
import CustomDialog from './CustomDialog.vue';

const props = defineProps({
  petition: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'refresh']);

const store = useStore();
const { t } = useI18n();
const route = useRoute();

const icons = { mdiEmailOutline, mdiMessageTextOutline, mdiAccountOutline };
const studentSubjects = [
  t('PetitionRevisionDialog.studentSubjects.issue'),
  t('PetitionRevisionDialog.studentSubjects.error'),
  t('PetitionRevisionDialog.studentSubjects.others'),
];

const clerkSubjects = [
  t('PetitionRevisionDialog.clerkSubjects.missingDocuments'),
  t('PetitionRevisionDialog.clerkSubjects.incorrectDocuments'),
  t('PetitionRevisionDialog.clerkSubjects.incorrectData'),
  t('PetitionRevisionDialog.clerkSubjects.others'),
];

const requiredRule = (v) => !!v || t('validationRule.required');

const isValid = ref(false);
const reportSubject = ref('');
const reportText = ref('');

const userRole = computed(() => store.getters['auth/userRole']);
const senderEmail = computed(() => store.getters['auth/user'].email);
const recipientMail = computed(() => {
  return userRole.value === 2
    ? props.petition.student_mail
    : props.petition.supervisor_mail;
});
const subjects = computed(() => {
  if (userRole.value === 0) {
    return studentSubjects;
  } else if (userRole.value === 2) {
    return clerkSubjects;
  }
  return [];
});
const RevisionDialogInstruction = computed(() => {
  if (userRole.value === 3) {
    return t('PetitionRevisionDialog.instruction.approver');
  } else if (userRole.value === 2) {
    return t('PetitionRevisionDialog.instruction.clerk');
  } else if (userRole.value === 0) {
    return t('PetitionRevisionDialog.instruction.student');
  }
  return '';
});

const handleRevision = async () => {
  const apiMethod = userRole.value === 3 ? 'patch' : 'post';
  const apiEndpoint =
    userRole.value === 3
      ? `/approver/petitions/${route.query.petition_id}/${route.query.signature}/${route.query.budget_position_id}`
      : '/send-email';

  const apiData =
    userRole.value === 3
      ? {
          budget_position_status: 'approver_revision',
          message: reportText.value,
        }
      : {
          recipient: recipientMail.value,
          subject: reportSubject.value,
          body: reportText.value,
        };

  try {
    await ContentApiService[apiMethod](apiEndpoint, apiData);

    store.dispatch('snackbar/setSnack', {
      message: t('PetitionRevisionDialog.success'),
    });
    emit('refresh');
  } catch (error) {
    console.error('Error handling report issue:', error);

    const errorMessage =
      userRole.value === 3
        ? t('errors.PetitionRevisionDialog.approverRevision')
        : t('errors.PetitionRevisionDialog.sendingEmail');

    store.dispatch('snackbar/setErrorSnacks', {
      message: errorMessage,
    });
  } finally {
    reportSubject.value = '';
    reportText.value = '';
    emit('close');
  }
};
</script>

<style scoped>
:deep(.v-input--readonly) {
  opacity: 0.8;
}
:deep(.v-input--readonly .v-field) {
  background-color: #f5f5f5;
}
</style>