// Buka popup saat tombol "Pinjam" diklik
document.getElementById("openPopupBtn").addEventListener("click", function () {
  document.getElementById("popupForm").style.display = "flex";
});

// Tutup popup saat tombol "x" diklik
document.getElementById("closePopupBtn").addEventListener("click", function () {
  document.getElementById("popupForm").style.display = "none";
});

// Tangani submit form
document.getElementById("formPinjam").addEventListener("submit", function (e) {
  e.preventDefault(); // Mencegah reload halaman

  const nama = document.getElementById("nama").value.trim();
  const telp = document.getElementById("telp").value.trim();
  const successMsg = document.getElementById("success-message");

  if (nama !== "" && telp !== "") {
    // Tambahkan ke tabel
    const tbody = document.querySelector("#tabelPeminjam tbody");
    const row = document.createElement("tr");

    const namaCell = document.createElement("td");
    namaCell.textContent = nama;

    const telpCell = document.createElement("td");
    telpCell.textContent = telp;

    row.appendChild(namaCell);
    row.appendChild(telpCell);
    tbody.appendChild(row);

    // Simpan ke localStorage untuk riwayat
    const pinjamData = {
      nama: nama,
      telp: telp,
      deadline: hitungDeadline(3), // contoh: 3 hari ke depan
      buku: "3726 Mdpl"
    };
    simpanKeLocalStorage(pinjamData);

    // Tampilkan pesan sukses
    successMsg.style.display = "block";

    // Reset form
    document.getElementById("formPinjam").reset();

    // Sembunyikan popup otomatis setelah 2 detik dan redirect ke riwayat
    setTimeout(() => {
      document.getElementById("popupForm").style.display = "none";
      successMsg.style.display = "none"
    }, 2000);
  } else {
    alert("Harap isi nama dan nomor telepon dengan benar.");
  }
});

// Fungsi menyimpan ke localStorage
function simpanKeLocalStorage(data) {
  let riwayat = JSON.parse(localStorage.getItem("riwayatPeminjaman")) || [];
  riwayat.push(data);
  localStorage.setItem("riwayatPeminjaman", JSON.stringify(riwayat));
}

// Fungsi deadline (misalnya +3 hari dari sekarang)
function hitungDeadline(hari) {
  const sekarang = new Date();
  sekarang.setDate(sekarang.getDate() + hari);
  return sekarang.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
