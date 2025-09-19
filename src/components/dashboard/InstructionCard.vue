<template>
  <v-card class="mb-4 pa-4" role="article">
    <v-card-title>
      <h2 class="text-h5 font-weight-bold mb-4">
        {{ props.title }}
      </h2>
    </v-card-title>
    <v-card-text class="text-body-1">
      {{ props.text }}
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});
</script>
