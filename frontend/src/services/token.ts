export const refTokenKey = 'ref';

type TokenListenerType = (token?: string) => any;
const listeners: TokenListenerType[] = [];

export const storeRefTokenKey = (token: string) => {
  localStorage.setItem(refTokenKey, token);
  listeners.forEach((cb) => cb(token));
};

export const removeRefTokenKey = () => {
  localStorage.removeItem(refTokenKey);
};

export const getRefTokenKey = () => {
  return localStorage.getItem(refTokenKey);
};

export const addRefTokenListener = (cb: TokenListenerType) => {
  listeners.push(cb);
};
