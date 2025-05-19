<template>
    <CustomDialog
      :title="$t('reportIssue.title')"
      >
      <template #content>
        <v-card-text>
          <v-form ref="form" v-model="isValid">
            <label  for="reportSubject "
                    class="text-subtitle-1 font-weight-medium ml-10"
                    >{{ $t('reportIssue.subjectLabel') }}
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

            <label for="reportText" 
              class="text-subtitle-1 font-weight-medium ml-10"
              >{{ $t('reportIssue.messageLabel') }}
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
import { ref,computed} from 'vue';
import { useI18n } from 'vue-i18n';
import {useStore } from 'vuex';
import ContentApiService from '@/services/contentApiService.js';
import {mdiEmailOutline,mdiMessageTextOutline} from '@mdi/js';

const props = defineProps({
    petition: {
        type: Object,
        required: true,
    }
});
const emit = defineEmits(['close']);
const { t } = useI18n();
const store = useStore();

const icons = {
  mdiEmailOutline,
  mdiMessageTextOutline,
};
const studentSubjects=[
   t('reportIssue.studentSubjects.changeDates'),
   t('reportIssue.studentSubjects.changeHours'),   
   t('reportIssue.studentSubjects.exceptionHours'),   
   t('reportIssue.studentSubjects.others')
]
const clerkSubjects=[
   t('reportIssue.clerkSubjects.missingDocuments'),
   t('reportIssue.clerkSubjects.incorrectDocuments'),
   t('reportIssue.clerkSubjects.incorrectData'),
   t('reportIssue.clerkSubjects.others')
]
const requiredRule = (v) => !!v || t('validationRule.required');

const isValid = ref(false);
const reportSubject = ref('');
const reportText = ref('');

const userRole = computed(() => store.getters['auth/userRole']);
const recipientMail = computed(() => {
    return userRole.value === 2 ? props.petition.student_mail : props.petition.supervisor_mail;
});
const subjects = computed(()=> {
    if (userRole.value === 0) {
        return studentSubjects;
    } else if (userRole.value === 2) {
        return clerkSubjects;
    }
});

const reportIssue = async() => {
    try{
        await ContentApiService.post('/send-email', {
            recipient: recipientMail.value,
            subject: reportSubject.value,
            body: reportText.value,
        })
        store.dispatch('snackbar/setSnack', {
            message: t("reportIssue.success"),
        });
    }
    catch(error){
        console.error('Error sending email',error);
        store.dispatch('snackbar/setErrorSnacks', {
            message:t("errors.petitionIssueDialog.sendingEmail"),
        });
    } 
    finally{
        reportSubject.value = '';
        reportText.value = '';
        emit('close');
    }  
};
</script>