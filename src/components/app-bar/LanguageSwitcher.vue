<template>
  <v-menu
    location="bottom left"
    offset-y
    max-height="calc(100% - 16px)"
    transition="slide-y-transition"
  >
    <template #activator="{ props }">
      <v-btn class="text-capitalize" variant="text" v-bind="props">
        <v-icon :start="smAndUp" :icon="icons.mdiTranslate" />
        <span
          class="text-subtitle-1 text-capitalize font-weight-light hidden-xs-and-down"
          v-text="selectedLocaleName"
        />
        <v-icon class="hidden-sm-and-down" :icon="icons.mdiChevronDown" end />
      </v-btn>
    </template>

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in locales"
        :key="item.locale"
        @click="switchLocale(item.locale)"
      >
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { computed } from 'vue';
import { mdiChevronDown, mdiTranslate } from '@mdi/js';
import { useDisplay } from 'vuetify';
import { useStore } from 'vuex';
import { getCurrentLocale, setLocale } from '@/plugins/i18n';
import AuthApiService from '@/services/authApiService';

const { smAndUp } = useDisplay();
const store = useStore();

const icons = { mdiChevronDown, mdiTranslate };
const locales = [
  { name: 'Deutsch', locale: 'de' },
  { name: 'English', locale: 'en' },
];

const user = computed(() => store.getters['auth/user']);
const selectedLocaleName = computed(() => {
  const currentLocale = getCurrentLocale();
  const match = locales.find((item) => item.locale === currentLocale);
  return match ? match.name : locales[0].name;
});

const switchLocale = async (newLocale) => {
  const currentLocale = getCurrentLocale();
  if (currentLocale === newLocale) return;
  try {
    setLocale(newLocale);
    const userId = user.value?.id;
    if (userId) {
      await AuthApiService.updateUserPartially({ language: newLocale }, userId);
    }
  } catch (error) {
    console.error('Failed to update language:', error);
    setLocale(currentLocale);
  }
};
</script>
