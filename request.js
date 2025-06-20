document.getElementById("bookRequestForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const judul = document.getElementById("judul").value;
  const pengarang = document.getElementById("pengarang").value;
  const penerbit = document.getElementById("penerbit").value;
  const catatan = document.getElementById("catatan").value;

  console.log("Data Buku Dikirim:");
  console.log("Judul:", judul);
  console.log("Pengarang:", pengarang);
  console.log("Penerbit:", penerbit);
  console.log("Catatan:", catatan);

  alert("Terimakasih, Permintaan buku berhasil dikirim!");

  this.reset();
});
