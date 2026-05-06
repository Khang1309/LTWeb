export const PASSWORD_MIN_LENGTH = 6;

export const isRequired = (value = "") => {
  return value.trim().length > 0;
};

export const isValidVietnamPhone = (phone = "") => {
  return /^0\d{9}$/.test(phone.trim());
};

export const isValidPassword = (
  password = "",
  minLength = PASSWORD_MIN_LENGTH
) => {
  return password.trim().length >= minLength;
};

export const isSameValue = (a = "", b = "") => {
  return a.trim() === b.trim();
};