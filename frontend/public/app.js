/* ========================================
   DIU STARTUP – E-Commerce Homepage JS
   Full featured: Slider, Cart, Products,
   Timer, Tabs, Brands, Toast, Scroll
   NOTE: products.js must be loaded first
======================================== */

// ====== PRODUCT DATA (from products.js PRODUCTS_DB) ======
// Using PRODUCTS_DB from products.js as single source of truth
const PRODUCTS = typeof PRODUCTS_DB !== 'undefined' ? PRODUCTS_DB : [];

// Navigate to product detail page
function goToProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

// Flash sale uses all products with slight price changes
const FLASH_PRODUCTS = PRODUCTS.map(p => ({
  ...p,
  price: Math.round(p.price * 0.85),
  oldPrice: p.price,
  discount: Math.round(p.discount + 8),
  sold: Math.floor(Math.random() * 60) + 20,
  stock: 100,
}));

const BESTSELLERS = [
  { rank: 2, name: 'Sony WH-1000XM5', img: 'images/headphones.png', price: 29999, rating: 4.7 },
  { rank: 3, name: 'Smart Fitness Watch', img: 'images/watch.png', price: 14999, rating: 4.6 },
  { rank: 4, name: 'Samsung Galaxy S24', img: 'images/phone.png', price: 149999, rating: 4.9 },
  { rank: 5, name: 'Leather Shoulder Bag', img: 'images/bag.png', price: 3999, rating: 4.6 },
  { rank: 6, name: 'Air Boost Sneakers', img: 'images/sneakers.png', price: 6499, rating: 4.5 },
  { rank: 7, name: 'Luxe Perfume', img: 'images/perfume.png', price: 4500, rating: 4.7 },
];

// ====== CART STATE (localStorage backed) ======
function getCart() {
  try { return JSON.parse(localStorage.getItem('diu_startup_cart')) || []; }
  catch { return []; }
}
function saveCart(c) { localStorage.setItem('diu_startup_cart', JSON.stringify(c)); }
let cartOpen = false;

// ====== HERO SLIDER ======
let currentSlide = 0;
const totalSlides = 3;
let sliderInterval;

function goToSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function changeSlide(dir) {
  let next = currentSlide + dir;
  if (next >= totalSlides) next = 0;
  if (next < 0) next = totalSlides - 1;
  goToSlide(next);
}

function startSlider() {
  sliderInterval = setInterval(() => changeSlide(1), 5000);
}

// Pause on hover
document.addEventListener('DOMContentLoaded', () => {
  const sliderWrap = document.querySelector('.hero-slider-wrap');
  if (sliderWrap) {
    sliderWrap.addEventListener('mouseenter', () => clearInterval(sliderInterval));
    sliderWrap.addEventListener('mouseleave', startSlider);
  }
  startSlider();
});

// ====== CATEGORY MENU TOGGLE ======
let catMenuOpen = false;
function toggleCategoryMenu() {
  catMenuOpen = !catMenuOpen;
  const menu = document.getElementById('category-menu');
  const arrow = document.querySelector('.cat-arrow');
  menu.classList.toggle('open', catMenuOpen);
  if (arrow) arrow.style.transform = catMenuOpen ? 'rotate(180deg)' : '';
}

document.addEventListener('click', (e) => {
  const btn = document.getElementById('all-categories-btn');
  const menu = document.getElementById('category-menu');
  if (catMenuOpen && !btn.contains(e.target) && !menu.contains(e.target)) {
    catMenuOpen = false;
    menu.classList.remove('open');
    const arrow = document.querySelector('.cat-arrow');
    if (arrow) arrow.style.transform = '';
  }
});

// ====== CART TOGGLE ======
function toggleCart(e) {
  if (e) e.preventDefault();
  cartOpen = !cartOpen;
  document.getElementById('cart-sidebar').classList.toggle('open', cartOpen);
  document.getElementById('cart-overlay').classList.toggle('active', cartOpen);
  document.body.style.overflow = cartOpen ? 'hidden' : '';
}

// ====== ADD TO CART ======
function addToCart(name, price, img = 'images/phone.png', id = null) {
  const cart = getCart();
  const existing = cart.find(item => item.name === name);
  if (existing) existing.qty += 1;
  else cart.push({ id: id || Date.now(), name, price, img, qty: 1 });
  saveCart(cart);
  updateCart();
  showToast(`✅ ${name} added to cart!`);
}

function removeFromCart(name) {
  const cart = getCart().filter(item => item.name !== name);
  saveCart(cart);
  updateCart();
  showToast(`🗑️ Removed from cart`);
}

function changeQty(name, delta) {
  const cart = getCart();
  const item = cart.find(i => i.name === name);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) { saveCart(cart.filter(i => i.name !== name)); }
    else saveCart(cart);
    updateCart();
  }
}

function updateCart() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  document.getElementById('cart-badge').textContent = count;
  document.getElementById('cart-total').textContent = `৳${total.toLocaleString('en-IN')}`;
  // Sync mobile bottom nav cart badge
  const mobBadge = document.getElementById('mob-cart-badge');
  if (mobBadge) {
    mobBadge.textContent = count;
    mobBadge.style.display = count > 0 ? 'flex' : 'none';
  }

  const itemsEl = document.getElementById('cart-items');

  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    itemsEl.appendChild(createEmptyCart());
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" onerror="this.src='images/phone.png'" />
        <div class="cart-item-info">
          <div class="name">${item.name}</div>
          <div class="price">৳${item.price.toLocaleString('en-IN')}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty('${item.name}', -1)">−</button>
            <span class="qty-display">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
          </div>
        </div>
        <button class="remove-item" onclick="removeFromCart('${item.name}')"><i class="fas fa-trash"></i></button>
      </div>
    `).join('');
  }
}

function createEmptyCart() {
  const div = document.createElement('div');
  div.className = 'cart-empty';
  div.innerHTML = `
    <i class="fas fa-shopping-cart"></i>
    <p>Your cart is empty</p>
    <span>Add some products to get started!</span>
  `;
  return div;
}

// ====== TOAST NOTIFICATION ======
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ====== COUNTDOWN TIMER ======
let endTime = new Date().getTime() + (8 * 3600 + 45 * 60 + 30) * 1000;

function updateCountdown() {
  const now = new Date().getTime();
  const diff = endTime - now;
  if (diff <= 0) {
    endTime = new Date().getTime() + 24 * 3600 * 1000; // Reset to 24h
    return;
  }
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = n => String(n).padStart(2, '0');

  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  if (hoursEl) hoursEl.textContent = pad(h);
  if (minutesEl) minutesEl.textContent = pad(m);
  if (secondsEl) secondsEl.textContent = pad(s);
}
setInterval(updateCountdown, 1000);
updateCountdown();

// ====== BUILD PRODUCT CARD ======
function buildProductCard(p) {
  return `
    <div class="product-card" onclick="goToProduct(${p.id})" style="cursor:pointer">
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='images/phone.png'" />
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        ${p.isNew ? `<span class="product-badge new-badge" style="top:${p.badge ? '38px' : '10px'}">NEW</span>` : ''}
        <button class="wishlist-btn" onclick="event.stopPropagation(); addWishlist('${p.name}')">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="stars">
          ${getStarHTML(p.rating)}
          <span>(${p.reviews.toLocaleString()})</span>
        </div>
        <div class="product-price">
          <span class="price-now">৳${p.price.toLocaleString('en-IN')}</span>
          ${p.oldPrice ? `<span class="price-old">৳${p.oldPrice.toLocaleString('en-IN')}</span>` : ''}
          ${p.discount ? `<span class="discount-badge">-${p.discount}%</span>` : ''}
        </div>
        <button class="add-cart-btn" onclick="event.stopPropagation(); addToCart('${p.name}', ${p.price}, '${p.img}', ${p.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
}

function buildFlashCard(p) {
  return `
    <div class="product-card" onclick="goToProduct(${p.id})" style="cursor:pointer">
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='images/phone.png'" />
        <span class="product-badge">-${p.discount}%</span>
        <button class="wishlist-btn" onclick="event.stopPropagation(); addWishlist('${p.name}')">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="stars">${getStarHTML(p.rating)} <span>(${p.reviews.toLocaleString()})</span></div>
        <div class="product-price">
          <span class="price-now">৳${p.price.toLocaleString('en-IN')}</span>
          <span class="price-old">৳${p.oldPrice.toLocaleString('en-IN')}</span>
        </div>
        <div class="flash-progress">
          <div class="progress-label">🔥 ${p.sold}% sold</div>
          <div class="progress-bar"><div class="progress-fill" style="width:${p.sold}%"></div></div>
        </div>
        <button class="add-cart-btn" style="margin-top:8px" onclick="event.stopPropagation(); addToCart('${p.name}', ${p.price}, '${p.img}', ${p.id})">
          <i class="fas fa-bolt"></i> Buy Now
        </button>
      </div>
    </div>
  `;
}

function getStarHTML(rating) {
  let html = '';
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
  if (half) html += '<i class="fas fa-star-half-alt"></i>';
  return html;
}

// ====== RENDER SECTIONS ======

// Flash Sale
function renderFlashProducts() {
  const el = document.getElementById('flash-products');
  if (!el) return;
  el.innerHTML = FLASH_PRODUCTS.map(buildFlashCard).join('');
}

// Featured Products
let currentFilter = 'all';
function filterFeatured(category, btn) {
  currentFilter = category;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderFeaturedProducts();
}

function renderFeaturedProducts() {
  const el = document.getElementById('featured-grid');
  if (!el) return;
  const filtered = currentFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === currentFilter);
  el.innerHTML = filtered.map(buildProductCard).join('');
}

// Best Sellers List
function renderBestSellers() {
  const el = document.getElementById('bestsellers-list');
  if (!el) return;
  el.innerHTML = BESTSELLERS.map(b => `
    <div class="bs-list-item" onclick="addToCart('${b.name}', ${b.price}, '${b.img}')">
      <span class="bs-rank">#${b.rank}</span>
      <img class="bs-img" src="${b.img}" alt="${b.name}" onerror="this.src='images/phone.png'" />
      <div class="bs-info">
        <div class="bs-name">${b.name}</div>
        <div class="stars">${getStarHTML(b.rating)}</div>
        <div class="product-price"><span class="price-now">৳${b.price.toLocaleString('en-IN')}</span></div>
      </div>
    </div>
  `).join('');
}

// New Arrivals – display as wider grid
function renderNewArrivals() {
  const el = document.getElementById('new-arrivals-grid');
  if (!el) return;
  const newProds = PRODUCTS.filter(p => p.isNew).concat(PRODUCTS.slice(0, 4));
  el.innerHTML = newProds.slice(0, 8).map(buildProductCard).join('');
}

// Trending Products
function renderTrending() {
  const el = document.getElementById('trending-products-list');
  if (!el) return;
  const trending = [...PRODUCTS].reverse();
  el.innerHTML = trending.map(buildProductCard).join('');
}

// ====== WISHLIST ======
let wishCount = 0;
function addWishlist(name) {
  wishCount++;
  document.getElementById('wishlist-badge').textContent = wishCount;
  showToast(`❤️ ${name} added to wishlist!`);
}

// ====== NEWSLETTER ======
function subscribeNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('newsletter-email').value;
  showToast(`🎉 Subscribed! Welcome to DIU Startup family!`);
  document.getElementById('newsletter-email').value = '';
}

// ====== SCROLL TO TOP ======
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== CATEGORY SEE ALL TOGGLE (Mobile) ======
function toggleCategoryExpand(btn) {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;
  const isExpanded = grid.classList.toggle('cat-expanded');
  const icon = document.getElementById('cat-see-all-icon');
  if (isExpanded) {
    btn.innerHTML = 'See Less <i class="fas fa-chevron-up" id="cat-see-all-icon"></i>';
  } else {
    btn.innerHTML = 'See All <i class="fas fa-chevron-down" id="cat-see-all-icon"></i>';
    // Smooth scroll back to categories section
    const section = document.getElementById('categories-section');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

window.addEventListener('scroll', () => {
  const btn = document.getElementById('scroll-top-btn');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);

  // Sticky header shadow
  const header = document.getElementById('main-header');
  if (header) header.classList.toggle('scrolled', window.scrollY > 60);
});

// ====== SEARCH ======
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-button');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim();
        if (q) showToast(`🔍 Searching for "${q}"...`);
      }
    });
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const q = searchInput ? searchInput.value.trim() : '';
      if (q) showToast(`🔍 Searching for "${q}"...`);
    });
  }
});

// ====== SCROLL ANIMATION (Intersection Observer) ======
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = '0s';
      entry.target.classList.add('fade-in-up');
    }
  });
}, { threshold: 0.1 });

// ====== INITIALIZE ======
document.addEventListener('DOMContentLoaded', () => {
  renderFlashProducts();
  renderFeaturedProducts();
  renderBestSellers();
  renderNewArrivals();
  renderTrending();

  // Observe sections for fade-in
  document.querySelectorAll('.section').forEach(el => observer.observe(el));

  // Animate product cards on load
  setTimeout(() => {
    document.querySelectorAll('.product-card').forEach((card, i) => {
      card.style.animationDelay = `${i * 0.05}s`;
      card.classList.add('fade-in-up');
    });
  }, 100);

  // Nav active link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Category card click
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = card.querySelector('span').textContent;
      showToast(`🛍️ Browsing ${cat}...`);
    });
  });

  // Update cart on load & init mob badge visibility
  updateCart();
  const mobBadge = document.getElementById('mob-cart-badge');
  const initCount = getCart().reduce((s,i) => s + i.qty, 0);
  if (mobBadge) mobBadge.style.display = initCount > 0 ? 'flex' : 'none';

  console.log('%c🚀 DIU Startup E-Commerce Loaded!', 'color:#f57224;font-size:18px;font-weight:bold;');
});

// ====== MOBILE DRAWER ======
function openMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  if (!drawer || !overlay) return;
  drawer.classList.add('open');
  overlay.style.display = 'block';
  setTimeout(() => overlay.classList.add('active'), 10);
  document.body.style.overflow = 'hidden';
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  if (!drawer || !overlay) return;
  drawer.classList.remove('open');
  overlay.classList.remove('active');
  setTimeout(() => { overlay.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
}

// Close drawer on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMobileDrawer();
    if (cartOpen) toggleCart(null);
  }
});
