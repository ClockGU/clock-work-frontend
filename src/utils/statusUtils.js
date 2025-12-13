import i18n from '@/plugins/i18n';

const STATUS_I18N_PATH = 'petition.statusOption';
// enums for petition status
export const PETITION_STATUS = Object.freeze({
  STUDENT_ACTION: 'student_action',
  PETITIONEER_ACTION: 'petitioneer_action',
  APPROVER_ACTION: 'approver_action',
  CLERK_ACTION: 'clerk_action',
  APPROVER_REVISION: 'approver_revision',
  CLERK_REVISION: 'clerk_revision',
  STUDENT_REVISION: 'student revision',
  AWAITING_SIGNATURE: 'awaiting_signiture',
  APPROVED: 'approved',
  REJECTED: 'rejected',
});

export function getStatusDisplay(statusKey) {
  if (!statusKey) return '-';
  const t = i18n.global.t;
  return t(`${STATUS_I18N_PATH}.${statusKey}`) || statusKey;
}
