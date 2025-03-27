<template>
    <v-container class="d-flex flex-column justify-end align-center"> 
    <v-spacer></v-spacer> 
      <p class="text-h2 font-weight-medium ">You are new here!</p>  
      <p class="text-h5 text-center mb-8">Tell us what role you are going to play here:</p>  
      <v-row>  
        <v-col>  
          <RoleCardButton  
            title="Supervisor"  
            description="As a supervisor you hire and supervise student assistants"  
            role="supervisor" 
            :imgSrc="SupervisorImg" 
          />  
        </v-col>  
        <v-col>  
          <RoleCardButton  
            title="Student"  
            description="As a student you can manage hire petitions and work for the university"  
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
