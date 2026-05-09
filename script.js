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
const catsPerPage = 10;

// Fetch cats from API
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


// Render cats
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
        const img = cat.reference_image_id
            ? `https://cdn2.thecatapi.com/images/${cat.reference_image_id}.jpg`
            : "https://placehold.co/300x200?text=No+Image";
        card.innerHTML = `
      <h3>${cat.name}</h3>
      <p><strong>Origin:</strong> ${cat.origin || "Unknown"}</p>
      
        <img
         class="cat-image"
         src="${img}" alt="${cat.name}"
          onerror="this.src='https://placehold.co/300x200?text=No+Image'" 
          >
      <p><strong>Temperament:</strong> ${cat.temperament || "No information"}</p>
      <p>${cat.description ? cat.description.substring(0, 120) + "..." : "No description available."}</p>
      <button onclick="addToCart('${cat.id}')">Add to cart</button>
    `;

        catList.appendChild(card);
    });

    updatePagination();
}
// Pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredCats.length / catsPerPage);

    pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}
// Search cats
if (searchInput) {
    searchInput.addEventListener("input", () => {
        const searchText = searchInput.value.toLowerCase();

        filteredCats = cats.filter(cat =>
            cat.name.toLowerCase().includes(searchText)
        );

        currentPage = 1;
        renderCats();
    });
}
// Previous page
if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderCats();
        }
    });
}

// Next page
if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredCats.length / catsPerPage);

        if (currentPage < totalPages) {
            currentPage++;
            renderCats();
        }
    });
}

// Add cat to shopping cart
function addToCart(catId) {
    const cat = cats.find(cat => cat.id === catId);
    
    if (cat) {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(cat);
        // Save cart in local storage
        localStorage.setItem("cart", JSON.stringify(cart));

        alert(`${cat.name} added to cart`);
    }
}

// Render shopping cart
function renderCart() {

    if (!cartList) return;

    // Load cart from local storage
    cart = JSON.parse(localStorage.getItem("cart")) || [];


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

// Remove cat from shopping cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}


// Submit order form
if (orderForm) {

    orderForm.addEventListener("submit", event => {

        event.preventDefault();
        
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;
        
        
        cart = JSON.parse(
            localStorage.getItem("cart")
        ) || [];

        if (cart.length === 0) {

            alert("The shopping cart is empty.");
          return;
        }

        const catNames = cart.map(cat => cat.name).join(", ");

        alert(
            `Order confirmed!\n\nName: ${name}\nEmail: ${email}\nAddress: ${address}\nCats: ${catNames}`
        );
        
        // Empty cart
        cart = [];

        // Remove cart from local storage
        localStorage.removeItem("cart");

        renderCart();

        orderForm.reset() 
    });
}

// Run only on cats page
if (catList) {
    fetchCats();
}
// Run only on shopping cart page
if (cartList) {
    renderCart();
}
