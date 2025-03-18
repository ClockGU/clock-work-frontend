<template>
    <v-row v-if="!mdAndUp" align="center" >
      <v-col class="d-flex" cols="12" style="justify-content: center">
        <ClockIcon size="400"></ClockIcon>
      </v-col>
    </v-row>
    <v-row align="center" :style="styles">
      <v-col v-if="mdAndUp" class="d-flex" cols="6" style="justify-content: end">
        <ClockIcon size="600"></ClockIcon>
      </v-col>
      <v-col
        :class="!mdAndUp ? 'd-flex' : ''"
        :cols="mdAndUp ? 6 : 12"
        :style="!mdAndUp ? { 'justify-content': 'center' } : {}"
      >
        <v-card max-width="600">
          <v-card-text style="text-align: center">
            <h2>Willkommen im Vorgesetz&shy;ten&shy;portal von CLOCK Work</h2>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-tooltip
              location="bottom"
              :model-value="hasError"
              @update:model-value=""
            >
              <template #activator="{ props }">
                <ButtonGoetheOAuth >
                  Zum Login
                </ButtonGoetheOAuth>
              </template>
              <span style="color: black"> {{ error }}</span>
            </v-tooltip>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </template>
  
  <script setup>
  import ClockIcon from "@/components/logo/ClockIcon.vue";
  import ButtonGoetheOAuth from "@/components/ButtonGoetheOAuth.vue";
  import { computed, ref } from "vue";
  import { useDisplay } from "vuetify";
  //import { useRouter } from "vue-router"; 
  //const router = useRouter(); // Initialize the router
  const error = ref("");

  const { mdAndUp } = useDisplay();
  const hasError = computed(() => error.value !== ""); 



  </script>
  
  <style scoped lang="scss">
  .v-tooltip :deep(.v-overlay__content) {
    background-color: rgb(var(--v-theme-error));
  }
  </style>