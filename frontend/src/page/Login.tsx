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
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavMenuLink from "@/components/other/navMenuLink";
import Register from "./Register";
import { Eye, EyeOff } from "lucide-react";
function Login() {
  const navigate = useNavigate();
  const login = useUserStore((s) => s.login);

  const { toast, showToast } = useToast();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [openLogin, setOpenLogin] = useState(true);

  const handleOpenLogin = (e: any) => {
    e.preventDefault();
    setOpenLogin(true);
  }

  const handleOpenRegister = (e: any) => {
    e.preventDefault();
    setOpenLogin(false);
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpenLogin(true);
    const loginValue = identifier.trim();
    const passValue = password.trim();

    if (!isRequired(loginValue) || !isRequired(passValue)) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    if (!isValidPassword(passValue)) {
      showToast(
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
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
        showToast(data.message || "Login failed.", "error");
        return;
      }

      login(data.data);
      showToast("Login successful.", "success");

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Could not connect to the server.",
        "error"
      );
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center  bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl mt-8 shadow">
        <div className="flex justify-center items-center">
          <NavigationMenu className="w-full flex h-10">
            <NavigationMenuList>
              <NavigationMenuItem className="flex-1 ">
                <NavigationMenuLink asChild>
                  <NavMenuLink name="Login" onClick={handleOpenLogin} active={openLogin} />
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex-1 ">
                <NavigationMenuLink asChild>
                  <NavMenuLink name="Register" onClick={handleOpenRegister} active={!openLogin} />
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {openLogin ?
          <div>

            <form
              onSubmit={handleLogin}
              className="w-full max-w-md bg-white p-8 rounded-xl"
            >

              <input
                className="w-full border rounded-lg px-4 py-2 mb-4"
                type="text"
                placeholder="Email or phone number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />

              <div className="relative mb-4">
                <input
                  className="w-full border rounded-lg px-4 py-2 pr-16"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full  text-white bg-(--color-brand) rounded-lg py-2"
              >
                Login
              </button>

            </form>

          </div>
          :
          <div>
            <Register onDone={() => setOpenLogin(true)} />
          </div>

        }
        {toast.show && (
          <div className={`toast ${toast.type} show`}>{toast.message}</div>
        )}
      </div>
    </div>
  );
}

export default Login;
