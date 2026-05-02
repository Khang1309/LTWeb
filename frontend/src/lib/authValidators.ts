import { isRequired, isSameValue, isValidPassword } from "./validators";

export type ChangePasswordForm = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

export const validateChangePassword = (form: ChangePasswordForm) => {
  if (
    !isRequired(form.old_password) ||
    !isRequired(form.new_password) ||
    !isRequired(form.confirm_password)
  ) {
    return "Vui lòng nhập đầy đủ thông tin đổi mật khẩu.";
  }

  if (!isValidPassword(form.new_password)) {
    return "Mật khẩu mới phải có ít nhất 6 ký tự.";
  }

  if (!isSameValue(form.new_password, form.confirm_password)) {
    return "Xác nhận mật khẩu không khớp.";
  }

  return null;
};