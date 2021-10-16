const refTokenKey = 'ref';

type TokenListenerType = (token?: string) => any;
const listeners: TokenListenerType[] = [];

const store = (token: string) => {
  localStorage.setItem(refTokenKey, token);
  listeners.forEach((cb) => cb(token));
};

const remove = () => {
  localStorage.removeItem(refTokenKey);
};

const get = () => {
  return localStorage.getItem(refTokenKey);
};

const addListener = (cb: TokenListenerType) => {
  listeners.push(cb);
  return () => listeners.filter((x) => x !== cb);
};

export default {
  store,
  remove,
  get,
  addListener,
};
