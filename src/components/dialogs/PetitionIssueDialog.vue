<template>
  <CustomDialog :title="$t('reportIssue.title')">
    <template #content>
      <v-card-text>
        <v-form ref="form" v-model="isValid">
          <template v-if="userRole === 3">
            <p class="text-subtitle-1 text-high-emphasis ml-10 my-4">
              {{ $t('reportIssue.approverMessage') }}
            </p>
          </template>
          <template v-else>
             <label for="reportSubject" class="text-subtitle-1 font-weight-medium ml-10">
              {{ $t('reportIssue.subjectLabel') }}
            </label>
            <v-select
              id="reportSubject"
              v-model="reportSubject"
              :rules="[requiredRule]"
              :items="subjects"
              :label="$t('reportIssue.subjectPlaceholder')"
              class="mb-4"
              clearable
              :prepend-icon="icons.mdiEmailOutline"
            ></v-select>
          </template>
         
          <label for="reportText" class="text-subtitle-1 font-weight-medium ml-10">
            {{ $t('reportIssue.messageLabel') }}
          </label>
          <v-textarea
            id="reportText"
            v-model="reportText"
            :rules="[requiredRule]"
            :placeholder="$t('reportIssue.messagePlaceholder')"
            rows="6"
            auto-grow
            clearable
            :prepend-icon="icons.mdiMessageTextOutline"
            counter
            :maxlength="500"
          ></v-textarea>
        </v-form>
      </v-card-text>
    </template>
    <template #actions>
      <v-btn
        :disabled="!isValid"
        color="primary"
        @click="reportIssue"
      >
        {{ $t('actions.send') }}
      </v-btn>
    </template>
  </CustomDialog>
</template>

<script setup>
import { ref, computed} from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { mdiEmailOutline, mdiMessageTextOutline } from '@mdi/js';
import ContentApiService from '@/services/contentApiService.js';
import CustomDialog from './CustomDialog.vue'; 

const props = defineProps({
  petition: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close','refresh']);

const store = useStore();
const { t } = useI18n();
const route = useRoute(); 

const icons = { mdiEmailOutline, mdiMessageTextOutline };
const studentSubjects = [
  t('reportIssue.studentSubjects.issue'),
  t('reportIssue.studentSubjects.error'),
  t('reportIssue.studentSubjects.others'),
];

const clerkSubjects = [
  t('reportIssue.clerkSubjects.missingDocuments'),
  t('reportIssue.clerkSubjects.incorrectDocuments'),
  t('reportIssue.clerkSubjects.incorrectData'),
  t('reportIssue.clerkSubjects.others'),
];

const requiredRule = (v) => !!v || t('validationRule.required');

const isValid = ref(false);
const reportSubject = ref('');
const reportText = ref('');

const userRole = computed(() => store.getters['auth/userRole']);
const recipientMail = computed(() => {
  return userRole.value === 2 ? props.petition.student_mail : props.petition.supervisor_mail;
});

const subjects = computed(() => {
  if (userRole.value === 0) {
    return studentSubjects;
  } else if (userRole.value === 2) {
    return clerkSubjects;
  } 
  return [];
});

const reportIssue = async () => {
  const apiMethod = userRole.value === 3 ? 'patch' : 'post';
  const apiEndpoint = userRole.value === 3
    ? `/approver/petitions/${route.query.petition_id}/${route.query.signature}/${route.query.budget_position_id}`
    : '/send-email';

  const apiData = userRole.value === 3
    ? {
        budget_position_status: "approver_revision",
        message: reportText.value,
      }
    : {
        recipient: recipientMail.value,
        subject: reportSubject.value,
        body: reportText.value,
      };

  try {
    await ContentApiService[apiMethod](apiEndpoint, apiData);

    store.dispatch("snackbar/setSnack", {
      message: t("reportIssue.success"),
    });
    emit("refresh");

  } catch (error) {
    console.error("Error handling report issue:", error);

    const errorMessage = userRole.value === 3
      ? t("errors.petitionIssueDialog.approverRevision")
      : t("errors.petitionIssueDialog.sendingEmail");

    store.dispatch("snackbar/setErrorSnacks", {
      message: errorMessage,
    });
  } finally {
    reportSubject.value = "";
    reportText.value = "";
    emit("close");
  }
};
</script>
