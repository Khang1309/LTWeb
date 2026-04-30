import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    shipping_address: "",
    receiver_name: "",
    receiver_phone: "",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2500);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const full_name = form.full_name.trim();
    const email = form.email.trim();
    const password = form.password.trim();
    const phone = form.phone.trim();
    const shipping_address = form.shipping_address.trim();
    const receiver_name = form.receiver_name.trim();
    const receiver_phone = form.receiver_phone.trim();

    if (!full_name || !email || !password || !phone || !shipping_address) {
      showToast("Vui lòng nhập đầy đủ thông tin bắt buộc.", "error");
      return;
    }

    if (full_name.length < 2 || full_name.length > 100) {
      showToast("Họ tên phải từ 2 đến 100 ký tự.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Email không hợp lệ.", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự.", "error");
      return;
    }

    if (!/^0[0-9]{9}$/.test(phone)) {
      showToast("Số điện thoại phải có 10 số và bắt đầu bằng 0.", "error");
      return;
    }

    if (receiver_phone && !/^0[0-9]{9}$/.test(receiver_phone)) {
      showToast("SĐT người nhận phải có 10 số và bắt đầu bằng 0.", "error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/register", {
        full_name,
        email,
        password,
        phone,
        shipping_address,
        receiver_name,
        receiver_phone,
      });

      if (res.data.success) {
        showToast("Đăng ký thành công.", "success");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        showToast(res.data.message || "Đăng ký thất bại.", "error");
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "Không kết nối được server.",
        "error"
      );
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-slate-100">
      <Paper elevation={4} className="w-full max-w-lg p-8">
        <Typography variant="h4" className="text-center font-bold mb-6">
          Đăng ký
        </Typography>

        <Box component="form" onSubmit={handleRegister} className="flex flex-col gap-4">
          <TextField label="Họ tên" name="full_name" value={form.full_name} onChange={handleChange} required />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} required />
          <TextField label="Mật khẩu" name="password" type="password" value={form.password} onChange={handleChange} required />
          <TextField label="Số điện thoại" name="phone" value={form.phone} onChange={handleChange} required />
          <TextField label="Địa chỉ giao hàng" name="shipping_address" value={form.shipping_address} onChange={handleChange} required />
          <TextField label="Tên người nhận" name="receiver_name" value={form.receiver_name} onChange={handleChange} />
          <TextField label="SĐT người nhận" name="receiver_phone" value={form.receiver_phone} onChange={handleChange} />

          <Button type="submit" variant="contained" size="large">
            Đăng ký
          </Button>

          <Button onClick={() => navigate("/login")}>
            Đã có tài khoản? Đăng nhập
          </Button>
        </Box>
      </Paper>

      {toast.show && (
        <div className={`toast ${toast.type} show`}>
          {toast.message}
        </div>
      )}
    </Box>
  );
}

export default RegisterPage;