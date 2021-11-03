export const apiKeys = {
  serverCheck: {
    account: '/',
    match: '/match/',
    interview: '/interview/',
    chat: '/chat/',
  },
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    confirm: '/auth/confirm',
    resendConfirm: '/auth/resend-confirm',
    forgetPassword: '/auth/forget-password',
    passwordReset: '/auth/password-reset',
    changePassword: '/auth/change-password',
  },
  profile: {
    me: '/profile/me',
    key: '/profile',
    user_records: '/profile/records',
    records: '/records',
  },
  match: {
    find: '/match/find',
    delete: '/match/delete',
  },
  chat: {
    socket: '/chat/socket',
  },
  interview: {
    socket: '/interview/socket',
    leetcode: {
      random: '/interview/leetcode/random',
      find: '/interview/leetcode',
    },
  },
};
