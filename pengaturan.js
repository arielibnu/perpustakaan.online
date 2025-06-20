 const languageData = {
      id: {
        "pengaturan-title": "Pengaturan",
        "akun-title": "Akun Pengguna",
        "edit-profil": "Edit Profil",
        "ubah-password": "Ubah Kata Sandi",
        "kalender": "Kalender Baca Pribadi",
        "bahasa-title": "🌐 Bahasa",
        "notif-title": "Notifikasi",
        "app-notif": "App Notifikasi",
        "kritik": "Kritik & Saran",
        "tentang": "Tentang",
        "logout": "Log out"
      },
      en: {
        "pengaturan-title": "Settings",
        "akun-title": "User Account",
        "edit-profil": "Edit Profile",
        "ubah-password": "Change Password",
        "kalender": "Personal Reading Calendar",
        "bahasa-title": "🌐 Language",
        "notif-title": "Notification",
        "app-notif": "App Notification",
        "kritik": "Feedback",
        "tentang": "About",
        "logout": "Log out"
      }
    };

    function setLanguage(lang) {
      const texts = languageData[lang];
      for (let id in texts) {
        const el = document.getElementById(id);
        if (el) el.textContent = texts[id];
      }
      localStorage.setItem("language", lang);
    }

    // Set bahasa dari localStorage saat halaman dimuat
    window.onload = function() {
      const savedLang = localStorage.getItem("language") || "id";
      setLanguage(savedLang);
      document.getElementById("languageSelect").value = savedLang;
    };

    // Toggle dark mode
    const toggle = document.getElementById('darkModeToggle');
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });