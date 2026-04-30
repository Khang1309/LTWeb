import { useState } from "react";
import { Menu, User, X } from "lucide-react";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import InformationPage from "./InformationPage";
import { useEffect } from "react";
import axios from "axios";

function HtmlPage({ src }) {
  return (
    <iframe
      src={src}
      title={src}
      className="w-full min-h-[750px] border-0"
    />
  );
}

function About() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold mb-4">Về chúng tôi</h1>
        <p>Nội dung giới thiệu công ty...</p>
      </div>
    </div>
  );
}

function Product() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold mb-4">Sản phẩm</h1>
        <p>Danh sách sản phẩm...</p>
      </div>
    </div>
  );
}


export default function HomePage() {
  const [openMainMenu, setOpenMainMenu] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  // sau này lấy từ auth
//   const isLoggedIn = false;
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const navigate = useNavigate();

  const menus = [
    { path: "/homepage", label: "Trang chủ" },
    { path: "/homepage/about", label: "Về chúng tôi" },
    { path: "/homepage/product", label: "Sản phẩm" },
    { path: "/homepage/contact", label: "Liên hệ" },
  ];


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



  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user?.user_id) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/auth/check-status?user_id=${user.user_id}`
        );

        if (!res.data.data.active) {
          showToast("Tài khoản của bạn đã bị vô hiệu hóa", "error");

          setTimeout(() => {
            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");
            navigate("/login");
          }, 2000);
        }
      } catch (err) {
        console.log(err);
      }
    }, 30000); // 30s check 1 lần

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between">
          <span>Hotline: 1900 1234</span>
          <span>Email: support@myshop.com</span>
        </div>
      </header>

      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="w-full px-16 h-16 grid grid-cols-[1fr_auto_1fr] items-center">
          {/* left */}
          <Link
            to="/homepage"
            className="text-2xl font-bold text-blue-600 justify-self-start"
          >
            MyShop
          </Link>

          {/* center */}
          <div className="hidden md:flex gap-10 font-medium justify-self-center">
            {menus.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* right */}
          <div className="flex items-center gap-3 justify-self-end">
            {/* mobile menu */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={() => setOpenMainMenu(!openMainMenu)}
            >
              {openMainMenu ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* user */}
            <div className="relative">
              <button
                onClick={() => setOpenUserMenu(!openUserMenu)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <User size={22} />
              </button>

              {openUserMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border p-2">
                  {!isLoggedIn ? (
                    <>
                      <Link
                        to="/register"
                        className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                        onClick={() => setOpenUserMenu(false)}
                      >
                        Đăng ký
                      </Link>

                      <Link
                        to="/login"
                        className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                        onClick={() => setOpenUserMenu(false)}
                      >
                        Đăng nhập
                      </Link>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setOpenUserMenu(false);
                          navigate("/homepage/information");
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                      >
                        Thông tin
                      </button>

                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                        Giỏ hàng
                      </button>

                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                        Hóa đơn
                      </button>

                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                        Hỏi đáp
                      </button>

                      <button
                        onClick={() => {
                          localStorage.removeItem("user");
                          localStorage.removeItem("isLoggedIn");
                          setOpenUserMenu(false);
                          showToast("Đăng xuất thành công.", "success");

                          setTimeout(() => {
                            navigate("/homepage");
                          }, 800);
                        }}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        Đăng xuất
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* mobile dropdown */}
        {openMainMenu && (
          <div className="md:hidden border-t bg-white px-6 py-4 flex flex-col gap-3">
            {menus.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpenMainMenu(false)}
                className="hover:text-blue-600"
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="flex-1">
        <Routes>
          <Route path="" element={<HtmlPage src="/HomePage_main/HomePage_main.html" />} />
          <Route path="contact" element={<HtmlPage src="/Contact/Contact.html" />} />
          <Route path="about" element={<About />} />
          <Route path="product" element={<Product />} />
          <Route path="information" element={<InformationPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          © 2026 MyShop. All rights reserved.
        </div>
      </footer>
      {toast.show && (
        <div className={`toast ${toast.type} show`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}