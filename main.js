// Inisialisasi array untuk menyimpan daftar buku
let books = [];

// Fungsi untuk menambahkan buku baru
function addBook(event) {
  event.preventDefault();

  // Mendapatkan data buku dari formulir
  const titleInput = document.querySelector("#inputBookTitle");
  const authorInput = document.querySelector("#inputBookAuthor");
  const yearInput = document.querySelector("#inputBookYear");
  const isCompleteInput = document.querySelector("#inputBookIsComplete");

  // Mengonversi yearInput ke angka (number)
  const year = parseInt(yearInput.value, 10);

  // Membuat objek buku baru
  const newBook = {
    id: +new Date(),
    title: titleInput.value,
    author: authorInput.value,
    year: year,
    isComplete: isCompleteInput.checked,
  };

  // Menambahkan buku ke dalam array dan memicu peristiwa "bookChanged"
  books.push(newBook);
  document.dispatchEvent(new Event("bookChanged"));
}

// Fungsi untuk mencari buku
function searchBook(event) {
  event.preventDefault();

  const searchInput = document.querySelector("#searchBookTitle");
  const query = searchInput.value.toLowerCase();

  // Menampilkan hasil pencarian
  if (query) {
    displayBooks(
      books.filter((book) => book.title.toLowerCase().includes(query))
    );
  } else {
    displayBooks(books);
  }
}

// Fungsi untuk menandai buku sebagai "Selesai dibaca"
function markAsRead(event) {
  const bookId = Number(event.target.id);
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex].isComplete = true;
    document.dispatchEvent(new Event("bookChanged"));
  }
}

// Fungsi untuk menandai buku sebagai "Belum Selesai dibaca"
function markAsUnread(event) {
  const bookId = Number(event.target.id);
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex].isComplete = false;
    document.dispatchEvent(new Event("bookChanged"));
  }
}

// Fungsi untuk menghapus buku
function deleteBook(event) {
  const bookId = Number(event.target.id);
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event("bookChanged"));
  }
}

// Fungsi untuk menampilkan daftar buku
function displayBooks(bookList) {
  const incompleteBookshelfList = document.querySelector(
    "#incompleteBookshelfList"
  );
  const completeBookshelfList = document.querySelector(
    "#completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (const book of bookList) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");

    const bookTitle = document.createElement("h2");
    bookTitle.innerText = book.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Penulis: " + book.author;

    const bookYear = document.createElement("p");
    bookYear.innerText = "Tahun: " + book.year;

    bookItem.appendChild(bookTitle);
    bookItem.appendChild(bookAuthor);
    bookItem.appendChild(bookYear);

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");

    const readButton = document.createElement("button");
    readButton.id = book.id;
    readButton.innerText = book.isComplete
      ? "Belum Selesai dibaca"
      : "Selesai dibaca";
    readButton.classList.add("green");
    readButton.addEventListener(
      "click",
      book.isComplete ? markAsUnread : markAsRead
    );

    const deleteButton = document.createElement("button");
    deleteButton.id = book.id;
    deleteButton.innerText = "Hapus buku";
    deleteButton.classList.add("red");
    deleteButton.addEventListener("click", deleteBook);

    actionContainer.appendChild(readButton);
    actionContainer.appendChild(deleteButton);
    bookItem.appendChild(actionContainer);

    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  }
}

// Fungsi untuk menyimpan daftar buku ke localStorage
function saveBooksToLocalStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

// Event listener saat halaman dimuat
window.addEventListener("load", () => {
  // Mengambil daftar buku dari localStorage (jika ada)
  books = JSON.parse(localStorage.getItem("books")) || [];

  // Menampilkan daftar buku dan menambahkan event listener
  displayBooks(books);

  const inputBookForm = document.querySelector("#inputBook");
  const searchBookForm = document.querySelector("#searchBook");

  inputBookForm.addEventListener("submit", addBook);
  searchBookForm.addEventListener("submit", searchBook);
  document.addEventListener("bookChanged", () => {
    // Ketika ada perubahan pada daftar buku, simpan ke localStorage dan tampilkan ulang
    saveBooksToLocalStorage();
    displayBooks(books);
  });
});
