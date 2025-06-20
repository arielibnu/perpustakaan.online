document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
});

document.querySelectorAll('.read-button').forEach(button => {
  button.addEventListener('click', () => {
    window.location.href = 'peminjaman.html';
  });
});