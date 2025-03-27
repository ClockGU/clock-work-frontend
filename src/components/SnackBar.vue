<template>
    <div>
      <v-snackbar
        v-for="(snack, i) in snacks"
        :key="snack.uuid"
        v-model="snack.show"
        data-cy="snackbar"
        location="top right"
        multi-line
        :color="snack.color"
        :timeout="snack.timeout"
        :style="{ 'margin-top': i * 70 + 'px' }"
      >
        {{ snack.message }}
        <template #actions>
          <component
            :is="snack.component"
            v-bind="snack.componentProps"
          ></component>
          <v-btn variant="text" @click="snack.show = false">
            close
          </v-btn>
        </template>
        <v-progress-linear
          reverse
          color="white"
          :model-value="(timePassed[snack.uuid] / snack.timeout) * 100"
        ></v-progress-linear>
      </v-snackbar>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue'
  import { useStore } from 'vuex'
  
  const store = useStore()
  const snacks = ref([])
  const timePassed = ref({})
  const intervals = ref({})
  
  onMounted(() => {
    store.watch(
      (state, getters) => getters["snackbar/snacks"],
      () => {
        snacks.value = store.getters["snackbar/snacks"];
        snacks.value.forEach((snack) => {
          if (intervals.value[snack.uuid] === undefined) {
            setupInterval(snack);
            setupTimeout(snack);
          }
        });
      },
      {
        deep: true
      }
    );
  })
  
  const setupInterval = (snack) => {
    intervals.value[snack.uuid] = setInterval(() => {
      timePassed.value[snack.uuid] =
        (timePassed.value[snack.uuid] !== undefined
          ? timePassed.value[snack.uuid]
          : 0) + 500;
    }, 500);
  }
  
  const setupTimeout = (snack) => {
    setTimeout(() => {
      removeSnack(snack.uuid);
    }, snack.timeout);
  }
  
  const removeSnack = (uuid) => {
    delete timePassed.value[uuid];
    clearInterval(intervals.value[uuid]);
    delete intervals.value[uuid];
    store.dispatch("snackbar/removeSnack", uuid);
  }
  </script>
  