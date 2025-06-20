// Form toggle functions
function tampilDaftar() {
  document.getElementById('form-login').classList.remove('active');
  document.getElementById('form-daftar').classList.add('active');
}

function tampilLogin() {
  document.getElementById('form-daftar').classList.remove('active');
  document.getElementById('form-login').classList.add('active');
}
// Pindahkan ini ke luar DOMContentLoaded
function openPopup(id) {
  const popup = document.getElementById(id);
  if (popup) popup.classList.add("active");

  if (id === "reset-password") {
    // Show email input and send code button
    document.getElementById("resetEmail").style.display = "block";
    document.querySelector("label[for='resetEmail']").style.display = "block";
    document.getElementById("sendCodeBtn").style.display = "inline-block";

    // Hide other elements
    document.getElementById("verificationCode").style.display = "none";
    document.querySelector("label[for='verificationCode']").style.display = "none";
    document.getElementById("verifyBtn").style.display = "none";
    document.getElementById("newPassword").style.display = "none";
    document.querySelector("label[for='newPassword']").style.display = "none";
    document.getElementById("confirmNewPassword").style.display = "none";
    document.querySelector("label[for='confirmNewPassword']").style.display = "none";
    document.getElementById("resetBtn").style.display = "none";

    // Clear all inputs
    document.getElementById("resetEmail").value = "";
    document.getElementById("verificationCode").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmNewPassword").value = "";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Kode yang ada tetap di sini
  // Hapus definisi window.openPopup dari dalam ini
});
document.addEventListener("DOMContentLoaded", function () {

  // Popup functions
  function closePopup(id) {
    document.getElementById(id).classList.remove("active");
  }

  // Registration validation
  const daftarButton = document.querySelector('#form-daftar .masuk');
  if (daftarButton) {
    daftarButton.addEventListener("click", function (e) {
      e.preventDefault();

      const username = document.getElementById("username")?.value.trim();
      const email = document.getElementById("daftar-email")?.value.trim();
      const password = document.getElementById("daftar-password")?.value.trim();
      const konfirmasi = document.getElementById("konfirmasi-password")?.value.trim();

      if (!username || !email || !password || !konfirmasi) {
        alert("Semua field harus diisi!");
        return;
      }

      if (password !== konfirmasi) {
        alert("Konfirmasi password tidak cocok!");
        return;
      }

      // Save new user data
      const newUser = {
        username,
        email,
        password,
        role: "user",
        status: "active",  // Add default status
      registeredAt: new Date().toISOString()
      };

      // Get existing users
      const users = JSON.parse(localStorage.getItem("users")) || [];
      
      // Check if email already exists
      if (users.some(user => user.email === email)) {
        alert("Email sudah terdaftar!");
        return;
      }

      // Add new user
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      alert("Anda telah berhasil mendaftar");
      tampilLogin();
    });
  }

  // Login validation
  const loginButton = document.querySelector('#form-login .masuk');
  if (loginButton) {
    loginButton.addEventListener("click", function (e) {
      e.preventDefault();

      const emailLogin = document.getElementById("email")?.value.trim();
      const passwordLogin = document.getElementById("password")?.value.trim();

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.email === emailLogin && u.password === passwordLogin);

      if (user) {
        // Save logged in user data
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        
        if (user.role === "admin") {
          alert("Login sebagai Admin berhasil!");
          window.location.href = "riko.html";
        } else {
          alert("Login berhasil! Menuju halaman utama...");
          window.location.href = "Home.html";
        }
      } else {
        // Check default admin login
        const adminEmail = "admin@gmail.com";
        const adminPassword = "admin123";
        
        if (emailLogin === adminEmail && passwordLogin === adminPassword) {
          const adminUser = {
            username: "Admin",
            email: adminEmail,
            role: "admin",
            registeredAt: new Date().toISOString()
          };
          sessionStorage.setItem("currentUser", JSON.stringify(adminUser));
          alert("Login sebagai Admin berhasil!");
          window.location.href = "riko.html";
        } else {
          alert("Email atau password salah!");
        }
      }
    });
  }

  // Password reset functionality
  let generatedCode = "";

  window.closePopup = function (id) {
    const popup = document.getElementById(id);
    if (popup) popup.classList.remove("active");
  };

  window.sendVerificationCode = function () {
    const email = document.getElementById("resetEmail")?.value.trim();
    const users = JSON.parse(localStorage.getItem("users")) || [];

  // Cek apakah email ada di daftar users
    const userExists = users.some(user => user.email === email);

    if (!email || !userExists) {
      alert("Email tidak cocok atau belum terdaftar!");
      return;
    }

    generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    alert("Kode verifikasi kamu adalah: " + generatedCode);

    document.querySelector("label[for='verificationCode']").style.display = "block";
    document.getElementById("verificationCode").style.display = "block";
    document.getElementById("verifyBtn").style.display = "inline-block";
  };

  window.verifyCode = function () {
    const inputCode = document.getElementById("verificationCode")?.value.trim();

    if (inputCode === generatedCode) {
      alert("Kode verifikasi benar. Silakan atur ulang kata sandi.");

      // Hide email and code verification elements
      document.getElementById("resetEmail").style.display = "none";
      document.querySelector("label[for='resetEmail']").style.display = "none";
      document.getElementById("sendCodeBtn").style.display = "none";
      document.getElementById("verificationCode").style.display = "none";
      document.querySelector("label[for='verificationCode']").style.display = "none";
      document.getElementById("verifyBtn").style.display = "none";

      // Show password reset elements
      document.querySelector("label[for='newPassword']").style.display = "block";
      document.getElementById("newPassword").style.display = "block";
      document.querySelector("label[for='confirmNewPassword']").style.display = "block";
      document.getElementById("confirmNewPassword").style.display = "block";
      document.getElementById("resetBtn").style.display = "inline-block";
    } else {
      alert("Kode verifikasi salah!");
    }
  };

  window.resetPassword = function () {
    const newPassword = document.getElementById("newPassword")?.value.trim();
    const confirmNewPassword = document.getElementById("confirmNewPassword")?.value.trim();

    if (!newPassword || !confirmNewPassword) {
      alert("Kata sandi tidak boleh kosong!");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("Konfirmasi kata sandi tidak cocok!");
      return;
    }

    localStorage.setItem("registeredPassword", newPassword);
    alert("Kata sandi berhasil diubah!");
    closePopup("reset-password");
  };
});