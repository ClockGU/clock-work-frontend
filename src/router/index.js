/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */
// Composables
import { createRouter, createWebHistory } from "vue-router";
import LoggingInView from  "@/views/LoggingInView.vue"
import LandingView from "@/views/LandingView.vue";
import RoleSelectionView from "@/views/RoleSelectionView.vue";
import RoleDashboard from "@/views/RoleDashboard.vue";
import { useStore } from "vuex";

/*function isAuthenticatedGuard(to, from, next) {
  const store = useStore();
  if (!store.getters["auth/loggedIn"]) {
    next({ path: "/" });
    return;
  }
  next();
}*/

const routes = [
  { path: "/", component: LandingView, name: "landing" },
  { path: "/logging-in", component: LoggingInView, name: "logging-in" },
  { path: "/roles", component: RoleSelectionView, name: "roles" },
  { path: "/dashboard/:role", component: RoleDashboard },
];

const router = createRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  history: createWebHistory(),
  routes: routes,
  
});


export default router;

