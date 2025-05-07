<template>
    <CustomDialog
      :title="$t('actions.report')"
      >
      <template #content>
        <v-card-text>
          <v-form ref="form" v-model="isValid">
            <v-text-field
              v-model="reportSubject"
              :rules="[requiredRule]"
              :label="$t('actions.report')"
            ></v-text-field>
            <v-textarea
              v-model="reportText"
              rows="4"
              auto-grow
              clearable
              :rules="[requiredRule]"
              :label="$t('actions.report')"
              >
            </v-textarea>
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

const props = defineProps({
    petition: {
        type: Object,
        required: true,
    }
});
const emit = defineEmits(['close']);
const { t } = useI18n();
const store = useStore();

const isValid = ref(false);
const reportSubject = ref('');
const reportText = ref('');

const user = computed(() => store.getters['auth/user']);
const recipientMail = computed(() => {
    return user.value.user_role === 2 ? props.petition.student_mail : props.petition.supervisor_mail;
});
const requiredRule = (v) => !!v || t('validationRule.required');

const reportIssue = async() => {
    try{
        await ContentApiService.post('/send-email', {
            recipient: recipientMail,
            subject: reportSubject,
            body: reportText,
        })
        store.dispatch('snackbar/setSnack', {
            message: 'Email sent successfully',
        });
    }
    catch(error){
        console.error('Error sending email',error);
        store.dispatch('snackbar/setErrorSnacks', {
            message:'Error sending email',
        });
    } 
    finally{
        reportSubject.value = '';
        reportText.value = '';
        emit('close');
    }  
};
</script>