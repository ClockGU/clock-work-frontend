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
import RoleDashboard from "@/views/RoleDashboard.vue";

const routes = [
  { path: "/", component: LandingView,name: "landing" },
  { path: "/logging-in", component: LoginView },
  { path: "/roles", component: RoleSelectionView, name: "roles" },
  { path: "/dashboard/:role", component: RoleDashboard },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
});

export default router;
