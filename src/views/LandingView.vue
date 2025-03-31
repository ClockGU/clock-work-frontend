<template>
  <div class="h-100 d-flex flex-column align-center justify-center">
    <!-- Clock Icon Row (same as before) -->
    <v-row v-if="!mdAndUp" role="banner">
      <v-col class="d-flex mb-6" cols="12" style="justify-content: center">
        <ClockIcon :size="mdAndUp ? 400 : 300" aria-hidden="true" />
      </v-col>
    </v-row>

    <v-row align="center" justify="center" role="main" class="flex-column ma-0" style="width: 100%">
      <!-- Clock Icon Column (for mdAndUp) -->
      <v-col v-if="mdAndUp" class="d-flex" cols="6" style="justify-content: end">
        <ClockIcon size="600" aria-hidden="true" />
      </v-col>

      <!-- Cards Container -->
      <div class="d-flex flex-column align-center" style="gap: 24px; max-width: 600px; width: 100%">
        <!-- Welcome Card -->
        <v-card width="100%" role="region" aria-label="Welcome Card">
          <v-card-text style="text-align: center">
            <h2>{{ $t("welcome") }}</h2>
          </v-card-text>
          <v-card-actions style="justify-content: center">
            <ButtonGoetheOAuth color="secondary">
              {{ $t("login") }}
            </ButtonGoetheOAuth>
          </v-card-actions>
        </v-card>

        <v-slide-y-transition>
          <v-card
            v-if="hasError"
            width="100%"
            color="error"
          >
            <v-card-text class="text-white text-center font-weight-bold ">
              {{ error }}
            </v-card-text>
          </v-card>
        </v-slide-y-transition>
      </div>
    </v-row>
  </div>
</template>

<script setup>
import ClockIcon from "@/components/logo/ClockIcon.vue";
import ButtonGoetheOAuth from "@/components/ButtonGoetheOAuth.vue";
import { computed } from "vue";
import { useDisplay } from "vuetify";
import {useStore} from "vuex"

const store= useStore()
const error = computed(()=>store.getters["auth/loginError"]);
const { mdAndUp } = useDisplay();
const hasError = computed(() => error.value!=="");

</script>

<style scoped lang="scss">
.v-tooltip :deep(.v-overlay__content) {
  background-color: rgb(var(--v-theme-errors));
}
</style>

