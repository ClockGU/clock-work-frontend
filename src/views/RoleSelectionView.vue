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
            @click="redirectToDashboard('supervisor')"
          />  
        </v-col>  
        <v-col>  
          <RoleCardButton  
            :title="$t('roleSelectionView.studentTitle')"  
            :description="$t('roleSelectionView.studentDescription')"  
            role="student" 
            :imgSrc="StudentImg"  
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
  import ApiService from '@/services/api';
  import RoleCardButton from '@/components/role-selection/RoleCardButton.vue';
  import StudentImg from '@/assets/student.jpg';
  import SupervisorImg from '@/assets/supervisor.png';

  const router = useRouter();  
  const store = useStore();  
  const user = computed(() => store.getters["auth/user"]);  
  const token = computed(() => store.getters["auth/accessToken"]);  

  const redirectToDashboard = async (role) => {
  try {
    if (token.value) {
      ApiService.setAccessToken(token.value);
    }

    const roleValue = role === "supervisor" ? 1 : 0;
    await ApiService.put(`users/${user.value.id}`, { user_role: roleValue });

    const updatedUser = { 
      ...user.value, 
      user_role: roleValue 
    };
    store.dispatch('auth/setIsRoleSelected', true);
    store.dispatch('auth/setUser', updatedUser);
    router.push({ path: `/dashboard/${role}` });
  } catch (error) {
    console.error("Error updating user role ",error);
    store.dispatch("auth/setError","Error updating user role")
    store.dispatch("auth/logout");
    router.push({ name: "landing" }); 
  }
};
  </script>  