export type ToastType = "success" | "error";

export type ToastState = {
  show: boolean;
  message: string;
  type: ToastType;
};

export const initialToast: ToastState = {
  show: false,
  message: "",
  type: "success",
};