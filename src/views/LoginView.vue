<template>
    <v-container>
      <v-row justify="center">
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-row>
      <v-row class="mt-10" justify="center">
        {{ $t("app.loggingin") }}
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "LoggingIn"
  };
  </script>