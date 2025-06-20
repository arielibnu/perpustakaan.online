document.addEventListener("DOMContentLoaded", () => {
  const tambahBtn = document.getElementById("btnTambahBuku");
  const simpanBtn = document.getElementById("btnSimpan");
  const batalBtn = document.getElementById("btnBatal");
  const formModal = document.getElementById("formModal");
  const booksContainer = document.getElementById("booksContainer");
  const searchBox = document.querySelector(".search-box");
  const searchBtn = document.querySelector(".search-button");
  const deskripsiContainer = document.querySelector(".book-deskripsi");
  const btnKosongkan = document.getElementById("btnKosongkan");
  const modalTitle = document.getElementById("modalTitle");

  const menuPengguna = document.getElementById("menuPengguna");
  if (menuPengguna) {
    menuPengguna.addEventListener("click", () => {
      window.location.href = "oo.html";
    });
  }

  let bukuData = JSON.parse(localStorage.getItem("bukuData")) || [];
  let peminjamanPerJudul = {};
  let peminjamanPerKategori = {};

  let editIndex = null;

  const ctxJudul = document.getElementById("chartJudul").getContext("2d");
  const chartJudul = new Chart(ctxJudul, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Jumlah Peminjaman",
          data: [],
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          precision: 0,
          ticks: { stepSize: 1 },
        },
      },
    },
  });

  const ctxKategori = document.getElementById("chartKategori").getContext("2d");
  const chartKategori = new Chart(ctxKategori, {
    type: "pie",
    data: {
      labels: [],
      datasets: [
        {
          label: "Peminjaman per Kategori",
          data: [],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#8A2BE2",
            "#00CED1",
          ],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });

  function simpanKeStorage() {
    localStorage.setItem("bukuData", JSON.stringify(bukuData));
  }

  function prosesDariRiwayatPinjam() {
    peminjamanPerJudul = {};
    peminjamanPerKategori = {};

    const riwayat = JSON.parse(localStorage.getItem("riwayatPinjam")) || [];

    riwayat.forEach((item) => {
      const judul = item.buku;
      peminjamanPerJudul[judul] = (peminjamanPerJudul[judul] || 0) + 1;

      const buku = bukuData.find((b) => b.judul === judul);
      if (buku) {
        const kategori = buku.kategori;
        peminjamanPerKategori[kategori] =
          (peminjamanPerKategori[kategori] || 0) + 1;
      }
    });
  }

  function updateCharts() {
    const statistikJudul =
      JSON.parse(localStorage.getItem("statistikJudul")) || {};
    const statistikKategori =
      JSON.parse(localStorage.getItem("statistikKategori")) || {};

    chartJudul.data.labels = Object.keys(statistikJudul);
    chartJudul.data.datasets[0].data = Object.values(statistikJudul);
    chartJudul.update();

    chartKategori.data.labels = Object.keys(statistikKategori);
    chartKategori.data.datasets[0].data = Object.values(statistikKategori);
    chartKategori.update();
  }

  // Fungsi baru untuk buka PDF dari data URL base64
  function bukaPDF(dataUrl) {
    const base64 = dataUrl.split(",")[1];
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
  }

  function renderBooks(filter = "") {
    booksContainer.innerHTML = "";
    deskripsiContainer.innerHTML = "";
    bukuData.forEach((buku, index) => {
      if (filter && !buku.judul.toLowerCase().includes(filter.toLowerCase()))
        return;

      const bookDiv = document.createElement("div");
      bookDiv.classList.add("book");
      bookDiv.dataset.index = index;
      bookDiv.style.border = "1px solid #ccc";
      bookDiv.style.padding = "10px";
      bookDiv.style.marginBottom = "10px";
      bookDiv.style.display = "flex";
      bookDiv.style.alignItems = "center";
      bookDiv.style.gap = "10px";

      bookDiv.innerHTML = `
        <div style="flex-grow:1; display:flex; align-items:center; gap:10px; cursor:pointer;">
          <img src="${buku.gambar}" alt="${buku.judul}" style="width:80px; height:auto;"/>
          <div>
            <p><strong>${buku.judul}</strong></p>
            <small>${buku.kategori}</small>
          </div>
        </div>
        <div style="display:flex; gap:5px;">
          <button class="edit">Edit</button>
          <button class="hapus">Hapus</button>
        </div>
      `;

      // Event: Tampilkan Deskripsi & tombol Lihat Buku
      bookDiv.querySelector("div").addEventListener("click", () => {
        deskripsiContainer.innerHTML = `
          <h3>${buku.judul}</h3>
          <p><strong>Kategori:</strong> ${buku.kategori}</p>
          <p>${buku.deskripsi || "Tidak ada deskripsi tersedia."}</p>
          <p><a href="#" id="lihatBukuLink">Lihat Buku</a></p>
        `;

        // Event klik Lihat Buku -> buka PDF dari base64
        document
          .getElementById("lihatBukuLink")
          .addEventListener("click", (e) => {
            e.preventDefault();
            bukaPDF(buku.tautan);
          });
      });

      // Event: Edit
      bookDiv.querySelector(".edit").addEventListener("click", () => {
        editIndex = index;
        modalTitle.textContent = "Edit Buku";
        formModal.style.display = "block";
        document.getElementById("judul").value = buku.judul;
        document.getElementById("kategori").value = buku.kategori;
        document.getElementById("gambar").value = buku.gambar;
        // File input (tautan) tidak bisa diisi langsung dengan base64, kosongkan saja
        document.getElementById("tautan").value = "";
        document.getElementById("deskripsi").value = buku.deskripsi;
      });

      // Event: Hapus
      bookDiv.querySelector(".hapus").addEventListener("click", () => {
        if (confirm(`Hapus buku "${buku.judul}"?`)) {
          bukuData.splice(index, 1);
          simpanKeStorage();
          renderBooks(searchBox.value);
          updateCharts();
        }
      });

      booksContainer.appendChild(bookDiv);
    });
  }

  tambahBtn.addEventListener("click", () => {
    editIndex = null;
    modalTitle.textContent = "Tambah Buku";
    formModal.style.display = "block";
    document.getElementById("judul").value = "";
    document.getElementById("kategori").value = "";
    document.getElementById("gambar").value = "";
    document.getElementById("tautan").value = "";
    document.getElementById("deskripsi").value = "";
  });

  batalBtn.addEventListener("click", () => {
    formModal.style.display = "none";
  });

  simpanBtn.addEventListener("click", () => {
    const judulInput = document.getElementById("judul").value.trim();
    const kategoriInput = document.getElementById("kategori").value.trim();
    const gambarInput = document.getElementById("gambar").value.trim();
    const deskripsiInput = document.getElementById("deskripsi").value.trim();
    const fileInput = document.getElementById("tautan");

    if (!judulInput || !kategoriInput || fileInput.files.length === 0) {
      alert("Judul, kategori, dan file PDF wajib diisi!");
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const pdfDataUrl = e.target.result;

      const bukuBaru = {
        judul: judulInput,
        kategori: kategoriInput,
        gambar: gambarInput,
        tautan: pdfDataUrl,
        deskripsi: deskripsiInput,
      };

      if (editIndex !== null) {
        bukuData[editIndex] = bukuBaru;
      } else {
        bukuData.push(bukuBaru);
      }

      simpanKeStorage();
      renderBooks(searchBox.value);
      updateCharts();
      formModal.style.display = "none";
    };

    reader.readAsDataURL(file);
  });

  searchBtn.addEventListener("click", () => {
    renderBooks(searchBox.value);
  });

  searchBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") renderBooks(searchBox.value);
  });

  btnKosongkan.addEventListener("click", () => {
    if (confirm("Yakin ingin mengosongkan seluruh data peminjaman?")) {
      localStorage.removeItem("riwayatPinjam");
      updateCharts();
      alert("Data peminjaman berhasil dikosongkan.");
    }
  });

  renderBooks();
  updateCharts();
});
