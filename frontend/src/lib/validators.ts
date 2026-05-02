export const isRequired = (value: string) => {
  return value.trim().length > 0;
};

export const isValidVietnamPhone = (phone: string) => {
  return /^0[0-9]{9}$/.test(phone.trim());
};

export const isValidPassword = (password: string, minLength = 6) => {
  return password.trim().length >= minLength;
};

export const isSameValue = (a: string, b: string) => {
  return a.trim() === b.trim();
};