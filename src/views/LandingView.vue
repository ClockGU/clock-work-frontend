<template>
  <div class="h-100">
    <v-row v-if="!mdAndUp" role="banner">
      <v-col class="d-flex mb-6" cols="12" style="justify-content: center">
        <ClockIcon :size="mdAndUp ? 400 : 300" aria-hidden="true" />
      </v-col>
    </v-row>
    <v-row align="center" role="main">
      <v-col v-if="mdAndUp" class="d-flex" cols="6" style="justify-content: end">
        <ClockIcon size="600" aria-hidden="true" />
      </v-col>
      <v-col
        :class="!mdAndUp ? 'd-flex' : ''"
        :cols="mdAndUp ? 6 : 12"
        :style="!mdAndUp ? { 'justify-content': 'center' } : {}"
      >
        <v-card max-width="600" role="region" aria-label="Login Card">
          <v-card-text style="text-align: center">
            <h2>{{ $t("welcome") }}</h2>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-tooltip
              location="bottom"
              :model-value="hasError"
              role="tooltip"
            >
              <template #activator="{ props }">
                <ButtonGoetheOAuth color="secondary" v-bind="props">
                  {{ $t("login") }}
                </ButtonGoetheOAuth>
              </template>
              <span style="color: black">{{ error }}</span>
            </v-tooltip>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import ClockIcon from "@/components/logo/ClockIcon.vue";
import ButtonGoetheOAuth from "@/components/ButtonGoetheOAuth.vue";
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";

const error = ref("");
const { mdAndUp } = useDisplay();
const hasError = computed(() => error.value !== "");

</script>

<style scoped lang="scss">
.v-tooltip :deep(.v-overlay__content) {
  background-color: rgb(var(--v-theme-error));
}
</style>

