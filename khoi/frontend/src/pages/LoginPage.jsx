import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography , IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 2500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginValue = identifier.trim();
    const passValue = password.trim();

    // FE validate
    if (!loginValue || !passValue) {
      showToast("Vui lòng nhập đầy đủ thông tin.", "error");
      return;
    }

    if (passValue.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự.", "error");
      return;
    }

    try {
        const res = await axios.post("http://localhost:8000/api/login", {
          identifier: loginValue,
          password: passValue,
        });

        console.log("LOGIN RESPONSE:", res.data);

        if (res.data.success) {
          const user = res.data.data;

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("isLoggedIn", "true");

          showToast("Đăng nhập thành công.", "success");

          setTimeout(() => navigate("/homepage"), 1000);
        } else {
          showToast(res.data.message || "Đăng nhập thất bại.", "error");
        }
    } catch (err) {
      console.log(err.response?.data);

      showToast(
        err.response?.data?.message || "Không kết nối được server.",
        "error"
      );
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-slate-100">
      <Paper elevation={4} className="w-full max-w-md p-8">
        <Typography variant="h4" className="text-center font-bold mb-6">
          Đăng nhập
        </Typography>

        <Box
          component="form"
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >
          <TextField
            label="Email hoặc số điện thoại"
            fullWidth
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <TextField
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      edge="end"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button type="submit" variant="contained" size="large">
            Đăng nhập
          </Button>

          <Button onClick={() => navigate("/register")}>
            Chưa có tài khoản? Đăng ký
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

export default LoginPage;