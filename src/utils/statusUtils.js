import i18n from '@/plugins/i18n';
import {
  mdiAccount,
  mdiAccountCog,
  mdiFileDocumentEditOutline,
  mdiSignatureFreehand,
  mdiCheckCircleOutline,
  mdiCloseCircleOutline,
  mdiHelpCircleOutline,
  mdiAccountEditOutline,
  mdiAccountCheckOutline,
} from '@mdi/js';

const STATUS_I18N_PATH = 'petition.statusDisplay';

// Petition Status Constants in correct order
export const PETITION_STATUS = Object.freeze({
  PETITIONEER_ACTION: 'petitioneer_action',
  APPROVER_ACTION: 'approver_action',
  APPROVER_REVISION: 'approver_revision',
  STUDENT_ACTION: 'student_action',
  STUDENT_REVISION: 'student_revision',
  CLERK_ACTION: 'clerk_action',
  CLERK_REVISION: 'clerk_revision',
  AWAITING_SIGNATURE: 'awaiting_signature',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
});

export const PETITION_STATUS_UI = Object.freeze({
  [PETITION_STATUS.PETITIONEER_ACTION]: {
    icon: mdiAccountEditOutline,
    color: 'supervisor',
  },
  [PETITION_STATUS.APPROVER_ACTION]: {
    icon: mdiAccountCheckOutline,
    color: 'approver',
  },
  [PETITION_STATUS.APPROVER_REVISION]: {
    icon: mdiFileDocumentEditOutline,
    color: 'approver',
  },
  [PETITION_STATUS.STUDENT_ACTION]: {
    icon: mdiAccount,
    color: 'student',
  },
  [PETITION_STATUS.STUDENT_REVISION]: {
    icon: mdiFileDocumentEditOutline,
    color: 'student',
  },
  [PETITION_STATUS.CLERK_ACTION]: {
    icon: mdiAccountCog,
    color: 'clerk',
  },
  [PETITION_STATUS.CLERK_REVISION]: {
    icon: mdiFileDocumentEditOutline,
    color: 'clerk',
  },
  [PETITION_STATUS.AWAITING_SIGNATURE]: {
    icon: mdiSignatureFreehand,
    color: 'warning',
  },
  [PETITION_STATUS.COMPLETED]: {
    icon: mdiCheckCircleOutline,
    color: 'success',
  },
  [PETITION_STATUS.REJECTED]: {
    icon: mdiCloseCircleOutline,
    color: 'error',
  },
});

const FALLBACK = Object.freeze({ icon: mdiHelpCircleOutline, color: 'grey' });

// Precomputed set for fast membership checks
const PETITION_STATUS_SET = new Set(Object.values(PETITION_STATUS));

function sanitizePetitionStatusKey(statusKey) {
  const key = String(statusKey ?? '').trim();
  return PETITION_STATUS_SET.has(key) ? key : '-';
}

export function getStatusDisplayText(statusKey, t = i18n.global.t) {
  const key = sanitizePetitionStatusKey(statusKey);
  if (key === '-') return '-';
  const translated = t(`${STATUS_I18N_PATH}.${key}`);
  return translated && translated !== `${STATUS_I18N_PATH}.${key}`
    ? translated
    : key;
}

export function getStatusDisplayIcon(statusKey) {
  const key = sanitizePetitionStatusKey(statusKey);
  return (PETITION_STATUS_UI[key] ?? FALLBACK).icon;
}

export function getStatusDisplayColor(statusKey) {
  const key = sanitizePetitionStatusKey(statusKey);
  return (PETITION_STATUS_UI[key] ?? FALLBACK).color;
}
