<template>
  <v-row v-if="!mdAndUp" align="center">
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
              <ButtonGoetheOAuth color="secondary" @start="onOAuthStart" @error="onOAuthError">
                Login with OAuth
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
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const router = useRouter();
const store = useStore();


</script>
  
  <style scoped lang="scss">
  .v-tooltip :deep(.v-overlay__content) {
    background-color: rgb(var(--v-theme-error));
  }
  </style>