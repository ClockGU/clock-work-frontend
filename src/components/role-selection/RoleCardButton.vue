<template>  
    <v-card  
      :aria-label="`Select role as ${role}`"  
      @click="handleClick"  
      class="d-flex flex-column align-center justify-center pa-4 card-button"  
      style="cursor: pointer;"  
    >  
      <v-card-title class="headline">{{ title }}</v-card-title>  
      <v-img :src="props.imgSrc" width="200" height="200"/>
      <v-card-text class="description">{{ description }}</v-card-text>  
    </v-card>  
  </template>  
  
  <script setup>    
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
  const handleClick = () => {  
    console.log(`Role selected: ${props.role}`);  
    // Call your API method here to patch the role  
  };  
  </script>  
  
  <style scoped>  
  .card-button {  
    background-color: #fafafa;  
    border-radius: 10px;  
    transition: transform 0.2s, box-shadow 0.2s; 
    min-height: 350px; 
    max-width: 300px;
  }  
  
  .card-button:hover {  
    transform: translateY(-5px);  
  }  
  
  /* Add some text styling */  
  .headline {  
    font-size: 1.5rem;  
    font-weight: bold;  
    color: #333;  
  }  
  
  .description {  
    margin-top: 15px;  
    color: #666;  
    text-align: center;  
  }  
  </style>
