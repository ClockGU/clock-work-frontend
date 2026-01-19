<template>
  <v-btn
    :aria-label="`Select role as ${role}`"
    class="card-button d-flex flex-column align-center justify-center pa-4"
  >
    <v-card
      class="card-button d-flex flex-column align-center justify-center"
      style="background-color: transparent; box-shadow: none"
    >
      <v-card-title class="text-h5 text-high-emphasis mt-4">{{
        title
      }}</v-card-title>
      <v-img :src="props.imgSrc" width="200" height="200" :alt="props.imgAlt" />
      <v-card-text class="description text-body-1 text-medium-emphasis">{{
        description
      }}</v-card-text>
    </v-card>
  </v-btn>
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
    required: true,
  },
  imgAlt: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.card-button {
  background-color: #fafafa;
  border-radius: 10px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  height: 400px;
  width: 300px;
  cursor: pointer;
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
