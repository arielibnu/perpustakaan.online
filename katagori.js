const books = {
    romance: [
        { title: "Tentang Kamu", img: "img/Tentang Kamu.jpeg" },
        { title: "Senja Bersama Ayah", img:"img/Senja Bersama Ayah.jpg"},
        { title: "Dilan", img:"img/Dilan.jpg"},
        { title: "Ancika", img:"img/Ancika.jpg"},
        { title: "Argantara", img:"img/Argantara.jpg"},
        { title: "Arah Kembali", img:"img/Arah Kembali.jpg"},
        { title: "Pulang - Pergi", img: "img/Pulang - Pergi.jpg" },
        { title: "Dikta dan Hukum", img: "img/Dikta dan Hukum.jpg" },
        { title: "Perpustakaan Tengah Malam", img: "img/PTM.jpg" },
        { title: "Luka Cita", img: "img/Luka Cita.jpg" },
        { title: "Pachinko", img: "img/Pachinko.jpg" },
        { title: "Hilmy Milan", img: "img/Hilmy Milan.jpg" } 
    ],
    petualangan: [
        { title: "Matahari", img: "img/matahari.jpeg" },
        { title: "Bumi", img: "img/bumi.jpeg" },
        { title: "Bulan", img:"img/Bulan.jpg"},
        { title: "Komet", img:"img/Komet.jpg"},
        { title: "Lumpu", img:"img/Lumpu.jpg"},
        { title: "Si Anak Badai", img:"img/Si Anaka Badai.jpg"},
        { title: "Hujan", img: "img/Hujan.jpg" },
        { title: "Tragedi Pedang Keadilan", img: "img/Tragedi Pedang Keadilan.jpg" },
        { title: "Masquerade Hotel", img: "img/Masquerade-hotel.jpg" },
        { title: "Angsa dan Kelelawar", img: "img/Angsa-dan-Kelelawar.jpg" },
        { title: "Rumus Kebenaran Musim Panas", img: "img/Rumus Kebenaran Musim Panas.jpg" },
        { title: "Keajaiban Toko Kelontong Namiya", img: "img/Keajaiban-Toko-Kelontong-Namiya.jpg" }
    ],
    horor: [
        { title: "Entrok", img: "img/Entrok.jpg" },
        { title: "Kisah Tanah Jawa", img: "img/Kisah Tanah Jawa.jpg" },
        { title: "Ranjat Kembang", img:"img/Ranjat Kembang.jpg"},
        { title: "Ritual", img:"img/Ritual.jpg"},
        { title: "Narik Sukmo", img:"img/Narik Sukmo.jpg"},
        { title: "Senjakala", img:"img/senjakala.jpg"},
        { title: "Marianne", img:"img/Marianne.jpg"},
        { title: "Journal Of Terror", img:"img/Journal of Terror.jpg"},
        { title: "Mereka Ada", img:"img/Mereka Ada.jpg"},
        { title: "Telekinesis 2", img:"img/Telekinesis 2.jpg"},
        { title: "Dalam Pelukan Maut", img:"img/Dalam Pelukan Maut .jpg"},
        { title: "KKN di Desa Penari", img:"img/KKN di Desa Penari.jpg"}
    ],
    Sejarah: [
        { title: "Novus Ordo Seclorum", img: "img/Novus Ordo Seclorum.jpg" },
        { title: "Majapahit Milenia", img: "img/Majapahit Milenia.jpg" },
        { title: "Ken Angrok", img:"img/ken_angrok.jpg"},
        { title: "Laila Majnun", img:"img/LAILA__MAJNUN.jpg"},
        { title: "Mushaf Cinta", img:"img/Mushaf Cinta.jpg"},
        { title: "The Rise of Majapahit", img:"img/The Rise of Majapahit.jpg"},
        { title: "Luka Cita", img: "img/Luka Cita.jpg" },
        { title: "Dia Adalah Kakakku", img: "img/Dia Adalah Kakakku.jpg" },
        { title: "Gadis Pantai", img: "img/Gadis Pantai.jpg" },
        { title: "1984", img: "img/1984.jpg" },
        { title: "Jejak Dedari", img: "img/Jejak Dedari.jpg" },
        { title: "Raden Mandasia Si Pencuri Daging Sapi", img: "img/RMS.jpg" }
    ]
};

// Fungsi untuk menampilkan buku berdasarkan genre
function showBooks(genre) {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = ''; // Kosongkan daftar buku sebelumnya

    books[genre].forEach(book => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("book-item");

        const bookImage = document.createElement("img");
        bookImage.src = book.img;
        bookImage.alt = book.title;

        const bookTitle = document.createElement("p");
        bookTitle.textContent = book.title;

        bookItem.appendChild(bookImage);
        bookItem.appendChild(bookTitle);
        bookList.appendChild(bookItem);
    });
}
