<template>
    <v-navigation-drawer
      :model-value="drawer"
      app
      left
      disable-resize-watcher
      clipped
      @update:model-value="closeDrawer"
    >
      <v-row class="mt-4 mb-4" justify="center">
        <router-link v-slot="{ navigate }" :to="redirectTo" custom>
          <span
            role="link"
            style="cursor: pointer"
            @click="navigate"
            @keypress.enter="navigate"
          >
            <v-img width="240px" height="36px" :src="svg" alt="clock Logo" />
          </span>
        </router-link>
      </v-row>
  
      <v-divider></v-divider>
  
      <v-skeleton-loader
        v-if="isLoggedIn && userLoading"
        :loading="userLoading"
        type="heading"
        width="300px"
        class="pl-2 py-3"
      >
      </v-skeleton-loader>
      <v-list v-else>
        <v-list-group no-action>
          <template #activator="{ props }">
            <v-list-item v-bind="props">
              <template #prepend="prependProps">
                <v-avatar
                  v-bind="prependProps"
                  size="32px"
                  color="blue-lighten-2"
                  style="cursor: pointer"
                >
                  <div class="text-white">
                    {{ firstLetter }}
                  </div>
                </v-avatar>
              </template>
              <p class="text-h6">
                {{ user.first_name }}
              </p>
            </v-list-item>
          </template>
  
          <v-list-item
            v-for="item in menuItems"
            :key="item.text"
            :to="item.to"
            style="--indent-padding: calc(var(--list-indent-size) - 12px)"
          >
            <template #prepend="prependProps">
              <v-icon :icon="item.icon" v-bind="prependProps"></v-icon>
            </template>
            <p style="padding-left: 4px">{{ item.text }}</p>
          </v-list-item>
  
          <v-list-item  
              :prepend-icon="icons.mdiLogout"  
              data-cy="menu-logout" 
              @click="logout"   
            >  
              Logout  
            </v-list-item> 
        </v-list-group>
      </v-list>
  
      <v-divider></v-divider>
  
      <v-list nav density="compact" data-cy="menu-list">
        <v-list-item
          v-for="link in links"
          :key="link.text"
          :prepend-icon="link.icon"
          :to="link.to"
        >
          <p>{{ link.text }}</p>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { mdiAccountCog, mdiCalendar, mdiHome, mdiFileDocument, mdiLock, mdiFormatListNumbered, mdiFileChart, mdiHelp, mdiLogout } from "@mdi/js";
  import {useStore} from "vuex";
  import svg from "@/assets/clock_full.svg";

  const props = defineProps({
    drawer: {
      type: Boolean,
      default: false
    },
  });
  const emit = defineEmits(["closeDrawer"]);

  const icons = {
    mdiAccountCog,
    mdiCalendar,
    mdiHome,
    mdiFileDocument,
    mdiLock,
    mdiFormatListNumbered,
    mdiFileChart,
    mdiHelp,
    mdiLogout
  };

  const store = useStore();
  const menuItems = ref([
    /*{
      text: "Settings",
      to: { name: "settings" },
      icon: mdiAccountCog,
      loggedOut: false,
      withoutContract: true
    },
    {
      text: "FAQ",
      to: { name: "faq" },
      icon: mdiHelp,
      loggedOut: true
    }*/
  ]);
  const links = ref([
    /*{
      text: "Dashboard",
      to: {
        name: "roles"
      },
      icon: mdiHome,
      loggedOut: false
    },*/

  ]);

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

  const closeDrawer = (value) => {
    if (!value) {
      emit("closeDrawer");
    }
  };
  const logout = () => {  
    store.dispatch('auth/setIsLoading');
    window.location ="https://cas.rz.uni-frankfurt.de/cas/logout";
    store.dispatch('auth/logout');
    store.dispatch('auth/unsetLoading');
  };  
  </script>
