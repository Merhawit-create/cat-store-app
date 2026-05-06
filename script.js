const catList = document.getElementById("catList");
const searchInput = document.getElementById("searchInput");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");
const cartList = document.getElementById("cartList");
const orderForm = document.getElementById("orderForm");

let cats = [];
let filteredCats = [];
let cart = [];

let currentPage = 1;
const catsPerPage = 6;

async function fetchCats() {
    try {
        const response = await fetch("https://api.thecatapi.com/v1/breeds?limit=30");

        if (!response.ok) {
            throw new Error("Failed to fetch cats.");
        }

        cats = await response.json();
        filteredCats = cats;

        renderCats();
    } catch (error) {
        catList.innerHTML = `<p>${error.message}</p>`;
    }
}

function renderCats() {
    catList.innerHTML = "";

    const start = (currentPage - 1) * catsPerPage;
    const end = start + catsPerPage;
    const catsToShow = filteredCats.slice(start, end);

    if (catsToShow.length === 0) {
        catList.innerHTML = "<p>No cats found.</p>";
        updatePagination();
        return;
    }

    catsToShow.forEach(cat => {
        const card = document.createElement("article");
        card.classList.add("cat-card");

        card.innerHTML = `
      <h3>${cat.name}</h3>
      <p><strong>Origin:</strong> ${cat.origin || "Unknown"}</p>
      <p><strong>Temperament:</strong> ${cat.temperament || "No information"}</p>
      <p>${cat.description ? cat.description.substring(0, 120) + "..." : "No description available."}</p>
      <button onclick="addToCart('${cat.id}')">Add to cart</button>
    `;

        catList.appendChild(card);
    });

    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredCats.length / catsPerPage);

    pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();

    filteredCats = cats.filter(cat =>
        cat.name.toLowerCase().includes(searchText)
    );

    currentPage = 1;
    renderCats();
});

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderCats();
    }
});

nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredCats.length / catsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        renderCats();
    }
});

function addToCart(catId) {
    const cat = cats.find(cat => cat.id === catId);

    if (cat) {
        cart.push(cat);
        renderCart();
    }
}

function renderCart() {
    cartList.innerHTML = "";

    cart.forEach((cat, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
      ${cat.name}
      <button onclick="removeFromCart(${index})">Remove</button>
    `;

        cartList.appendChild(li);
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

orderForm.addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        alert("The shopping cart is empty.");
        return;
    }

    alert("Order submitted successfully!");

    cart = [];
    renderCart();
    orderForm.reset();
});

fetchCats();