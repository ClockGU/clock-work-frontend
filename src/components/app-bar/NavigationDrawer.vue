<template>
  <v-navigation-drawer
    :model-value="drawer"
    app
    left
    disable-resize-watcher
    clipped
    :aria-label="$t('ariaLabel.navigation.navDrawer')"
    role="navigation"
    @update:model-value="closeDrawer"
  >
    <v-row class="mt-4 mb-4" justify="center">
      <router-link
        v-slot="{ navigate }"
        :to="redirectTo"
        custom
        :aria-label="
          redirectTo === '/roles'
            ? $t('ariaLabel.navigation.roles')
            : $t('ariaLabel.navigation.dashboard')
        "
      >
        <a
          style="display: inline-block; cursor: pointer"
          @click="navigate"
          @keypress.enter="navigate"
        >
          <v-img
            width="240px"
            height="36px"
            :src="svg"
            alt="clock Logo"
            aria-hidden="false"
          />
        </a>
      </router-link>
    </v-row>

    <v-divider role="separator" aria-orientation="horizontal"></v-divider>
    <v-list
      v-if="isLoggedIn"
      tabindex="0"
      role="menu"
      :aria-label="$t('ariaLabel.navigation.menu')"
    >
      <v-list-group no-action>
        <template #activator="{ props }">
          <v-list-item v-bind="props" role="menuitem">
            <template #prepend="prependProps">
              <v-avatar
                v-bind="prependProps"
                size="32px"
                color="blue-darken-3"
                style="cursor: pointer"
                :aria-label="$t('ariaLabel.navigation.avatar')"
              >
                <span class="text-white">
                  {{ firstLetter }}
                </span>
              </v-avatar>
            </template>
            <span class="text-h6">
              {{ user.first_name }}
            </span>
          </v-list-item>
        </template>

        <v-list-item
          v-for="item in menuItems"
          :key="item.text"
          :to="item.to"
          style="--indent-padding: calc(var(--list-indent-size) - 12px)"
          role="menuitem"
        >
          <template #prepend="prependProps">
            <v-icon :icon="item.icon" v-bind="prependProps" role="img"></v-icon>
          </template>
          <span style="padding-left: 4px">{{ item.text }}</span>
        </v-list-item>

        <v-list-item
          :prepend-icon="icons.mdiLogout"
          data-cy="menu-logout"
          @click="logout"
          role="menuitem"
        >
          {{ $t('logout') }}
        </v-list-item>
      </v-list-group>
    </v-list>

    <v-divider role="separator" aria-orientation="horizontal"></v-divider>
    <!--
      <v-list nav density="compact" data-cy="menu-list">
        <v-list-item
          v-for="link in links"
          :key="link.text"
          :prepend-icon="link.icon"
          :to="link.to"
          role="menuitem"
        >
          <span>{{ link.text }}</span>
        </v-list-item>
      </v-list>
      -->
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  mdiAccountCog,
  mdiCalendar,
  mdiHome,
  mdiFileDocument,
  mdiLock,
  mdiFormatListNumbered,
  mdiFileChart,
  mdiHelp,
  mdiLogout,
} from '@mdi/js';
import { useStore } from 'vuex';
import svg from '@/assets/clock_full.svg';

const props = defineProps({
  drawer: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['closeDrawer']);

const icons = {
  mdiAccountCog,
  mdiCalendar,
  mdiHome,
  mdiFileDocument,
  mdiLock,
  mdiFormatListNumbered,
  mdiFileChart,
  mdiHelp,
  mdiLogout,
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
/*const links = ref([
    {
      text: "Dashboard",
      to: {
        name: "roles"
      },
      icon: mdiHome,
      loggedOut: false
    },

  ]);*/

const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);
const user = computed(() => store.getters['auth/user']);

const firstLetter = computed(() => user.value?.first_name?.charAt(0) || '');

const redirectTo = computed(() => {
  if (!isLoggedIn.value) return '/';

  switch (user.value?.user_role) {
    case 3:
      return '/approver';
    case 2:
      return '/clerk';
    case 1:
      return '/dashboard/supervisor';
    case 0:
      return '/dashboard/student';
    default:
      return '/roles';
  }
});

const closeDrawer = (value) => {
  if (!value) {
    emit('closeDrawer');
  }
};
const logout = () => {
  store.dispatch('auth/logout');
};
</script>
