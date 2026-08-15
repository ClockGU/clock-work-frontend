import { computed } from 'vue';
import store from '@/store';
import router from '@/router';

export const Roles = Object.freeze({
  STUDENT: 'student',
  SUPERVISOR: 'supervisor',
  APPROVER: 'approver',
  CLERK: 'clerk',
});

// First unique positions of EOS numbers for
// schultheisFilter:
// FB02, 06, 07, 08, 09, 10, 11, 12, 14, HRZ,
// SLI, Leitungsbüro, IWAK, RS, studiumdigitale,
// Museum Giersch, CGC, Normative Orders,
// Büro f. Chancengerechtigkeit, Mentoring Hessen,
// ISZ, FZG, C3S, HR, F+S
// hamburgerFilter:
// FB01, 03, 04, 05, 13, 15, GRADE, ABL, UB
// TODO: F+S missing
// prettier-ignore
const clerkResponsibilities = Object.freeze({
  schultheissFilter: [
    'F02', 'F06', 'F07', 'F08', 'F09', 'F10',
    'F11', 'F12', 'F14', 'F31', 'F52',
    'F5101', 'F56', 'F30', 'F5107', 'F37',
    'F36', 'F5108', 'F51081', 'F29', 'F33',
    'F35', 'F53',
  ],
  hamburgerFilter: [
    'F01', 'F03', 'F04', 'F05', 'F13',
    'F15', 'F42', 'F38', 'F32',
  ],
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

export function filterForClerkResponsibility(items, filterName) {
  const filterCriteria = clerkResponsibilities[filterName];
  if (!filterCriteria) {
    console.error(`Filter criteria ${filterName} does not exist in clerkResponsibilities.`);
    return items;
  }
  return items.filter((item) =>
    filterCriteria.some((stringStart) =>
      item.eos_number.startsWith(stringStart)
    )
  );
}
