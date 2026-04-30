import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function InformationPage() {
  const navigate = useNavigate();

  const [localUser, setLocalUser] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    shipping_address: "",
    receiver_name: "",
    receiver_phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false,
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

  useEffect(() => {
    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      user = null;
    }

    if (!user?.user_id) {
      navigate("/login");
      return;
    }

    setLocalUser(user);

    const fetchInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/customer/info?user_id=${user.user_id}`
        );

        console.log("CUSTOMER INFO:", res.data);

        if (res.data.success) {
          setForm({
            full_name: res.data.user.full_name || "",
            email: res.data.user.email || "",
            phone: res.data.user.phone || "",
            shipping_address: res.data.user.shipping_address || "",
            receiver_name: res.data.user.receiver_name || "",
            receiver_phone: res.data.user.receiver_phone || "",
          });
        } else {
          showToast(res.data.message || "Không thể tải thông tin.", "error");
        }
      } catch (err) {
        console.log(err.response?.data || err);
        showToast("Không thể tải thông tin khách hàng.", "error");
      }
    };

    fetchInfo();
  }, [navigate]);

  const handleChangeInfo = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const validateInfo = () => {
    const full_name = form.full_name.trim();
    const phone = form.phone.trim();
    const shipping_address = form.shipping_address.trim();
    const receiver_name = form.receiver_name.trim();
    const receiver_phone = form.receiver_phone.trim();

    if (!full_name || !phone || !shipping_address) {
      showToast("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ.", "error");
      return false;
    }

    if (full_name.length < 2 || full_name.length > 100) {
      showToast("Họ tên phải từ 2 đến 100 ký tự.", "error");
      return false;
    }

    if (!/^0[0-9]{9}$/.test(phone)) {
      showToast("Số điện thoại phải có 10 số và bắt đầu bằng 0.", "error");
      return false;
    }

    if (shipping_address.length < 5 || shipping_address.length > 255) {
      showToast("Địa chỉ giao hàng phải từ 5 đến 255 ký tự.", "error");
      return false;
    }

    if (receiver_name && receiver_name.length > 100) {
      showToast("Tên người nhận không được vượt quá 100 ký tự.", "error");
      return false;
    }

    if (receiver_phone && !/^0[0-9]{9}$/.test(receiver_phone)) {
      showToast("SĐT người nhận phải có 10 số và bắt đầu bằng 0.", "error");
      return false;
    }

    return true;
  };

  const handleSubmitInfo = async (e) => {
    e.preventDefault();

    if (!localUser?.user_id) {
      navigate("/login");
      return;
    }

    if (!validateInfo()) return;

    try {
      const res = await axios.put("http://localhost:8000/api/customer/update", {
        user_id: localUser.user_id,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        shipping_address: form.shipping_address.trim(),
        receiver_name: form.receiver_name.trim(),
        receiver_phone: form.receiver_phone.trim(),
      });

      if (res.data.success) {
        const updatedLocalUser = {
          ...localUser,
          ...res.data.user,
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
        };

        localStorage.setItem("user", JSON.stringify(updatedLocalUser));
        setLocalUser(updatedLocalUser);

        showToast("Cập nhật thông tin thành công.", "success");
      } else {
        showToast(res.data.message || "Cập nhật thất bại.", "error");
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "Không kết nối được server.",
        "error"
      );
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (!localUser?.user_id) {
      navigate("/login");
      return;
    }

    const old_password = passwordForm.old_password.trim();
    const new_password = passwordForm.new_password.trim();
    const confirm_password = passwordForm.confirm_password.trim();

    if (!old_password || !new_password || !confirm_password) {
      showToast("Vui lòng nhập đầy đủ thông tin đổi mật khẩu.", "error");
      return;
    }

    if (new_password.length < 6) {
      showToast("Mật khẩu mới phải có ít nhất 6 ký tự.", "error");
      return;
    }

    if (new_password !== confirm_password) {
      showToast("Xác nhận mật khẩu không khớp.", "error");
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:8000/api/customer/change-password",
        {
          user_id: localUser.user_id,
          old_password,
          new_password,
          confirm_password,
        }
      );

      if (res.data.success) {
        showToast("Đổi mật khẩu thành công.", "success");

        setPasswordForm({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });

        setShowChangePassword(false);
      } else {
        showToast(res.data.message || "Đổi mật khẩu thất bại.", "error");
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "Không kết nối được server.",
        "error"
      );
    }
  };

  const passwordAdornment = (key) => (
    <InputAdornment position="end">
      <IconButton
        type="button"
        edge="end"
        onClick={() =>
          setShowPass((prev) => ({
            ...prev,
            [key]: !prev[key],
          }))
        }
      >
        {showPass[key] ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Box className="max-w-3xl mx-auto px-6 py-10">
      <Paper elevation={4} className="rounded-2xl p-8">
        <Typography variant="h4" className="font-bold mb-6 text-center">
          Thông tin cá nhân
        </Typography>

        <Box component="form" onSubmit={handleSubmitInfo} className="flex flex-col gap-4">
          <TextField
            label="Họ tên"
            name="full_name"
            value={form.full_name}
            onChange={handleChangeInfo}
            required
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={form.email}
            disabled
            fullWidth
          />

          <TextField
            label="Số điện thoại"
            name="phone"
            value={form.phone}
            onChange={handleChangeInfo}
            required
            fullWidth
          />

          <TextField
            label="Địa chỉ giao hàng"
            name="shipping_address"
            value={form.shipping_address}
            onChange={handleChangeInfo}
            required
            fullWidth
            multiline
            minRows={2}
          />

          <TextField
            label="Tên người nhận"
            name="receiver_name"
            value={form.receiver_name}
            onChange={handleChangeInfo}
            fullWidth
          />

          <TextField
            label="SĐT người nhận"
            name="receiver_phone"
            value={form.receiver_phone}
            onChange={handleChangeInfo}
            fullWidth
          />

          <Button type="submit" variant="contained" size="large">
            Lưu thay đổi
          </Button>
        </Box>
      </Paper>

      <div className="mt-6 text-center">
        <Button
          variant="outlined"
          color="warning"
          onClick={() => setShowChangePassword((prev) => !prev)}
        >
          {showChangePassword ? "Tắt đổi mật khẩu" : "Thay đổi mật khẩu"}
        </Button>
      </div>

      {showChangePassword && (
        <Paper elevation={4} className="rounded-2xl p-8 mt-6">
          <Typography variant="h4" className="font-bold mb-6 text-center">
            Đổi mật khẩu
          </Typography>

          <Box component="form" onSubmit={handleSubmitPassword} className="flex flex-col gap-4">
            <TextField
              label="Mật khẩu hiện tại"
              name="old_password"
              type={showPass.old ? "text" : "password"}
              value={passwordForm.old_password}
              onChange={handleChangePassword}
              required
              fullWidth
              slotProps={{
                input: {
                  endAdornment: passwordAdornment("old"),
                },
              }}
            />

            <TextField
              label="Mật khẩu mới"
              name="new_password"
              type={showPass.new ? "text" : "password"}
              value={passwordForm.new_password}
              onChange={handleChangePassword}
              required
              fullWidth
              slotProps={{
                input: {
                  endAdornment: passwordAdornment("new"),
                },
              }}
            />

            <TextField
              label="Xác nhận mật khẩu mới"
              name="confirm_password"
              type={showPass.confirm ? "text" : "password"}
              value={passwordForm.confirm_password}
              onChange={handleChangePassword}
              required
              fullWidth
              slotProps={{
                input: {
                  endAdornment: passwordAdornment("confirm"),
                },
              }}
            />

            <Divider className="my-2" />

            <Button type="submit" variant="contained" color="warning" size="large">
              Cập nhật mật khẩu
            </Button>
          </Box>
        </Paper>
      )}

      {toast.show && (
        <div className={`toast ${toast.type} show`}>
          {toast.message}
        </div>
      )}
    </Box>
  );
}