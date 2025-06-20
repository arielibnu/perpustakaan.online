document.addEventListener("DOMContentLoaded", () => {
  // Admin access check
  // const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  // if (!currentUser || currentUser.role !== "admin") {
  //   alert("Anda tidak memiliki akses ke halaman ini!");
  //   window.location.href = "login.html";
  //   return;
  // }

  // DOM Elements
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
  const menuAdmin = document.getElementById("menuAdmin");

  // Data initialization
  let bukuData = JSON.parse(localStorage.getItem("bukuData")) || [];
  let peminjamanPerJudul = JSON.parse(localStorage.getItem("peminjamanData")) || {};
  let peminjamanPerKategori = {};
  let editIndex = null;

  // Chart initialization
  const ctxJudul = document.getElementById("chartJudul").getContext("2d");
  const chartJudul = new Chart(ctxJudul, {
    type: "bar",
    data: {
      labels: [],
      datasets: [{
        label: "Jumlah Peminjaman",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          precision: 0,
          ticks: { stepSize: 1 }
        }
      }
    }
  });

  const ctxKategori = document.getElementById("chartKategori").getContext("2d");
  const chartKategori = new Chart(ctxKategori, {
    type: "pie",
    data: {
      labels: [],
      datasets: [{
        label: "Peminjaman per Kategori",
        data: [],
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
          "#9966FF", "#FF9F40", "#8A2BE2", "#00CED1"
        ]
      }]
    },
    options: {
      responsive: true
    }
  });

  // Data management functions
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

  // Book rendering function
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

      // Book click event
      bookDiv.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();
        deskripsiContainer.innerHTML = `
          <h3>${buku.judul}</h3>
          <p><strong>Kategori:</strong> ${buku.kategori}</p>
          <p>${buku.deskripsi || "Tidak ada deskripsi tersedia."}</p>
          <p><a href="${buku.tautan}" target="_blank">Lihat Buku</a></p>
        `;
      });

      // Borrow button event
      bookDiv.querySelector(".pinjam").addEventListener("click", () => {
        const judul = buku.judul;
        peminjamanPerJudul[judul] = (peminjamanPerJudul[judul] || 0) + 1;
        simpanKeStorage();
        updateCharts();
        alert(`Buku "${judul}" berhasil dipinjam!`);
      });

      // Edit button event
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

      // Delete button event
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

  // Form management
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

  // Search functionality
  searchBtn.addEventListener("click", () => {
    renderBooks(searchBox.value);
  });

  searchBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") renderBooks(searchBox.value);
  });

  // Clear borrowing data
  btnKosongkan.addEventListener("click", () => {
    if (confirm("Yakin ingin mengosongkan seluruh data peminjaman?")) {
      peminjamanPerJudul = {};
      simpanKeStorage();
      updateCharts();
      alert("Data peminjaman berhasil dikosongkan.");
    }
  });

  // User management
  if (menuPengguna) {
    menuPengguna.addEventListener("click", () => {
      window.location.href = "oo.html";
    });
  }

  if (menuAdmin) {
    menuAdmin.addEventListener("click", renderDaftarPengguna);
  }

  function renderDaftarPengguna() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const content = document.querySelector(".content");
    
    content.innerHTML = `
      <div class="book-section">
        <div class="kategori-bar">
          <h2>Manajemen Pengguna</h2>
        </div>
        <div>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #364f6b; color: white;">
                <th style="padding: 10px; text-align: left;">Username</th>
                <th style="padding: 10px; text-align: left;">Email</th>
                <th style="padding: 10px; text-align: left;">Role</th>
                <th style="padding: 10px; text-align: left;">Status</th>
                <th style="padding: 10px; text-align: left;">Aksi</th>
              </tr>
            </thead>
            <tbody id="listPengguna">
              ${users.map(user => `
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 10px;">${user.username}</td>
                  <td style="padding: 10px;">${user.email}</td>
                  <td style="padding: 10px;">${user.role}</td>
                  <td style="padding: 10px;">
                    <span class="status-badge" style="
                      background-color: ${user.status === 'active' ? '#4CAF50' : '#f44336'};
                      color: white;
                      padding: 3px 8px;
                      border-radius: 12px;
                      font-size: 12px;
                    ">
                      ${user.status || 'active'}
                    </span>
                  </td>
                  <td style="padding: 10px; display: flex; gap: 5px;">
                    <button onclick="ubahRole('${user.email}')" 
                      style="padding: 5px 10px; background-color: #4a90e2; color: white; border: none; border-radius: 4px; cursor: pointer;">
                      Ubah Role
                    </button>
                    <button onclick="toggleStatus('${user.email}')" 
                      style="padding: 5px 10px; background-color: ${user.status === 'active' ? '#FF9800' : '#4CAF50'}; color: white; border: none; border-radius: 4px; cursor: pointer;">
                      ${user.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <button onclick="hapusPengguna('${user.email}')" 
                      style="padding: 5px 10px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                      Hapus
                    </button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
}
  window.toggleStatus = function(email) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
        users[userIndex].status = users[userIndex].status === 'active' ? 'offline' : 'active';
        localStorage.setItem("users", JSON.stringify(users));
        renderDaftarPengguna();
        alert(`Status pengguna berhasil diubah menjadi ${users[userIndex].status}`);
    }
};

window.hapusPengguna = function(email) {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const updatedUsers = users.filter(user => user.email !== email);
        
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        renderDaftarPengguna();
        alert("Pengguna berhasil dihapus");
    }
};
  window.ubahRole = function(email) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email);
    
    if (user) {
      const newRole = prompt("Masukkan role baru (admin/user):", user.role);
      if (newRole && (newRole === "admin" || newRole === "user")) {
        user.role = newRole;
        localStorage.setItem("users", JSON.stringify(users));
        renderDaftarPengguna();
        alert("Role berhasil diubah");
      }
    }
  };

  // Initial render
  renderBooks();
  updateCharts();
});