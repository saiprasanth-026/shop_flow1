const products = [
  {
    id: 1,
    name: 'Classic Tee',
    price: 29,
    category: 'Fashion',
    rating: 4.8,
    badge: 'New',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Canvas Tote',
    price: 42,
    category: 'Accessories',
    rating: 4.7,
    badge: 'Popular',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Oak Lamp',
    price: 64,
    category: 'Home',
    rating: 4.9,
    badge: 'Best',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Carry Bottle',
    price: 18,
    category: 'Wellness',
    rating: 4.6,
    badge: 'Eco',
    image:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Sun Hat',
    price: 26,
    category: 'Fashion',
    rating: 4.5,
    badge: 'Summer',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Leather Wallet',
    price: 54,
    category: 'Accessories',
    rating: 4.9,
    badge: 'Top',
    image:
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 7,
    name: 'Cozy Throw',
    price: 38,
    category: 'Home',
    rating: 4.8,
    badge: 'Warm',
    image:
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 8,
    name: 'Yoga Mat',
    price: 33,
    category: 'Wellness',
    rating: 4.7,
    badge: 'Fresh',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
  },
];

function readSavedValue(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

const savedCart = readSavedValue('shopflow-cart', []);
const savedWishlist = readSavedValue('shopflow-wishlist', []);

const state = {
  selectedCategory: 'All',
  search: '',
  sort: 'featured',
  cart: Array.isArray(savedCart)
    ? savedCart.map((id) => products.find((product) => product.id === Number(id))).filter(Boolean)
    : [],
  wishlist: new Set(Array.isArray(savedWishlist) ? savedWishlist.map(Number) : []),
};

const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const subtotalValue = document.getElementById('subtotalValue');
const toast = document.getElementById('toast');
const cartPanel = document.getElementById('cartPanel');

const categoryButtons = [...document.querySelectorAll('.category-btn')];
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

function saveCart() {
  localStorage.setItem('shopflow-cart', JSON.stringify(state.cart.map((item) => item.id)));
}

function saveWishlist() {
  localStorage.setItem('shopflow-wishlist', JSON.stringify([...state.wishlist]));
}

function formatPrice(value) {
  return `$${value}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 1200);
}

function getFilteredProducts() {
  let filtered = [...products];

  if (state.selectedCategory !== 'All') {
    filtered = filtered.filter((item) => item.category === state.selectedCategory);
  }

  if (state.search.trim()) {
    const query = state.search.toLowerCase();
    filtered = filtered.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }

  if (state.sort === 'low-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sort === 'high-low') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return filtered;
}

function renderProducts() {
  const visibleProducts = getFilteredProducts();

  if (!visibleProducts.length) {
    productGrid.innerHTML = '<div class="empty-state">No products found for this search.</div>';
    return;
  }

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" />
            <span class="product-badge">${product.badge}</span>
            <button
              class="wishlist-btn ${state.wishlist.has(product.id) ? 'active' : ''}"
              type="button"
              data-id="${product.id}"
              aria-label="Toggle wishlist"
            >
              ${state.wishlist.has(product.id) ? '♥' : '♡'}
            </button>
          </div>
          <div class="product-info">
            <div class="product-topline">
              <h3>${product.name}</h3>
              <span class="rating">★ ${product.rating}</span>
            </div>
            <p class="product-category">${product.category}</p>
            <div class="product-row">
              <span class="product-price">${formatPrice(product.price)}</span>
              <button class="product-action" type="button" data-id="${product.id}">
                Add to cart
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join('');
}

function renderCart() {
  if (!state.cart.length) {
    cartItems.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
    cartCount.textContent = '0';
    subtotalValue.textContent = '$0';
    return;
  }

  cartItems.innerHTML = state.cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <h4>${item.name}</h4>
            <p>${item.category}</p>
            <strong>${formatPrice(item.price)}</strong>
          </div>
          <button type="button" data-remove-id="${item.id}">Remove</button>
        </div>
      `
    )
    .join('');

  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  cartCount.textContent = String(state.cart.length);
  subtotalValue.textContent = formatPrice(total);
}

function addToCart(id) {
  const selectedItem = products.find((product) => product.id === id);
  if (!selectedItem) return;

  state.cart.push(selectedItem);
  saveCart();
  renderCart();
  showToast(`${selectedItem.name} added to cart`);
}

function removeFromCart(id) {
  state.cart = state.cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
  showToast('Item removed from cart');
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.selectedCategory = button.dataset.category;
    categoryButtons.forEach((item) => item.classList.toggle('active', item === button));
    renderProducts();
  });
});

searchInput.addEventListener('input', (event) => {
  state.search = event.target.value;
  renderProducts();
});

sortSelect.addEventListener('change', (event) => {
  state.sort = event.target.value;
  renderProducts();
});

productGrid.addEventListener('click', (event) => {
  const actionButton = event.target.closest('.product-action');
  const wishlistButton = event.target.closest('.wishlist-btn');

  if (actionButton) {
    addToCart(Number(actionButton.dataset.id));
  }

  if (wishlistButton) {
    const id = Number(wishlistButton.dataset.id);
    if (state.wishlist.has(id)) {
      state.wishlist.delete(id);
      showToast('Removed from wishlist');
    } else {
      state.wishlist.add(id);
      showToast('Added to wishlist');
    }
    saveWishlist();
    renderProducts();
  }
});

cartItems.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-id]');
  if (!removeButton) return;

  removeFromCart(Number(removeButton.dataset.removeId));
});

document.getElementById('cartToggle').addEventListener('click', () => {
  cartPanel.classList.toggle('open');
});

document.getElementById('closeCart').addEventListener('click', () => {
  cartPanel.classList.remove('open');
});

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const button = document.getElementById('themeToggle');
  const isDarkMode = document.body.classList.contains('dark-mode');
  button.textContent = isDarkMode ? '☀️' : '🌙';
  localStorage.setItem('shopflow-theme', isDarkMode ? 'dark' : 'light');
});

if (readSavedValue('shopflow-theme', 'light') === 'dark') {
  document.body.classList.add('dark-mode');
  document.getElementById('themeToggle').textContent = '☀️';
}

document.querySelector('.checkout-btn').addEventListener('click', () => {
  showToast('Checkout is not connected in this static demo.');
});

document.getElementById('newsletterForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const emailInput = document.getElementById('emailInput');
  showToast('Newsletter sign-up is not connected in this static demo.');
  emailInput.value = '';
});

renderProducts();
renderCart();
