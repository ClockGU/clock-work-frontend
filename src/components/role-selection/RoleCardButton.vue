<template>  
  <v-btn
    :aria-label="`Select role as ${role}`"
    class="card-button d-flex flex-column align-center justify-center pa-4"
    @click="handleClick"

  >
    <v-card
      class="card-button d-flex flex-column align-center justify-center"
      style="background-color: transparent; box-shadow: none;"
    >
      <v-card-title 
      class="text-h5 text-high-emphasis mt-4" >{{ title }}</v-card-title>  
      <v-img :src="props.imgSrc" width="200" height="200" :alt="`role image as ${props.role}`"/>
      <v-card-text class="description text-body-1 text-medium-emphasis">{{ description }}</v-card-text>  
    </v-card>  
  </v-btn>
</template>  
  
  <script setup>
import ApiService from '@/services/api';
import { computed } from 'vue';
import { useRouter } from 'vue-router';  
import { useStore } from 'vuex'; 
  const props = defineProps({  
    title: {  
      type: String,  
      required: true,  
    },  
    description: {  
      type: String,  
      required: true,  
    },  
    role: {  
      type: String,  
      required: true,  
    }, 
    imgSrc: {
      type: String,
      required: true
    }
  });  

  const router = useRouter(); 
  const store = useStore(); 
  const user =computed(() => store.getters["auth/user"]);
  const token = computed(() => store.getters["auth/accessToken"]);
  console.log("user", user.value);
  console.log("token", token.value);

  const handleClick = async() => { 
    if (token.value) {
    ApiService.setAccessToken(token.value);
  }
    if(props.role === "supervisor"){
      await ApiService.put(`users/${user.value.id}`,{user_role: 1});
    }
    store.dispatch('auth/setHasRole', true);
    router.push({ path: `/dashboard/${props.role}` });
  };  
  </script>  
  
  <style scoped>  
  .card-button {  
    background-color: #fafafa;  
    border-radius: 10px;  
    transition: transform 0.2s, box-shadow 0.2s; 
    height: 400px; 
    width: 300px;
    cursor: pointer
  }  
  .card-button:hover {  
    transform: translateY(-5px);  
  }  
  .description {
    text-align: center;
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: normal;
    width: 300px;
    word-wrap: break-word;
  }
  </style>

