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

onMounted(async () => {
  const { code } = route.query; // Extract the code from the query parameters

  if (!code) {
    // If no code is present, redirect back to the landing page
    router.push({ name: "landing" });
    return;
  }

  try {
    // Use the auth module to handle the login with the CAS token
    await store.dispatch("auth/LOGIN", { casToken: code });

    // Fetch user data after successful login
    await store.dispatch("GET_USER");

    // Redirect to the /roles route after successful login
    router.push({ name: "roles" });
  } catch (error) {
    console.error("Error during login:", error);

    //TODO: Handle errors (e.g., show a snackbar or redirect to an error page)
    

    // Redirect back to the landing page
    router.push({ name: "landing" });
  }
});
</script>
  
  <style scoped lang="scss">
  .v-tooltip :deep(.v-overlay__content) {
    background-color: rgb(var(--v-theme-error));
  }
  </style>