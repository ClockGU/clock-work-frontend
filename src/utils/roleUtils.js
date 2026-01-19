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

export const isStudent = computed(() => userRole.value === 0);
export const isSupervisor = computed(() => userRole.value === 1);
export const isClerk = computed(() => userRole.value === 2);
export const isApprover = computed(
  () => router.currentRoute.value.name === 'approver'
);

export const currentRole = computed(() => {
  if (isApprover.value) return Roles.APPROVER;
  if (isClerk.value) return Roles.CLERK;
  if (isSupervisor.value) return Roles.SUPERVISOR;
  if (isStudent.value) return Roles.STUDENT;
  return null;
});
