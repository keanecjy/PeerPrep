export const refTokenKey = 'ref';

export const storeRefTokenKey = (token: string) => {
  localStorage.setItem(refTokenKey, token);
};

export const removeRefTokenKey = () => {
  localStorage.removeItem(refTokenKey);
};

export const getRefTokenKey = () => {
  return localStorage.getItem(refTokenKey);
};
