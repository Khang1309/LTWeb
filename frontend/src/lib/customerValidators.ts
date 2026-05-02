import { isRequired, isValidVietnamPhone } from "./validators";

export type CustomerInfoForm = {
  full_name: string;
  phone: string;
  shipping_address: string;
  receiver_phone?: string;
};

export const validateCustomerInfo = (form: CustomerInfoForm) => {
  if (
    !isRequired(form.full_name) ||
    !isRequired(form.phone) ||
    !isRequired(form.shipping_address)
  ) {
    return "Vui lòng nhập họ tên, SĐT tài khoản và địa chỉ.";
  }

  if (!isValidVietnamPhone(form.phone)) {
    return "SĐT tài khoản phải có 10 số và bắt đầu bằng 0.";
  }

  if (
    form.receiver_phone &&
    isRequired(form.receiver_phone) &&
    !isValidVietnamPhone(form.receiver_phone)
  ) {
    return "SĐT người nhận phải có 10 số và bắt đầu bằng 0.";
  }

  return null;
};