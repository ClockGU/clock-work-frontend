<template>  
  <v-btn
    :aria-label="`Select role as ${role}`"
    @click="handleClick"
    class="card-button d-flex flex-column align-center justify-center pa-4"
    style="cursor: pointer;"
  >
    <v-card
      class="card-button d-flex flex-column align-center justify-center"
      style="background-color: transparent; box-shadow: none;"
    >
      <v-card-title class="headline mt-4">{{ title }}</v-card-title>  
      <v-img :src="props.imgSrc" width="200" height="200"/>
      <v-card-text class="description">{{ description }}</v-card-text>  
    </v-card>  
  </v-btn>
</template>  
  
  <script setup>
  import { useRouter } from 'vue-router';    
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
  const handleClick = () => {  
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
  }  
  
  .card-button:hover {  
    transform: translateY(-5px);  
  }  
  
  .headline {  
  font-size: 1.5rem;  
  font-weight: bold;  
  color: #333;  
  text-align: center;
}
  
  .description {
    color: #666;
    text-align: center;
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: normal;
    width: 300px;
    word-wrap: break-word;
  }
  </style>

