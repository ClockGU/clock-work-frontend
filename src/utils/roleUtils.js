import { computed } from 'vue';
import store from '@/store';
import router from '@/router';

export const Roles = Object.freeze({
  STUDENT: 'student',
  SUPERVISOR: 'supervisor',
  APPROVER: 'approver',
  CLERK: 'clerk',
});

const userRole = computed(() => store.getters['auth/userRole']);

export const isStudent = () => userRole.value === 0;
export const isSupervisor = () => userRole.value === 1;
export const isClerk = () => userRole.value === 2;
export function isApprover() {
  return router.currentRoute.value.name === 'approver';
}

export function getRole() {
  if (isApprover()) return Roles.APPROVER;
  if (isClerk()) return Roles.CLERK;
  if (isSupervisor()) return Roles.SUPERVISOR;
  if (isStudent()) return Roles.STUDENT;
  return null;
}

export function hasRole(userRoles) {
  const currentRole = getRole();
  if (!userRoles) return false;
  if (Array.isArray(userRoles)) {
    return userRoles.includes(currentRole);
  }
  return currentRole === userRoles;
}
