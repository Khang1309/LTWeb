import { useEffect, useState } from "react";
import myLogo from "../assets/Logo.svg";
import {
  SearchIcon,
  ShoppingBasketIcon,
  CircleUserIcon,
  LogOutIcon,
} from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { checkCustomerStatusApi } from "@/apis/authApi";

function Header({ leftTrigger }: { leftTrigger: any }) {
  const navigate = useNavigate();

  const userData = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);

  const [openUserPopup, setOpenUserPopup] = useState(false);

  const handleUserClick = () => {
    if (!userData) {
      navigate("/login");
      return;
    }

    setOpenUserPopup((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setOpenUserPopup(false);
    navigate("/");
  };

  useEffect(() => {
    if (!userData?.user_id) return;

    const checkStatus = async () => {
      try {
        const res = await checkCustomerStatusApi(userData.user_id);

        if (res.success && res.data?.active === false) {
          logout();
          setOpenUserPopup(false);
          alert("Tài khoản của bạn đã bị vô hiệu hóa");
          navigate("/login");
        }
      } catch (err) {
        console.log("Check status error:", err);
      }
    };

    checkStatus();

    const intervalId = setInterval(checkStatus, 30000);

    return () => clearInterval(intervalId);
  }, [userData?.user_id, logout, navigate]);

  return (
    <header className="flex min-h-20 w-full bg-white relative">
      <div className="flex flex-1 justify-start items-center cursor-pointer md:hidden">
        {leftTrigger}
      </div>

      <div className="flex-1 flex justify-center items-center md:items-start h-full overflow-hidden">
        <img
          src={myLogo}
          alt="Logo"
          className="max-h-full w-auto object-contain cursor-pointer py-4"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="hidden md:flex md:flex-3 lg:flex-5 justify-center items-center">
        <InputGroup className="w-full">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex-1 flex text-xs md:text-sm lg:text-base gap-8 justify-end px-4">
        <div className="flex-1 flex justify-center items-center flex-col cursor-pointer">
          <ShoppingBasketIcon />
          <div>Cart</div>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="relative inline-flex flex-col items-center">
            <div
              className="flex justify-center items-center flex-col cursor-pointer"
              onClick={handleUserClick}
            >
              <CircleUserIcon />
              {!userData ? (
                <div>Log in</div>
              ) : (
                <div className="text-center leading-tight">
                  Hello, {userData.full_name}
                </div>
              )}
            </div>

            {userData && openUserPopup && (
              <div className="absolute -right-8 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b">
                  <CircleUserIcon className="w-10 h-10 shrink-0" />

                  <div className="min-w-0">
                    <div className="font-semibold truncate">
                      {userData.full_name}
                    </div>

                    <div className="text-sm text-gray-500 truncate">
                      {userData.email}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setOpenUserPopup(false);
                    navigate("/profile");
                  }}
                  className="w-full justify-start rounded-none h-12 border-b font-normal"
                >
                  Thông tin tài khoản
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start rounded-none h-12 text-red-500 hover:text-red-500 hover:bg-red-50"
                >
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Đăng xuất
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;