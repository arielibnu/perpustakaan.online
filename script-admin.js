function tambahFAQ() {
  const kategori = document.getElementById("kategori").value.trim();
  const pertanyaan = document.getElementById("pertanyaan").value.trim();
  const jawaban = document.getElementById("jawaban").value.trim();

  if (!kategori || !pertanyaan || !jawaban) {
    alert("Semua kolom harus diisi!");
    return;
  }

  const dataLama = JSON.parse(localStorage.getItem("faqList")) || [];
  dataLama.push({ kategori, pertanyaan, jawaban });
  localStorage.setItem("faqList", JSON.stringify(dataLama));

  alert("FAQ berhasil ditambahkan!");
  document.getElementById("kategori").value = "";
  document.getElementById("pertanyaan").value = "";
  document.getElementById("jawaban").value = "";

  tampilkanFAQ();
}

function tampilkanFAQ() {
  const data = JSON.parse(localStorage.getItem("faqList")) || [];
  const wrapper = document.getElementById("faqWrapper");
  wrapper.innerHTML = "";

  const kategoriMap = {};

  data.forEach((item, index) => {
    if (!kategoriMap[item.kategori]) {
      kategoriMap[item.kategori] = [];
    }
    kategoriMap[item.kategori].push({ ...item, index });
  });

  for (const kategori in kategoriMap) {
    const judul = document.createElement("h2");
    judul.textContent = kategori;
    wrapper.appendChild(judul);

    kategoriMap[kategori].forEach((item) => {
      const box = document.createElement("div");
      box.className = "faq-box";

      const tanya = document.createElement("strong");
      tanya.textContent = item.pertanyaan;

      const jawab = document.createElement("p");
      jawab.textContent = item.jawaban;

      const btnHapus = document.createElement("button");
      btnHapus.textContent = "Hapus";
      btnHapus.className = "hapus-btn";
      btnHapus.onclick = () => hapusFAQ(item.index);

      box.appendChild(tanya);
      box.appendChild(jawab);
      box.appendChild(btnHapus);
      wrapper.appendChild(box);
    });
  }
}

function hapusFAQ(index) {
  const data = JSON.parse(localStorage.getItem("faqList")) || [];
  if (confirm("Yakin ingin menghapus FAQ ini?")) {
    data.splice(index, 1);
    localStorage.setItem("faqList", JSON.stringify(data));
    tampilkanFAQ();
  }
}

document.addEventListener("DOMContentLoaded", tampilkanFAQ);
