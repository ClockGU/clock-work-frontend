/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import LandingView from "@/views/LandingView.vue";
import RoleSelectionView from "@/views/RoleSelectionView.vue";


/*function isAuthenticatedGuard(to, from, next) {
  const store = useStore();
  if (!store.getters.isLoggedIn) {
    next({ path: "/" });
    return;
  }
  next();
}*/

const routes = [
  { path: "/", component: LandingView },
  { path: "/logging-in", component: LoginView },
  { path: "/roles", component: RoleSelectionView, name: "roles" },
  //{ path: "/main", component: ContentView, beforeEnter: [isAuthenticatedGuard] }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
});

export default router;
