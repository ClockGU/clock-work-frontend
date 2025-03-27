<template>  
    <v-app-bar app flat fixed elevation="0" :color="bgColor" aria-label="Application navigation">  
      <v-app-bar-nav-icon  
        v-if="isLoggedIn"  
        class="hidden-md-and-up"  
        @click="toggleNavigationdrawer"  
        aria-label="Toggle navigation drawer"  
      >  
        <v-icon>{{ icons.mdiMenu }}</v-icon>  
      </v-app-bar-nav-icon>  

      <v-toolbar-title>  
        <router-link  
          v-slot="{ navigate }"  
          :to="{ name: 'roles' }"  
          custom  
          aria-label="Go to roles page"  
        >  
          <span  
            role="link"  
            style="cursor: pointer"  
            @click="navigate"  
            @keypress.enter="navigate"  
          >  
            <v-img  
              width="96px"  
              height="32px"  
              :src="imgSrc"  
              :alt="'clockLogo'"  
            />  
          </span>  
        </router-link>  
      </v-toolbar-title>  

      <v-spacer></v-spacer>  

      <!-- <ThemeToggle />   
      -->  

      <LanguageSwitcher />

      <v-skeleton-loader  
        v-if="isLoggedIn && mdAndUp"  
        :loading="userLoading"  
        type="avatar"  
        aria-label="User avatar"  
      >  
        <v-menu class="py-3" aria-label="User menu">  
          <template #activator="{ props }">  
            <v-btn :color="bgColor" variant="flat" v-bind="props">  
              <div class="d-flex align-center">  
                <v-avatar  
                  size="30px"  
                  color="blue-lighten-2"  
                  style="cursor: pointer"  
                  class="mr-2"  
                >  
                  <span class="text-white">{{ firstLetter }}</span>  
                </v-avatar>  
                <span class="text-capitalize">{{ user.first_name }}</span>  
              </div>  
              <v-icon :icon="icons.mdiChevronDown"></v-icon>  
            </v-btn>  
          </template>  
          <v-list aria-label="User menu options">  
            <v-list-item  
              :prepend-icon="icons.mdiLogout"  
              data-cy="menu-logout"  
              @click="logout"  
              :aria-label="$t('logout')"  
            >  
              {{ $t('logout') }}  
            </v-list-item>  
          </v-list>  
        </v-menu>  
      </v-skeleton-loader>  
    </v-app-bar>  
</template>  

<script setup>  
import { mdiChevronDown, mdiMenu, mdiLogout } from "@mdi/js";  
import svg from "@/assets/clock_full.svg";
import darkSvg from "@/assets/clock_full_darkmode.svg";
import { useDisplay } from "vuetify";
import LanguageSwitcher from "@/components/app-bar/LanguageSwitcher.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const icons = {  
  mdiMenu,  
  mdiChevronDown,  
  mdiLogout  
};  

const isLoggedIn = true;  
const user = {  
  first_name: "John Doe",  
  email: "john@example.com"  
};  
const userLoading = false;  

const bgColor = "#FFFFFF"; // Adjust the background color as needed  
const imgSrc = svg; // Set your logo source here  
const { mdAndUp } = useDisplay();
const emit = defineEmits(["toggle"]);
const toggleNavigationdrawer = () => {  
  emit("toggle");  
};  

const firstLetter = user.first_name.charAt(0);  

const logout = () => {  
  // Handle logout logic here  
};  
</script>


