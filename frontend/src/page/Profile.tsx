import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  getCustomerInfoApi,
  updateCustomerApi,
  changeCustomerPasswordApi,
} from "@/apis/customerApi";

import { validateCustomerInfo } from "@/lib/customerValidators";
import { validateChangePassword } from "@/lib/authValidators";
import { initialToast, type ToastType } from "@/lib/toast";

type CustomerForm = {
  full_name: string;
  email: string;
  phone: string;
  shipping_address: string;
  receiver_name: string;
  receiver_phone: string;
};

type PasswordForm = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

type ShowPass = {
  old: boolean;
  new: boolean;
  confirm: boolean;
};

function Profile() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const login = useUserStore((s) => s.login);

  const [showChangePassword, setShowChangePassword] = useState(false);

  const [form, setForm] = useState<CustomerForm>({
    full_name: "",
    email: "",
    phone: "",
    shipping_address: "",
    receiver_name: "",
    receiver_phone: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPass, setShowPass] = useState<ShowPass>({
    old: false,
    new: false,
    confirm: false,
  });

  const [toast, setToast] = useState(initialToast);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2500);
  };

  useEffect(() => {
    if (!user?.user_id) {
      navigate("/login");
      return;
    }

    const fetchInfo = async () => {
      try {
        const res = await getCustomerInfoApi(user.user_id);
        const customer = res.data || res.user;

        if (res.success && customer) {
          setForm({
            full_name: customer.full_name || "",
            email: customer.email || "",
            phone: customer.phone || "",
            shipping_address: customer.shipping_address || "",
            receiver_name: customer.receiver_name || "",
            receiver_phone: customer.receiver_phone || "",
          });
        } else {
          showToast(res.message || "Không thể tải thông tin.", "error");
        }
      } catch (err: any) {
        showToast(
          err.response?.data?.message || "Không thể tải thông tin khách hàng.",
          "error"
        );
      }
    };

    fetchInfo();
  }, [user?.user_id, navigate]);

  const handleChangeInfo = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitInfo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.user_id) {
      navigate("/login");
      return;
    }

    const errorMessage = validateCustomerInfo(form);

    if (errorMessage) {
      showToast(errorMessage, "error");
      return;
    }

    try {
      const res = await updateCustomerApi({
        user_id: user.user_id,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        shipping_address: form.shipping_address.trim(),
        receiver_name: form.receiver_name.trim(),
        receiver_phone: form.receiver_phone.trim(),
      });

      if (res.success) {
        login({
          ...user,
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
        });

        showToast("Cập nhật thông tin thành công.", "success");
      } else {
        showToast(res.message || "Cập nhật thất bại.", "error");
      }
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Không kết nối được server.",
        "error"
      );
    }
  };

  const handleSubmitPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.user_id) {
      navigate("/login");
      return;
    }

    const old_password = passwordForm.old_password.trim();
    const new_password = passwordForm.new_password.trim();
    const confirm_password = passwordForm.confirm_password.trim();

    const passwordError = validateChangePassword({
      old_password,
      new_password,
      confirm_password,
    });

    if (passwordError) {
      showToast(passwordError, "error");
      return;
    }

    try {
      const res = await changeCustomerPasswordApi({
        user_id: user.user_id,
        old_password,
        new_password,
        confirm_password,
      });

      if (res.success) {
        showToast("Đổi mật khẩu thành công.", "success");

        setPasswordForm({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });

        setShowPass({
          old: false,
          new: false,
          confirm: false,
        });

        setShowChangePassword(false);
      } else {
        showToast(res.message || "Đổi mật khẩu thất bại.", "error");
      }
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Không kết nối được server.",
        "error"
      );
    }
  };

  const renderPasswordInput = (
    label: string,
    name: keyof PasswordForm,
    showKey: keyof ShowPass
  ) => (
    <div>
      <label className="text-sm font-semibold">{label}</label>

      <div className="relative mt-2">
        <input
          type={showPass[showKey] ? "text" : "password"}
          name={name}
          value={passwordForm[name]}
          onChange={handleChangePassword}
          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 pr-12 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            setShowPass((prev) => ({
              ...prev,
              [showKey]: !prev[showKey],
            }))
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
        >
          {showPass[showKey] ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Card className="rounded-2xl shadow-md">
          <CardHeader className="border-b">
            <CardTitle className="text-center text-3xl font-bold">
              Thông tin khách hàng
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmitInfo} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold">
                    Họ tên tài khoản
                  </label>
                  <Input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChangeInfo}
                    className="mt-2 h-11"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Email</label>
                  <Input
                    name="email"
                    value={form.email}
                    disabled
                    className="mt-2 h-11 bg-slate-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    SĐT tài khoản
                  </label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChangeInfo}
                    className="mt-2 h-11"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Tên người nhận
                  </label>
                  <Input
                    name="receiver_name"
                    value={form.receiver_name}
                    onChange={handleChangeInfo}
                    className="mt-2 h-11"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    SĐT người nhận
                  </label>
                  <Input
                    name="receiver_phone"
                    value={form.receiver_phone}
                    onChange={handleChangeInfo}
                    className="mt-2 h-11"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Địa chỉ giao hàng
                  </label>
                  <textarea
                    name="shipping_address"
                    value={form.shipping_address}
                    onChange={handleChangeInfo}
                    className="mt-2 min-h-[120px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-end gap-3 border-t pt-6 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowChangePassword((prev) => !prev)}
                >
                  {showChangePassword ? "Tắt đổi mật khẩu" : "Đổi mật khẩu"}
                </Button>

                <Button type="submit">Lưu thay đổi</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {showChangePassword && (
          <Card className="mt-6 rounded-2xl shadow-md">
            <CardHeader className="border-b">
              <CardTitle className="text-center text-2xl font-bold">
                Đổi mật khẩu
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <form
                onSubmit={handleSubmitPassword}
                className="grid grid-cols-1 gap-6 md:grid-cols-3"
              >
                {renderPasswordInput("Mật khẩu hiện tại", "old_password", "old")}
                {renderPasswordInput("Mật khẩu mới", "new_password", "new")}
                {renderPasswordInput(
                  "Xác nhận mật khẩu mới",
                  "confirm_password",
                  "confirm"
                )}

                <div className="flex justify-end md:col-span-3">
                  <Button type="submit">Cập nhật mật khẩu</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {toast.show && (
          <div className={`toast ${toast.type} show`}>{toast.message}</div>
        )}
      </div>
    </div>
  );
}

export default Profile;