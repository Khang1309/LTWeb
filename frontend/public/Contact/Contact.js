const form = document.getElementById("contactForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const full_name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!full_name || !email || !message) {
  showToast("Vui lòng nhập đầy đủ họ tên, email và nội dung.", "error");
  return;
}

  if (full_name.length < 2 || full_name.length > 100) {
    showToast("Họ tên phải từ 2 đến 100 ký tự.", "error");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast("Email không hợp lệ.", "error");
    return;
  }

  if (subject.length > 150) {
    showToast("Chủ đề không được vượt quá 150 ký tự.", "error");
    return;
  }

  if (message.length < 10) {
    showToast("Nội dung liên hệ phải có ít nhất 10 ký tự.", "error");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        full_name,
        email,
        subject,
        message
      })
    });

    const data = await response.json();

    if (data.success) {
      showToast("Cảm ơn bạn đã gửi liên hệ. Chúng tôi sẽ phản hồi sớm nhất!");
      form.reset();
    } else {
      showToast(data.message || "Gửi liên hệ thất bại.", "error");
    }
  } catch (error) {
    console.error(error);
    showToast("Không thể kết nối đến server.");
  }
});


function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}