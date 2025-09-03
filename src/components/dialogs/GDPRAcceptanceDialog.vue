<template>
    <CustomDialog
        v-model="model"
        :title="$t('gdprAcceptanceDialog.title')"
        :custom-close="cancelAndDismiss"
    >
        <template #content>
            <v-container class="text-body-1 pa-4 mt-4">
                 <p class="mt-4 ml-2">
                    {{$t('gdprAcceptanceDialog.text')}}
                </p>
                <v-checkbox
                    v-model="userAgreement"
                    :label="$t('gdprAcceptanceDialog.accept')"  
                    class="mt-8"
                />
            </v-container>
           
        </template>
        <template #actions>
            <v-btn
            color="primary"
            variant="text"
            :aria-label="$t('actions.complete')"
            :disabled="!userAgreement"
            @click="agreeToPrivacyPolicy">
            {{ $t('actions.complete') }}
            </v-btn>
        </template>
    </CustomDialog>
</template>

<script setup >
import CustomDialog from './CustomDialog.vue';
import AuthApiService from '@/services/authApiService';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const store = useStore();
const {t} = useI18n();

const model=ref(false);
const userAgreement = ref(false);

const user = computed(()=>store.getters['auth/user']);
const token = computed(()=>store.getters['auth/accessToken']);

// Method to handle dismissal via sessionStorage
const cancelAndDismiss = () => {
    sessionStorage.setItem('gdpr_dialog_dismissed', 'true');
    model.value = false;
};
const agreeToPrivacyPolicy = async() => {
    try{
        await AuthApiService.updateUser({dsgvo_accepted: true},user.value.id,);
        store.dispatch('auth/setUser', {...user.value, dsgvo_accepted: true});
    }
    catch(error){
        console.error('Error updating user agreement:', error);
        store.dispatch('snackbar/setErrorSnacks', {
            message: t("errors.gdprAcceptanceDialog.updateFailed"),
        })
    }
    finally{
        model.value=false;
    }
};
onMounted(()=>{
    if (token.value) {      
        AuthApiService.setAccessToken(token.value);  
    }
    // Only show the dialog if the user exists, hasn't accepted, AND it hasn't been dismissed this session.
    if (user.value && !user.value.dsgvo_accepted  &&   
    !sessionStorage.getItem('gdpr_dialog_dismissed')) {
        model.value = true;
    }
});
</script>