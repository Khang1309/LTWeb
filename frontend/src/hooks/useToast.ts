import { useState } from "react";

export type ToastType = "success" | "error";

export const useToast = () => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as ToastType,
  });

  const showToast = (
    message: string,
    type: ToastType = "success"
  ) => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2500);
  };

  return {
    toast,
    showToast,
  };
};