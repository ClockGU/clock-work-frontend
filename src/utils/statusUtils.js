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

export const PETITION_STATUS = Object.freeze({
  STUDENT_ACTION: 'student_action',
  PETITIONEER_ACTION: 'petitioneer_action',
  APPROVER_ACTION: 'approver_action',
  CLERK_ACTION: 'clerk_action',
  APPROVER_REVISION: 'approver_revision',
  CLERK_REVISION: 'clerk_revision',
  STUDENT_REVISION: 'student_revision',
  AWAITING_SIGNATURE: 'awaiting_signature',
  APPROVED: 'approved',
  REJECTED: 'rejected',
});

// Precomputed set for fast membership checks
const PETITION_STATUS_SET = new Set(Object.values(PETITION_STATUS));

// checks if a status key is valid petition status
export function isPetitionStatusKey(statusKey) {
  if (!statusKey) return false;
  return PETITION_STATUS_SET.has(String(statusKey).trim());
}

// returns sanitized petition status key or '-' if invalid
export function sanitizePetitionStatusKey(statusKey) {
  const key = String(statusKey ?? '').trim();
  return PETITION_STATUS_SET.has(key) ? key : '-';
}

// Display text for a petition status.
export function getStatusDisplayText(statusKey) {
  const key = sanitizePetitionStatusKey(statusKey);
  if (key === '-') return '-';

  const t = i18n.global.t;
  const translated = t(`${STATUS_I18N_PATH}.${key}`);
  return translated && translated !== `${STATUS_I18N_PATH}.${key}` ? translated : key;
}

// display icon for a petition status.
export function getStatusDisplayIcon(statusKey) {
  const key = sanitizePetitionStatusKey(statusKey);

  const map = {
    [PETITION_STATUS.STUDENT_ACTION]: mdiAccount,
    [PETITION_STATUS.PETITIONEER_ACTION]: mdiAccountEditOutline,
    [PETITION_STATUS.APPROVER_ACTION]: mdiAccountCheckOutline,
    [PETITION_STATUS.CLERK_ACTION]: mdiAccountCog,
    [PETITION_STATUS.APPROVER_REVISION]: mdiFileDocumentEditOutline,
    [PETITION_STATUS.CLERK_REVISION]: mdiFileDocumentEditOutline,
    [PETITION_STATUS.STUDENT_REVISION]: mdiFileDocumentEditOutline,
    [PETITION_STATUS.AWAITING_SIGNATURE]: mdiSignatureFreehand,
    [PETITION_STATUS.APPROVED]: mdiCheckCircleOutline,
    [PETITION_STATUS.REJECTED]: mdiCloseCircleOutline,
  };

  return map[key] || mdiHelpCircleOutline;
}
