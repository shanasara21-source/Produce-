let items = [];
let currentItems = [];
let cart = [];
let myList = [];
let isAZ = true;
let currentView = "home";

const container = document.getElementById("items-container");
const searchInput = document.getElementById("search");
const sortBtn = document.getElementById("sortBtn");
const cartIcon = document.getElementById("cartIcon");
const listIcon = document.getElementById("listIcon");
const homeBtn = document.getElementById("homeBtn");

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

function updateCounts() {
  cartIcon.textContent = `🛒 Cart (${cart.length})`;
  listIcon.textContent = `☰ My List (${myList.length})`;
}

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

      ${
        currentView === "home"
          ? `
            <button class="cart-btn">Add to Cart</button>
            <button class="list-btn">My List</button>
          `
          : `
            <label>
              Qty:
              <input class="qty-input" type="number" min="1" value="${item.qty || 1}">
            </label>
            <button class="remove-btn">Remove</button>
          `
      }
    `;

    if (currentView === "home") {
      div.querySelector(".cart-btn").addEventListener("click", () => {
        const existingItem = cart.find(product => product.id === item.id);

        if (existingItem) {
          existingItem.qty += 1;
        } else {
          cart.push({ ...item, qty: 1 });
        }

        updateCounts();
        alert(`${item.title} added to cart!`);
      });

      div.querySelector(".list-btn").addEventListener("click", () => {
        const existingItem = myList.find(product => product.id === item.id);

        if (existingItem) {
          existingItem.qty += 1;
        } else {
          myList.push({ ...item, qty: 1 });
        }

        updateCounts();
        alert(`${item.title} added to your list!`);
      });
    } else {
      div.querySelector(".qty-input").addEventListener("change", (e) => {
        item.qty = Number(e.target.value);
      });

      div.querySelector(".remove-btn").addEventListener("click", () => {
        if (currentView === "cart") {
          cart = cart.filter(product => product.id !== item.id);
          currentItems = cart;
        }

        if (currentView === "list") {
          myList = myList.filter(product => product.id !== item.id);
          currentItems = myList;
        }

        updateCounts();
        renderItems(currentItems);
      });
    }

    container.appendChild(div);
  });
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  currentView = "home";

  currentItems = items.filter(item =>
    item.title.toLowerCase().includes(value) ||
    item.description.toLowerCase().includes(value)
  );

  renderItems(currentItems);
});

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

cartIcon.addEventListener("click", () => {
  currentView = "cart";
  currentItems = cart;
  searchInput.value = "";
  renderItems(currentItems);
});

listIcon.addEventListener("click", () => {
  currentView = "list";
  currentItems = myList;
  searchInput.value = "";
  renderItems(currentItems);
});

homeBtn.addEventListener("click", () => {
  currentView = "home";
  currentItems = items;
  searchInput.value = "";
  renderItems(currentItems);
});

fetchProducts();
updateCounts();