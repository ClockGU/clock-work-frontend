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
          :to="redirectTo"  
          custom  
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
import svg from "@/assets/clock_full.svg";
import { mdiChevronDown, mdiMenu, mdiLogout } from "@mdi/js";  
import { useDisplay } from "vuetify";
import { useStore } from 'vuex';
import {computed} from 'vue';
import LanguageSwitcher from "@/components/app-bar/LanguageSwitcher.vue";

const icons = {  
  mdiMenu,  
  mdiChevronDown,  
  mdiLogout  
};  
const bgColor = "#FFFFFF"; 
const imgSrc = svg;  
const { mdAndUp } = useDisplay();
const store = useStore();

const emit = defineEmits(["toggle"]);

const isLoggedIn = computed(()=>store.getters['auth/isLoggedIn']);  
const user = computed(()=>store.getters['auth/user']);
const userLoading = computed(()=>store.getters['auth/isLoading']);  
const isRoleSelected = computed(()=>store.getters["auth/isRoleSelected"])
const firstLetter = computed(() => user.value?.first_name?.charAt(0) || '');

const redirectTo = computed(() => {
  if (!isLoggedIn.value) return "/";
  
  const userRole = user.value?.user_role;
  if (userRole === 2) return "/clerk";
  if (userRole === 1) return "/dashboard/supervisor";
  if (userRole === 0 && isRoleSelected.value) return "/dashboard/student";
  return "/roles";
});

const toggleNavigationdrawer = () => {  
  emit("toggle");  
};  
const logout = () => {  
  store.dispatch('auth/setIsLoading');
  window.location ="https://cas.rz.uni-frankfurt.de/cas/logout";
  store.dispatch('auth/logout');
  store.dispatch('auth/unsetLoading');
};  
</script>


