<template>
  <CustomDialog :title="$t('actions.requestChange')">
    <template #content>
      <v-card-text>
        <p
          class="text-body-1 text-justify text-medium-emphasis px-10 mb-2 mt-6"
        >
          {{ RevisionDialogInstruction }}
        </p>
        <v-row class="mb-4">
          <v-col cols="12" sm="12">
            <div class="ml-10 mt-6 d-flex align-center">
              <span class="text-subtitle-1 font-weight-bold">
                {{
                  $t('PetitionRevisionDialog.sendToLabel', {
                    role: $t(recipientRole),
                  })
                }}
              </span>
              <span class="ml-3 text-body-1">{{ recipientMail }}</span>
            </div>
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
  import {
  mdiEmailOutline,
  mdiMessageTextOutline,
  mdiAccountOutline,
} from '@mdi/js';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import ContentApiService from '@/services/contentApiService.js';
import CustomDialog from '@/components/dialogs/base/CustomDialog.vue';

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
  t('PetitionRevisionDialog.studentSubjects.changeDates'),
  t('PetitionRevisionDialog.studentSubjects.changeHours'),
  t('PetitionRevisionDialog.studentSubjects.exceptionHours'),
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
const recipientMail = computed(() => {
  return userRole.value === 2
    ? props.petition.student_mail
    : props.petition.supervisor_mail;
});

const recipientRole = computed(() => {
  return userRole.value === 2 ? 'student' : 'supervisor';
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

const handleClerkRevision = async () => {
  const petitionId = props.petition.id;
  const apiEndpoint = `/clerk/petitions/${petitionId}/request-revision`;
  const apiData = {
    message: reportText.value,
  };
  try {
    await ContentApiService.patch(apiEndpoint, apiData);
    store.dispatch('snackbar/setSnack', {
      message: t('PetitionRevisionDialog.success.clerkRevision'),
    });
  } catch (error) {
    console.error('Error handling Clerk revision:', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.PetitionRevisionDialog.clerkRevision'),
    });
  }
};

const handleApproverRevision = async () => {
  const apiEndpoint = `/approver/petitions/${route.query.petition_id}/${route.query.signature}/${route.query.budget_position_id}`;
  const apiData = {
    message: reportText.value,
    budget_position_approved: false,
    revision_requested: true,
  };

  try {
    await ContentApiService.patch(apiEndpoint, apiData);
    store.dispatch('snackbar/setSnack', {
      message: t('PetitionRevisionDialog.success.approverRevision'),
    });
  } catch (error) {
    console.error('Error handling Approver revision:', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.PetitionRevisionDialog.approverRevision'),
    });
  }
};

const handleStudentRevision = async () => {
  const petitionId = props.petition.id;
  const apiEndpoint = `/students/petitions/${petitionId}/request-revision`;
  const apiData = {
    body: reportText.value,
  };

  try {
    await ContentApiService.patch(apiEndpoint, apiData);
    store.dispatch('snackbar/setSnack', {
      message: t('PetitionRevisionDialog.success.studentRevision'),
    });
  } catch (error) {
    console.error('Error handling Student revision :', error);
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.PetitionRevisionDialog.studentRevision'),
    });
  }
};
const handleRevision = async () => {
  if (userRole.value === 3) {
    await handleApproverRevision();
  } else if (userRole.value === 2) {
    await handleClerkRevision();
  } else if (userRole.value === 0) {
    await handleStudentRevision();
  } else {
    console.error(
      `User with role ${userRole.value} has no permission to revision`
    );
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.PetitionRevisionDialog.unhandledRole'),
    });
  }
  reportSubject.value = '';
  reportText.value = '';
  emit('close');
  emit('refresh', { type: 'update', data: props.petition });
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
