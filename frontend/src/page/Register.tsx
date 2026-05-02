import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { customerRegisterApi } from "@/apis/authApi";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    shipping_address: "",
    receiver_name: "",
    receiver_phone: "",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2500);
  };

  const isValidVietnamPhone = (phone: string) => /^0[0-9]{9}$/.test(phone);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password.trim(),
      shipping_address: form.shipping_address.trim(),
      receiver_name: form.receiver_name.trim(),
      receiver_phone: form.receiver_phone.trim(),
    };

    if (
      !payload.full_name ||
      !payload.email ||
      !payload.phone ||
      !payload.password ||
      !payload.shipping_address
    ) {
      showToast("Vui lòng nhập đầy đủ thông tin bắt buộc.", "error");
      return;
    }

    if (!isValidVietnamPhone(payload.phone)) {
      showToast("SĐT tài khoản phải có 10 số và bắt đầu bằng 0.", "error");
      return;
    }

    if (payload.receiver_phone && !isValidVietnamPhone(payload.receiver_phone)) {
      showToast("SĐT người nhận phải có 10 số và bắt đầu bằng 0.", "error");
      return;
    }

    if (payload.password.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự.", "error");
      return;
    }

    try {
    const data = await customerRegisterApi({
        full_name: payload.full_name,
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
        shipping_address: payload.shipping_address,
        receiver_name: payload.receiver_name || payload.full_name,
        receiver_phone: payload.receiver_phone || payload.phone,
    });

    console.log("register response:", data);

    if (data?.success === false) {
        showToast(data.message || "Đăng ký thất bại.", "error");
        return;
    }

    showToast("Đăng ký thành công. Vui lòng đăng nhập.", "success");

    setTimeout(() => {
        navigate("/login");
    }, 800);
    } catch (err: any) {
    console.log("register error:", err);

    showToast(
        err.response?.data?.message ||
        err.message ||
        "Không kết nối được server.",
        "error"
    );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Đăng ký</h1>

        <input
          name="full_name"
          className="w-full border rounded-lg px-4 py-2 mb-3"
          type="text"
          placeholder="Họ tên"
          value={form.full_name}
          onChange={handleChange}
        />

        <input
          name="email"
          className="w-full border rounded-lg px-4 py-2 mb-3"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="phone"
          className="w-full border rounded-lg px-4 py-2 mb-3"
          type="text"
          placeholder="Số điện thoại tài khoản"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          name="password"
          className="w-full border rounded-lg px-4 py-2 mb-3"
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
        />

        <input
          name="shipping_address"
          className="w-full border rounded-lg px-4 py-2 mb-3"
          type="text"
          placeholder="Địa chỉ giao hàng"
          value={form.shipping_address}
          onChange={handleChange}
        />

        <input
          name="receiver_name"
          className="w-full border rounded-lg px-4 py-2 mb-3"
          type="text"
          placeholder="Tên người nhận (không bắt buộc)"
          value={form.receiver_name}
          onChange={handleChange}
        />

        <input
          name="receiver_phone"
          className="w-full border rounded-lg px-4 py-2 mb-4"
          type="text"
          placeholder="SĐT người nhận (không bắt buộc)"
          value={form.receiver_phone}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-slate-900 text-white rounded-lg py-2"
        >
          Đăng ký
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-blue-600 text-sm"
        >
          Đã có tài khoản? Đăng nhập
        </button>
      </form>

      {toast.show && (
        <div className={`toast ${toast.type} show`}>{toast.message}</div>
      )}
    </div>
  );
}

export default Register;