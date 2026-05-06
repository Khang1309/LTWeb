import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { customerLoginApi } from "@/apis/authApi";
import { useUserStore } from "@/store/userStore";
import { useToast } from "@/hooks/useToast";
import {
  isRequired,
  isValidPassword,
  PASSWORD_MIN_LENGTH,
} from "@/lib/validators";

function Login() {
  const navigate = useNavigate();
  const login = useUserStore((s) => s.login);

  const { toast, showToast } = useToast();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginValue = identifier.trim();
    const passValue = password.trim();

    if (!isRequired(loginValue) || !isRequired(passValue)) {
      showToast("Vui lòng nhập đầy đủ thông tin.", "error");
      return;
    }

    if (!isValidPassword(passValue)) {
      showToast(
        `Mật khẩu phải có ít nhất ${PASSWORD_MIN_LENGTH} ký tự.`,
        "error"
      );
      return;
    }

    try {
      const data = await customerLoginApi({
        identifier: loginValue,
        password: passValue,
      });

      if (!data.success) {
        showToast(data.message || "Đăng nhập thất bại.", "error");
        return;
      }

      login(data.data);
      showToast("Đăng nhập thành công.", "success");

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Không kết nối được server.",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Đăng nhập</h1>

        <input
          className="w-full border rounded-lg px-4 py-2 mb-4"
          type="text"
          placeholder="Email hoặc số điện thoại"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          className="w-full border rounded-lg px-4 py-2 mb-4"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-slate-900 text-white rounded-lg py-2"
        >
          Đăng nhập
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          className="w-full mt-4 text-blue-600 text-sm"
        >
          Chưa có tài khoản? Đăng ký
        </button>
      </form>

      {toast.show && (
        <div className={`toast ${toast.type} show`}>{toast.message}</div>
      )}
    </div>
  );
}

export default Login;