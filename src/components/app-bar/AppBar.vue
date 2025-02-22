<template>  
  <!--<portal-target  
    :slot-props="{ action: () => toggleNavigationdrawer() }"  
    name="app-bar"  
  >-->  
    <v-app-bar app flat fixed elevation="0" :color="bgColor">  
      <v-app-bar-nav-icon  
        v-if="isLoggedIn"  
        class="hidden-md-and-up"  
        @click="toggleNavigationdrawer"  
      >  
        <v-icon>{{ icons.mdiMenu }}</v-icon>  
      </v-app-bar-nav-icon>  

      <v-toolbar-title>  
        <router-link v-slot="{ navigate }" :to="{ name: 'roles' }" custom>  
          <span  
            role="link"  
            style="cursor: pointer"  
            @click="navigate"  
            @keypress.enter="navigate"  
          >  
            <v-img width="96px" height="32px" :src="imgSrc" />  
          </span>  
        </router-link>  
      </v-toolbar-title>  

      <v-spacer></v-spacer>  

      <!-- <ThemeToggle />   
      -->  

      <v-skeleton-loader  
        v-if="isLoggedIn && mdAndUp"  
        :loading="userLoading"  
        type="avatar"  
      >  
        <v-menu class="py-3">  
          <template #activator="{ props }">  
            <v-btn :color="bgColor" variant="flat">  
              <div class="d-flex align-center" v-bind="props">  
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
          <v-list>  
            <v-list-item  
              :prepend-icon="icons.mdiLogout"  
              data-cy="menu-logout"  
              @click="logout"  
            >  
              Logout  
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
