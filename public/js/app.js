document
  .getElementById("filterForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const params = new URLSearchParams(formData).toString();

    fetch(`/books/filter?${params}`)
      .then((response) => response.json())
      .then((data) => {
        const tbody = document.querySelector("#bookList tbody");
        tbody.innerHTML = "";
        data.forEach((book) => {
          const row = `
            <tr>
              <td>${book.title}</td>
              <td>${book.author}</td>
              <td>${book.genre}</td>
              <td>${book.publication_date}</td>
              <td>${book.isbn}</td>
            </tr>
          `;
          tbody.insertAdjacentHTML("beforeend", row);
        });
      });
  });
