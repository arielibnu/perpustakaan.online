document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("searchInput");
  const books = document.querySelectorAll(".book-card");

  input.addEventListener("keyup", function () {
    const keyword = this.value.toLowerCase().trim();

    books.forEach((book) => {
      const title = book.getAttribute("data-title")?.toLowerCase() || "";
      const author = book.getAttribute("data-author")?.toLowerCase() || "";
      const fullText = `${title} ${author}`;

      if (fullText.includes(keyword)) {
        book.style.display = "inline-block";
      } else {
        book.style.display = "none";
      }
    });
  });
});
