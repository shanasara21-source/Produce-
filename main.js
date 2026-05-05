let items = [];
let currentItems = [];
let cart = [];
let myList = [];
let isAZ = true;

const container = document.getElementById("items-container");
const searchInput = document.getElementById("search");
const sortBtn = document.getElementById("sortBtn");
const cartIcon = document.getElementById("cartIcon");
const listIcon = document.getElementById("listIcon");

// 🔄 Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products/category/groceries");
    const data = await response.json();

    items = data.products;
    currentItems = items;

    renderItems(currentItems);
  } catch (error) {
    console.error("Error fetching data:", error);
    container.innerHTML = "<p>Failed to load grocery data.</p>";
  }
}

// 🔢 Update cart/list counts
function updateCounts() {
  cartIcon.textContent = `🛒 Cart (${cart.length})`;
  listIcon.textContent = `☰ My List (${myList.length})`;
}

// 🧱 Render items
function renderItems(list) {
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No items found.</p>";
    return;
  }

  list.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item");

    div.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <p><strong>Price:</strong> $${item.price}</p>
      <button class="cart-btn">Add to Cart</button>
      <button class="list-btn">My List</button>
    `;

    // ➕ Add to Cart
    div.querySelector(".cart-btn").addEventListener("click", () => {
      cart.push(item);
      updateCounts();
      alert(`${item.title} added to cart!`);
    });

    // 📌 Add to My List
    div.querySelector(".list-btn").addEventListener("click", () => {
      myList.push(item);
      updateCounts();
      alert(`${item.title} added to your list!`);
    });

    container.appendChild(div);
  });
}

// 🔍 Search
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  currentItems = items.filter(item =>
    item.title.toLowerCase().includes(value) ||
    item.description.toLowerCase().includes(value)
  );

  renderItems(currentItems);
});

// 🔤 Sort (A ↔ Z) — FIXED
sortBtn.addEventListener("click", () => {
  currentItems = [...currentItems].sort((a, b) => {
    return isAZ
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });

  renderItems(currentItems);

  sortBtn.textContent = isAZ ? "Sort: Z → A" : "Sort: A → Z";
  isAZ = !isAZ;
});

// 🛒 Show Cart
cartIcon.addEventListener("click", () => {
  currentItems = cart;
  renderItems(currentItems);
});

// 📋 Show My List
listIcon.addEventListener("click", () => {
  currentItems = myList;
  renderItems(currentItems);
});

// 🚀 Initialize
fetchProducts();
updateCounts();