<template>
  <v-container class="d-flex flex-column justify-end align-center">
    <v-spacer></v-spacer>
    <p class="text-h2 font-weight-medium">
      {{ $t('roleSelectionView.welcome') }}
    </p>
    <p class="text-h5 text-center mb-8">
      {{ $t('roleSelectionView.roleSelection') }}
    </p>
    <v-row>
      <v-col>
        <RoleCardButton
          role="supervisor"
          :title="$t('roleSelectionView.supervisorTitle')"
          :description="$t('roleSelectionView.supervisorDescription')"
          :imgSrc="SupervisorImg"
          :imgAlt="$t('supervisor')"
          @click="redirectToDashboard('supervisor')"
        />
      </v-col>
      <v-col>
        <RoleCardButton
          role="student"
          :title="$t('roleSelectionView.studentTitle')"
          :description="$t('roleSelectionView.studentDescription')"
          :imgSrc="StudentImg"
          :imgAlt="$t('student')"
          @click="redirectToDashboard('student')"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import RoleCardButton from '@/components/ui/RoleCardButton.vue';
import StudentImg from '@/assets/student.jpg';
import SupervisorImg from '@/assets/supervisor.png';
import AuthApiService from '@/services/authApiService';
import loginErrorHandler from '@/utils/loginErrorHandler';

const router = useRouter();
const store = useStore();
const { t } = useI18n();

const user = computed(() => store.getters['auth/user']);

const redirectToDashboard = async (role) => {
  try {
    const roleValue = role === 'supervisor' ? 1 : 0;
    const response = await AuthApiService.updateUserPartially(
      { user_role: roleValue },
      user.value.id
    );
    const newAccessToken = response.data.new_jwt_token;
    if (newAccessToken) {
      AuthApiService.setAccessToken(newAccessToken);
      store.dispatch('auth/login', { access_token: newAccessToken });
    }
    store.dispatch('auth/setUser', response.data);
    router.push({ path: `/dashboard/${role}` });
  } catch (error) {
    console.error('Error updating user role:', error);
    if (error.response?.status === 401) {
      AuthApiService.logout();
      loginErrorHandler.setLoginError(t('errors.roleSelection.sessionExpired'));
    } else {
      loginErrorHandler.setLoginError(t('errors.roleSelection.updateFailed'));
    }
  }
};
</script>
