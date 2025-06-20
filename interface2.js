// Saat user klik rating bintang
document.querySelectorAll('.star-rating input').forEach(function (radio) {
  radio.addEventListener('change', function () {
    alert("Kamu memberi rating: " + this.value + " bintang");
  });
});

// Saat tombol kirim ditekan
const tombolKirim = document.querySelector('button');
tombolKirim.addEventListener('click', function () {
  const komentar = document.querySelector('textarea').value;
  const rating = document.querySelector('input[name="rating"]:checked');

  if (!komentar.trim()) {
    alert("Komentar tidak boleh kosong!");
    return;
  }

  if (!rating) {
    alert("Pilih rating terlebih dahulu ya!");
    return;
  }

  // Kamu bisa ubah ini menjadi proses kirim ke server, dsb
  console.log("Komentar:", komentar);
  console.log("Rating:", rating.value);
  alert("Komentar dan rating berhasil dikirim!\n\nRating: " + rating.value + " bintang\nKomentar: " + komentar);
  
  // Kosongkan kembali setelah submit
  document.querySelector('textarea').value = "";
  rating.checked = false;
});
