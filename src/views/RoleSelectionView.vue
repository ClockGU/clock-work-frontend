<template>
    <v-container class="d-flex flex-column justify-end align-center"> 
    <v-spacer></v-spacer> 
      <p class="text-h2 font-weight-medium ">{{ $t('roleSelectionView.welcome') }}</p>  
      <p class="text-h5 text-center mb-8">{{ $t('roleSelectionView.roleSelection') }}</p>  
      <v-row>  
        <v-col>  
          <RoleCardButton  
            :title="$t('roleSelectionView.supervisorTitle')"  
            :description="$t('roleSelectionView.supervisorDescription')"  
            role="supervisor" 
            :imgSrc="SupervisorImg" 
          />  
        </v-col>  
        <v-col>  
          <RoleCardButton  
            :title="$t('roleSelectionView.studentTitle')"  
            :description="$t('roleSelectionView.studentDescription')"  
            role="student" 
            :imgSrc="StudentImg"  
          />  
        </v-col>  
      </v-row>  
    </v-container>
  </template>  
  
  <script setup>  
  import RoleCardButton from '@/components/role-selection/RoleCardButton.vue';
  import StudentImg from '@/assets/student.jpg';
  import SupervisorImg from '@/assets/supervisor.png';

  </script>  