import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';
import i18n from '@/plugins/i18n';
import loginErrorHandler from '@/utils/loginErrorHandler';
import {isStudent , isSupervisor, isClerk } from '@/utils/roleUtils';
import { parseJwt } from '@/utils/jwt';
import LoggingInView from '@/views/LoggingInView.vue';
import LandingView from '@/views/LandingView.vue';
import RoleSelectionView from '@/views/RoleSelectionView.vue';
import RoleDashboard from '@/views/RoleDashboard.vue';
import ClerkView from '@/views/ClerkView.vue';
import ApproverView from '@/views/ApproverView.vue';
  
const t = i18n.global.t;

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView,
    meta: { isPublic: true },
  },
  {
    path: '/logging-in',
    name: 'logging-in',
    component: LoggingInView,
    meta: { isPublic: true },
  },
  {
    path: '/roles',
    name: 'roles',
    component: RoleSelectionView,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/:role',
    component: RoleDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/clerk',
    name: 'clerk',
    component: ClerkView,
    meta: { requiresAuth: true },
  },
  // Approver will use the signature params to authenticate instead of normal login
  {
    path: '/approver',
    name: 'approver',
    component: ApproverView,
    meta: { isPublic: true },
    beforeEnter: (to) => {
      // Require signature params on entry
      const petitionId = to.query.petition_id;
      const signature = to.query.signature;
      const budgetPositionId = to.query.budget_position_id;

      if (!petitionId || !signature || !budgetPositionId) {
        loginErrorHandler.setLoginError(t("errors.approverView.missingSignature"))
      }
      return true;
    },
  },
];

const router = createRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  history: createWebHistory(),
  routes: routes,
});

// A simple utility to check if a JWT is expired
const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }
  try {
    const { exp } = parseJwt(token);
    return Date.now() >= exp * 1000;
  } catch (e) {
    return true;
  }
};

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const isPublic = to.meta.isPublic;
  const bypassGuard = import.meta.env.VITE_BYPASS_ROLES_GUARD === "true" ;
  const loggedIn = store.getters['auth/isLoggedIn'];
  const accessToken = store.getters['auth/accessToken'];
  const refreshToken = store.getters['auth/refreshToken'];

  // 1. If the route is public, allow navigation immediately.
  if (isPublic) {
    return next();
  }

  // 2. If the route is private and the user is NOT logged in,
  // redirect them to the landing page.
  if (!loggedIn) {
    return next({ name: 'landing' });
  }

  // 3. If the user is logged in, but their access token is expired,
  // attempt to refresh the tokens.
  if (isTokenExpired(accessToken)) {
    // If we have a refresh token, try to get a new access token.
    if (refreshToken) {
      try {
        await store.dispatch('auth/refreshTokens');
      } catch (error) {
        // If refresh fails, log out and redirect to landing.
        console.error('Token refresh failed, logging out:', error);
        await store.dispatch('auth/logout');
        loginErrorHandler.setLoginError(t("errors.refreshToken.failed"))
      }
    } else {
      // If no refresh token, log out and redirect to landing.
      console.log('No refresh token, logging out.');
      await store.dispatch('auth/logout');
      loginErrorHandler.setLoginError(t("errors.refreshToken.missing"))
    }
  }
  let isAuthorized = true;

  // Only run standard checks if bypass is not active for this route
  // bypass is active only for local development and testing purposes
  if (!bypassGuard) {
    // Validate path/params against the user's actual role
    if (isStudent.value && !to.path.includes('student')) isAuthorized = false;
    if (isSupervisor.value && !to.path.includes('supervisor')) isAuthorized = false;
    if (isClerk.value && to.name !== 'clerk') isAuthorized = false;
  }

  if (!isAuthorized) {
    // This triggers the redirect to landing with an error 
    loginErrorHandler.setLoginError(t('errors.roles.unauthorized'));
    return;
  }

  // 4. Everything is fine, the user can proceed to the route.
  return next();
});

export default router;
