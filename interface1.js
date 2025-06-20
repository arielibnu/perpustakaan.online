document.addEventListener("DOMContentLoaded", function () {
  // Tangani semua tombol Pinjam
  document.querySelectorAll(".pinjamBtn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.getElementById("popupForm").style.display = "flex";
    });
  });

  // Tutup popup
  const closeBtn = document.getElementById("closePopupBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      document.getElementById("popupForm").style.display = "none";
    });
  }

  // Fungsi hapus baris
  window.hapusBaris = function (btn) {
    const row = btn.closest("tr"); {
      row.remove();
    }
  };
});
document.addEventListener("DOMContentLoaded", function () {
  // Tangani semua tombol Pinjam
  document.querySelectorAll(".pinjamBtn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.getElementById("popupForm").style.display = "flex";
    });
  });

  // Tutup popup
  const closeBtn = document.getElementById("closePopupBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      document.getElementById("popupForm").style.display = "none";
    });
  }

  // Fungsi hapus baris
  window.hapusBaris = function (btn) {
    const row = btn.closest("tr");
    if (row) row.remove();
  };

  // ✅ Pengecekan Notifikasi Otomatis
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        cekPeringatanPengembalian();
      }
    });
  }

  // Fungsi untuk cek tanggal pengembalian & notifikasi
  function cekPeringatanPengembalian() {
    // Ganti dengan ID atau class sesuai yang kamu pakai di HTML (disesuaikan)
    const pinjamInput = document.getElementById("tglPinjam");
    const kembaliInput = document.getElementById("tglKembali");

    if (!pinjamInput || !kembaliInput) return;

    const pinjam = new Date(pinjamInput.value);
    const kembali = new Date(kembaliInput.value);
    const jatuhTempo = new Date(pinjam);
    jatuhTempo.setDate(jatuhTempo.getDate() + 14); // 14 hari masa pinjam

    const sekarang = new Date();
    const bedaHari = Math.ceil((jatuhTempo - sekarang) / (1000 * 60 * 60 * 24));

    if (bedaHari === 1) {
      new Notification("📚 Peringatan Pengembalian", {
        body: "Besok adalah batas waktu pengembalian buku!",
        icon: "https://img.icons8.com/ios-filled/50/book.png"
      });
    } else if (bedaHari === 0) {
      new Notification("📚 Hari Ini Jatuh Tempo!", {
        body: "Hari ini terakhir pengembalian buku. Jangan lupa ya!",
        icon: "https://img.icons8.com/ios-filled/50/book.png"
      });
    } else if (bedaHari < 0) {
      new Notification("⚠ Lewat Jatuh Tempo", {
        body: `Buku sudah terlambat dikembalikan (${Math.abs(bedaHari)} hari).`,
        icon: "https://img.icons8.com/ios-filled/50/book.png"
      });
    }
  }
});
