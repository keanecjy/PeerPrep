export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export const CARDS = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGET_PASSWORD: 'forget',
  RESEND_CONFIRMATION: 'resend',
  CHECK_CONFIRMATION: 'check',
  RESET_PASSWORD: 'reset',
};

export const SUBMISSION_STATUS = {
  Requesting: 'REQUESTING',
  Rejected: 'REJECTED',
  Accepted: 'ACCEPTED',
  Prompted: 'PROMPTED',
  Summary: 'SUMMARY',
  None: null,
};
