<template>
  <v-img :width="dimension" :height="dimension" :src="imgSrc"  alt="clock Logo"/>
</template>
<script setup>
import { ref } from "vue";
import lightImg from "@/assets/clock.svg";

const props = defineProps({
  size: {
    type: [String, Number],
    required: true
  }
});
const dimension = ref(props.size);
const imgSrc = ref(lightImg);
</script>
<style scoped lang="sass"></style>
