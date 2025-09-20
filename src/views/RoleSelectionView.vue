<template>
    <v-container class="d-flex flex-column justify-end align-center"> 
    <v-spacer></v-spacer> 
      <p class="text-h2 font-weight-medium ">{{ $t('roleSelectionView.welcome') }}</p>  
      <p class="text-h5 text-center mb-8">{{ $t('roleSelectionView.roleSelection') }}</p>  
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
  import { computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';  
  import { useStore } from 'vuex'; 
  import RoleCardButton from '@/components/ui/RoleCardButton.vue';
  import StudentImg from '@/assets/student.jpg';
  import SupervisorImg from '@/assets/supervisor.png';
  import AuthApiService from '@/services/authApiService';

  const router = useRouter();  
  const store = useStore();  
  const user = computed(() => store.getters["auth/user"]);  
  const token = computed(() => store.getters["auth/accessToken"]);  

  const redirectToDashboard = async (role) => {
    try {
      const roleValue = role === "supervisor" ? 2 : 0;
      // Update user role on backend
      const response =  await AuthApiService.updateUser({ user_role: roleValue }, user.value.id);
      store.dispatch('auth/setUser', response.data);
      // Refresh user data from backend to ensure consistency
      await AuthApiService.refreshToken(token.value);
      router.push({ path: `/dashboard/${role}` });
    } catch (error) {
      console.error("Error updating user role ", error);
      AuthApiService.logout();
      store.dispatch("auth/setLoginError", "Error updating user role");
      router.push({ name: "landing" });
    }
  };
  onMounted(() => {
    if (token.value) {
      AuthApiService.setAccessToken(token.value);
      }
  })
  </script>  