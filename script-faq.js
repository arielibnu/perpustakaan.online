document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("faqList")) || [];
  const container = document.getElementById("faq-container");
  const grouped = {};

  // Kelompokkan berdasarkan kategori
  data.forEach((faq) => {
    if (!grouped[faq.kategori]) {
      grouped[faq.kategori] = [];
    }
    grouped[faq.kategori].push(faq);
  });

  // Tampilkan
  for (const kategori in grouped) {
    const section = document.createElement("div");
    section.classList.add("faq-section");
    section.innerHTML = `<h2>${kategori}</h2>`;

    grouped[kategori].forEach((item, index) => {
      section.innerHTML += `
        <div class="faq-item">
          <p><strong>${index + 1}. ${item.pertanyaan}</strong></p>
          <p>${item.jawaban}</p>
        </div>
      `;
    });

    container.appendChild(section);
  }
});
