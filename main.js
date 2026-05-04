let items = [];
let cart = [];
let myList = [];
let isAZ = true;

const container = document.getElementById("items-container");
const searchInput = document.getElementById("search");
const sortBtn = document.getElementById("sortBtn");
const cartIcon = document.getElementById("cartIcon");
const listIcon = document.getElementById("listIcon");

async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products/category/groceries");
    const data = await response.json();

    items = data.products;
    renderItems(items);
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

    div.querySelector(".cart-btn").addEventListener("click", () => {
      cart.push(item);
      updateCounts();
      alert(`${item.title} added to cart!`);
    });

    div.querySelector(".list-btn").addEventListener("click", () => {
      myList.push(item);
      updateCounts();
      alert(`${item.title} added to your list!`);
    });

    container.appendChild(div);
  });
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = items.filter(item =>
    item.title.toLowerCase().includes(value) ||
    item.description.toLowerCase().includes(value)
  );

  renderItems(filtered);
});

sortBtn.addEventListener("click", () => {
  const sorted = [...items].sort((a, b) => {
    return isAZ
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });

  renderItems(sorted);

  sortBtn.textContent = isAZ ? "Sort: Z → A" : "Sort: A → Z";
  isAZ = !isAZ;
});

cartIcon.addEventListener("click", () => {
  renderItems(cart);
});

listIcon.addEventListener("click", () => {
  renderItems(myList);
});

fetchProducts();
updateCounts();