const API_BASE = "http://localhost:8000";

function getAdmin() {
  const raw = localStorage.getItem("admin");
  return raw ? JSON.parse(raw) : null;
}

function logoutAdmin() {
  localStorage.removeItem("admin");
  window.location.href = "login.html";
}

function requireAdmin() {
  const admin = getAdmin();

  if (!admin) {
    window.location.href = "login.html";
    return null;
  }

  document.querySelectorAll(".admin-name").forEach((el) => {
    el.textContent = admin.full_name || "Admin";
  });

  document.querySelectorAll(".admin-role").forEach((el) => {
    el.textContent = Number(admin.is_super_admin) === 1 ? "Super Admin" : "Admin";
  });

  const superAdminMenu = document.getElementById("superAdminMenu");
  if (superAdminMenu) {
    superAdminMenu.style.display =
      Number(admin.is_super_admin) === 1 ? "block" : "none";
  }

  return admin;
}


async function loadAdminInfo() {
  const admin = requireAdmin();
  if (!admin) return;

  const adminId = admin.admin_id || admin.user_id;

  try {
    const res = await fetch(`${API_BASE}/api/admin/info?admin_id=${adminId}`);
    const result = await res.json();

    console.log("ADMIN INFO RESPONSE:", result);

    const info = result.data || result.admin;

    if (!result.success || !info) {
      alert(result.message || "Không lấy được thông tin admin");
      return;
    }

    document.getElementById("adminFullName").textContent = info.full_name || "";
    document.getElementById("adminEmail").textContent = info.email || "";
    document.getElementById("adminPhone").textContent = info.phone || "";
    document.getElementById("adminSalary").textContent = info.salary || "0";
    document.getElementById("adminRole").textContent =
      Number(info.is_super_admin) === 1 ? "Super Admin" : "Admin";

  } catch (err) {
    console.error("LOAD ADMIN INFO ERROR:", err);
    alert("Không kết nối được API admin info");
  }
}

async function loadAdminProfilePage() {
  const admin = requireAdmin();
  if (!admin) return;

  const adminId = admin.admin_id || admin.user_id;

  try {
    const res = await fetch(`${API_BASE}/api/admin/info?admin_id=${adminId}`);
    const result = await res.json();

    const info = result.data || result.admin;

    if (!result.success || !info) {
      alert(result.message || "Không lấy được thông tin admin");
      return;
    }

    document.querySelectorAll(".admin-name").forEach((el) => {
      el.textContent = info.full_name || "Admin";
    });

    document.querySelectorAll(".admin-role").forEach((el) => {
      el.textContent = Number(info.is_super_admin) === 1 ? "Super Admin" : "Admin";
    });

    const fullName = document.getElementById("adminProfileFullName");
    const email = document.getElementById("adminProfileEmail");
    const phone = document.getElementById("adminProfilePhone");
    const role = document.getElementById("adminProfileRole");
    const salary = document.getElementById("adminProfileSalary");

    if (fullName) fullName.textContent = info.full_name || "";
    if (email) email.textContent = info.email || "";
    if (phone) phone.textContent = info.phone || "";
    if (role) role.textContent = Number(info.is_super_admin) === 1 ? "Super Admin" : "Admin";
    if (salary) salary.textContent = Number(info.salary || 0).toLocaleString("vi-VN") + " VNĐ";

    localStorage.setItem("admin", JSON.stringify(info));
  } catch (err) {
    console.error("LOAD ADMIN PROFILE ERROR:", err);
    alert("Không kết nối được API admin info");
  }
}


async function loadAdminEditForm() {
  const admin = requireAdmin();
  if (!admin) return;

  const adminId = admin.admin_id || admin.user_id;

  const res = await fetch(`${API_BASE}/api/admin/info?admin_id=${adminId}`);
  const result = await res.json();
  const info = result.data || result.admin;

  if (!result.success || !info) return;

  document.getElementById("adminEditFullName").value = info.full_name || "";
  document.getElementById("adminEditEmail").value = info.email || "";
  document.getElementById("adminEditPhone").value = info.phone || "";

  const form = document.getElementById("adminUpdateForm");
  const message = document.getElementById("adminUpdateMessage");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const full_name = document.getElementById("adminEditFullName").value.trim();
    const phone = document.getElementById("adminEditPhone").value.trim();

    message.textContent = "";
    message.className = "mt-3";

    try {
      const updateRes = await fetch(`${API_BASE}/api/admin/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          admin_id: adminId,
          full_name,
          phone
        })
      });

      const updateData = await updateRes.json();

      if (!updateData.success) {
        message.textContent = updateData.message || "Cập nhật thất bại";
        message.classList.add("text-danger");
        return;
      }

      const updatedAdmin = updateData.admin || updateData.data;

      localStorage.setItem("admin", JSON.stringify(updatedAdmin));

      message.textContent = "Cập nhật thông tin thành công";
      message.classList.add("text-success");

      requireAdmin();
    } catch (err) {
      message.textContent = "Không kết nối được server";
      message.classList.add("text-danger");
    }
  });
}


function initAdminChangePassword() {
  const admin = requireAdmin();
  if (!admin) return;

  const adminId = admin.admin_id || admin.user_id;
  const form = document.getElementById("adminChangePasswordForm");
  const message = document.getElementById("changePasswordMessage");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const old_password = document.getElementById("oldPassword").value.trim();
    const new_password = document.getElementById("newPassword").value.trim();
    const confirm_password = document.getElementById("confirmPassword").value.trim();

    message.textContent = "";
    message.className = "text-center mt-3";

    try {
      const res = await fetch(`${API_BASE}/api/admin/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          admin_id: adminId,
          old_password,
          new_password,
          confirm_password
        })
      });

      const data = await res.json();

      if (!data.success) {
        message.textContent = data.message || "Đổi mật khẩu thất bại";
        message.classList.add("text-danger");
        return;
      }

      message.textContent = "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.";
      message.classList.add("text-success");

      setTimeout(() => {
        logoutAdmin();
      }, 1200);
    } catch (err) {
      message.textContent = "Không kết nối được server";
      message.classList.add("text-danger");
    }
  });
}