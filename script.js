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


// Saat menu Daftar Pengguna diklik, tampilkan daftar pengguna
menuPengguna.addEventListener("click", () => {
  window.location.href = "../manajemen admin/oo.html";
});

  let bukuData = JSON.parse(localStorage.getItem("bukuData")) || [];
  let peminjamanPerJudul = JSON.parse(localStorage.getItem("peminjamanData")) || {};
  let peminjamanPerKategori = {};

  let editIndex = null;

  const ctxJudul = document.getElementById("chartJudul").getContext("2d");
  let chartJudul = new Chart(ctxJudul, {
    type: "bar",
    data: {
      labels: [],
      datasets: [{
        label: "Jumlah Peminjaman",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, precision: 0, ticks: { stepSize: 1 } }
      }
    }
  });

  const ctxKategori = document.getElementById("chartKategori").getContext("2d");
  let chartKategori = new Chart(ctxKategori, {
    type: "pie",
    data: {
      labels: [],
      datasets: [{
        label: "Peminjaman per Kategori",
        data: [],
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
          "#9966FF", "#FF9F40", "#8A2BE2", "#00CED1"
        ],
      }]
    },
    options: {
      responsive: true,
    }
  });

  function simpanKeStorage() {
    localStorage.setItem("bukuData", JSON.stringify(bukuData));
    localStorage.setItem("peminjamanData", JSON.stringify(peminjamanPerJudul));
  }

  function hitungPeminjamanPerKategori() {
    peminjamanPerKategori = {};
    for (const [judul, count] of Object.entries(peminjamanPerJudul)) {
      const buku = bukuData.find(b => b.judul === judul);
      if (buku) {
        peminjamanPerKategori[buku.kategori] = (peminjamanPerKategori[buku.kategori] || 0) + count;
      }
    }
  }

  function updateCharts() {
    chartJudul.data.labels = Object.keys(peminjamanPerJudul);
    chartJudul.data.datasets[0].data = Object.values(peminjamanPerJudul);
    chartJudul.update();

    hitungPeminjamanPerKategori();
    chartKategori.data.labels = Object.keys(peminjamanPerKategori);
    chartKategori.data.datasets[0].data = Object.values(peminjamanPerKategori);
    chartKategori.update();
  }

  function renderBooks(filter = "") {
    booksContainer.innerHTML = "";
    deskripsiContainer.innerHTML = "";
    bukuData.forEach((buku, index) => {
      if (filter && !buku.judul.toLowerCase().includes(filter.toLowerCase())) return;

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
        <a href="${buku.tautan}" target="_blank" style="flex-grow:1; display:flex; align-items:center; gap:10px; text-decoration:none; color:black;">
          <img src="${buku.gambar}" alt="${buku.judul}" style="width:80px; height:auto;"/>
          <div>
            <p><strong>${buku.judul}</strong></p>
            <small>${buku.kategori}</small>
          </div>
        </a>
        <div style="display:flex; gap:5px;">
          <button class="pinjam">Pinjam</button>
          <button class="edit">Edit</button>
          <button class="hapus">Hapus</button>
        </div>
      `;

      // Tampilkan deskripsi saat gambar/judul diklik
      bookDiv.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();
        deskripsiContainer.innerHTML = `
          <h3>${buku.judul}</h3>
          <p><strong>Kategori:</strong> ${buku.kategori}</p>
          <p>${buku.deskripsi || "Tidak ada deskripsi tersedia."}</p>
          <p><a href="${buku.tautan}" target="_blank">Lihat Buku</a></p>
        `;
      });

      // Event tombol Pinjam
      bookDiv.querySelector(".pinjam").addEventListener("click", () => {
        const judul = buku.judul;
        peminjamanPerJudul[judul] = (peminjamanPerJudul[judul] || 0) + 1;
        simpanKeStorage();
        updateCharts();
        alert(`Buku "${judul}" berhasil dipinjam!`);
      });

      // Event tombol Edit
      bookDiv.querySelector(".edit").addEventListener("click", () => {
        editIndex = index;
        modalTitle.textContent = "Edit Buku";
        formModal.style.display = "block";
        document.getElementById("judul").value = buku.judul;
        document.getElementById("kategori").value = buku.kategori;
        document.getElementById("gambar").value = buku.gambar;
        document.getElementById("tautan").value = buku.tautan;
        document.getElementById("deskripsi").value = buku.deskripsi;
      });

      // Event tombol Hapus
      bookDiv.querySelector(".hapus").addEventListener("click", () => {
        if (confirm(`Hapus buku "${buku.judul}"?`)) {
          delete peminjamanPerJudul[buku.judul];
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
    const tautanInput = document.getElementById("tautan").value.trim();
    const deskripsiInput = document.getElementById("deskripsi").value.trim();

    if (!judulInput || !kategoriInput) {
      alert("Judul dan kategori wajib diisi!");
      return;
    }

    if (editIndex !== null) {
      const oldJudul = bukuData[editIndex].judul;
      if (oldJudul !== judulInput && peminjamanPerJudul[oldJudul]) {
        peminjamanPerJudul[judulInput] = peminjamanPerJudul[oldJudul];
        delete peminjamanPerJudul[oldJudul];
      }

      bukuData[editIndex] = {
        judul: judulInput,
        kategori: kategoriInput,
        gambar: gambarInput,
        tautan: tautanInput,
        deskripsi: deskripsiInput
      };
    } else {
      bukuData.push({
        judul: judulInput,
        kategori: kategoriInput,
        gambar: gambarInput,
        tautan: tautanInput,
        deskripsi: deskripsiInput
      });
    }

    simpanKeStorage();
    renderBooks(searchBox.value);
    updateCharts();
    formModal.style.display = "none";
  });

  searchBtn.addEventListener("click", () => {
    renderBooks(searchBox.value);
  });

  searchBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") renderBooks(searchBox.value);
  });

  btnKosongkan.addEventListener("click", () => {
    if (confirm("Yakin ingin mengosongkan seluruh data peminjaman?")) {
      peminjamanPerJudul = {};
      simpanKeStorage();
      updateCharts();
      alert("Data peminjaman berhasil dikosongkan.");
    }
  });

  renderBooks();
  updateCharts();
});
