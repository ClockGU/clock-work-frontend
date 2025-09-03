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
import ClerkView from "@/views/ClerkView.vue";
import ApproverView from "@/views/ApproverView.vue";
import ImprintView from "@/views/ImprintView.vue";
import GdprView from "@/views/GdprView.vue";

const routes = [
  {
    path: "/",
    name: "landing",
    component: LandingView,
  },
  {
    path: "/logging-in",
    name: "logging-in",
    component: LoggingInView,
  },
  {
    path: "/roles",
    name: "roles",
    component: RoleSelectionView,
  },
  {
    path: "/dashboard/:role",
    component: RoleDashboard,
  },
  {
    path: "/clerk",
    name: "clerk",
    component: ClerkView,
  },
  {
    path: "/approver",
    component: ApproverView,
  },
  {
    path: "/impressum",
    name: "imprint",
    component: ImprintView,
  },
  {
    path: "/privacy",
    name: "privacy",
    component: GdprView,
  },
];

const router = createRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  history: createWebHistory(),
  routes: routes,
});

export default router;

