/* ==========================================
   DIU STARTUP – Product Detail Page JS
   Full interactivity: Gallery, Cart,
   Reviews, Q&A, Related Products, etc.
========================================== */

// ====== STATE ======
let currentProduct = null;
let selectedQty = 1;
let selectedColorIdx = 0;
let selectedSizeIdx = 0;
let reviewStarSelected = 0;
let cartOpen = false;

// ====== GET PRODUCT FROM URL ======
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id')) || 1;
}

// ====== INIT PAGE ======
document.addEventListener('DOMContentLoaded', () => {
  const id = getProductId();
  currentProduct = PRODUCTS_DB.find(p => p.id === id) || PRODUCTS_DB[0];
  renderProductPage(currentProduct);
  renderRelatedProducts(currentProduct);
  renderRecentlyViewed(currentProduct);
  saveToRecentlyViewed(currentProduct);
  updateCartBadge();

  // Scroll listener for sticky bar
  window.addEventListener('scroll', handleScroll);

  // Sync cart from localStorage
  renderCartSidebar();
});

// ====== RENDER FULL PAGE ======
function renderProductPage(p) {
  // Page title & meta
  document.getElementById('page-title').textContent = `${p.name} – DIU Startup`;
  document.getElementById('page-meta-desc').setAttribute('content', p.description?.slice(0, 160));

  // Breadcrumb
  document.getElementById('bc-category').textContent = p.subcategory || p.category;
  document.getElementById('bc-product').textContent = p.name;

  // Gallery
  renderGallery(p);

  // Brand
  document.getElementById('pd-brand').innerHTML = `<i class="fas fa-tag"></i> ${p.brand}`;

  // Title
  document.getElementById('pd-title').textContent = p.name;

  // Rating
  document.getElementById('pd-stars').innerHTML = getStarHTML(p.rating);
  document.getElementById('pd-rating-num').textContent = p.rating.toFixed(1);
  document.getElementById('pd-review-count').textContent = `${p.reviews.toLocaleString()} reviews`;
  document.getElementById('pd-sold').textContent = `${p.sold.toLocaleString()} sold`;
  const stockEl = document.getElementById('pd-stock');
  stockEl.textContent = p.stock > 20 ? 'In Stock' : p.stock > 0 ? `Only ${p.stock} left!` : 'Out of Stock';
  stockEl.style.color = p.stock > 20 ? 'var(--success)' : p.stock > 0 ? '#ff9800' : 'var(--accent)';

  // Price
  document.getElementById('pd-price-now').textContent = `৳${p.price.toLocaleString('en-IN')}`;
  document.getElementById('pd-price-old').textContent = p.oldPrice ? `৳${p.oldPrice.toLocaleString('en-IN')}` : '';
  document.getElementById('pd-discount-tag').textContent = p.discount ? `-${p.discount}%` : '';
  const savings = p.oldPrice - p.price;
  document.getElementById('pd-savings').textContent = savings > 0
    ? `You save ৳${savings.toLocaleString('en-IN')} on this product!`
    : '';

  // Sticky bar price
  document.getElementById('pd-sticky-price').textContent = `৳${p.price.toLocaleString('en-IN')}`;

  // Highlights
  const hlList = document.getElementById('pd-highlights-list');
  if (p.highlights) {
    hlList.innerHTML = p.highlights.map(h => `<li>${h}</li>`).join('');
  }

  // Colors
  renderColorOptions(p);

  // Sizes / Storage
  renderSizeOptions(p);

  // Qty max
  document.getElementById('pd-qty-max').textContent = p.stock > 0 ? `(Max: ${Math.min(p.stock, 10)} pcs)` : '';

  // Description
  document.getElementById('pd-description').textContent = p.description;

  // Specs table
  renderSpecsTable(p.specs);

  // Reviews
  document.getElementById('tab-review-count').textContent = p.reviews.toLocaleString();
  renderReviewSummary(p);
  renderReviews(p);

  // Q&A
  renderQnA(p);

  // Seller
  const initials = p.seller?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  document.getElementById('pd-seller-avatar').textContent = initials;
  document.getElementById('pd-seller-name').textContent = p.seller;
  const sellerRating = document.getElementById('pd-seller-rating');
  sellerRating.innerHTML = `${getStarHTML(p.sellerRating)} <span style="color:var(--gray-600);margin-left:4px">${p.sellerRating}</span>`;

  // Price Summary
  updatePriceSummary();

  // Delivery info
  document.getElementById('pd-delivery-time').textContent = p.deliveryTime || '2-3 Days';
  document.getElementById('pd-return-policy').textContent = p.returnPolicy || '7 Days';
  document.getElementById('pd-warranty').textContent = p.warranty || '1 Year';

  // Product badges
  const badgesEl = document.getElementById('pd-badges');
  badgesEl.innerHTML = '';
  if (p.isNew) badgesEl.innerHTML += `<span class="product-badge new-badge">NEW</span>`;
  if (p.discount) badgesEl.innerHTML += `<span class="product-badge" style="top:${p.isNew ? '38px' : '0'}">${p.discount}% OFF</span>`;
}

// ====== GALLERY ======
function renderGallery(p) {
  const mainImg = document.getElementById('pd-main-img');
  mainImg.src = p.images?.[0] || p.img;
  mainImg.alt = p.name;

  const thumbsEl = document.getElementById('pd-thumbnails');
  const imgs = p.images?.length ? p.images : [p.img, p.img, p.img];
  thumbsEl.innerHTML = imgs.map((src, i) => `
    <div class="pd-thumb ${i === 0 ? 'active' : ''}" id="thumb-${i}" onclick="switchImage('${src}', ${i})">
      <img src="${src}" alt="${p.name} image ${i + 1}" onerror="this.src='${p.img}'" />
    </div>
  `).join('');

  // Zoom on hover
  const wrap = document.getElementById('pd-main-img-wrap');
  wrap.addEventListener('mousemove', handleZoom);
  wrap.addEventListener('mouseleave', resetZoom);
}

function switchImage(src, idx) {
  document.getElementById('pd-main-img').src = src;
  document.querySelectorAll('.pd-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
}

function handleZoom(e) {
  const wrap = e.currentTarget;
  const img = document.getElementById('pd-main-img');
  const rect = wrap.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  img.style.transformOrigin = `${x}% ${y}%`;
  img.style.transform = 'scale(2)';
}

function resetZoom() {
  const img = document.getElementById('pd-main-img');
  img.style.transform = 'scale(1)';
  img.style.transformOrigin = 'center center';
}

// ====== COLOR OPTIONS ======
function renderColorOptions(p) {
  const group = document.getElementById('pd-color-group');
  const optionsEl = document.getElementById('pd-color-options');
  const selectedEl = document.getElementById('pd-selected-color');

  if (!p.colors || p.colors.length === 0) {
    group.style.display = 'none';
    return;
  }
  group.style.display = 'block';
  selectedEl.textContent = p.colors[0];

  optionsEl.innerHTML = p.colors.map((color, i) => `
    <div class="pd-color-swatch ${i === 0 ? 'active' : ''}"
         style="background:${p.colorCodes?.[i] || '#ccc'}"
         title="${color}"
         onclick="selectColor(${i}, '${color}')">
    </div>
  `).join('');
}

function selectColor(idx, name) {
  selectedColorIdx = idx;
  document.getElementById('pd-selected-color').textContent = name;
  document.querySelectorAll('.pd-color-swatch').forEach((s, i) => {
    s.classList.toggle('active', i === idx);
  });
}

// ====== SIZE OPTIONS ======
function renderSizeOptions(p) {
  const group = document.getElementById('pd-size-group');
  const label = document.getElementById('pd-size-label');
  const optionsEl = document.getElementById('pd-size-options');

  const items = p.storage || p.sizes;
  if (!items || items.length === 0) {
    group.style.display = 'none';
    return;
  }
  group.style.display = 'block';
  label.textContent = p.storage ? 'Storage:' : 'Size:';

  optionsEl.innerHTML = items.map((item, i) => `
    <button class="pd-size-btn ${i === 0 ? 'active' : ''}" onclick="selectSize(${i}, this)">
      ${item}
    </button>
  `).join('');
}

function selectSize(idx, btn) {
  selectedSizeIdx = idx;
  document.querySelectorAll('.pd-size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ====== QUANTITY ======
function changeQty(delta) {
  const max = Math.min(currentProduct.stock, 10);
  selectedQty = Math.max(1, Math.min(max, selectedQty + delta));
  document.getElementById('pd-qty-display').textContent = selectedQty;
  updatePriceSummary();
}

// ====== PRICE SUMMARY UPDATE ======
function updatePriceSummary() {
  if (!currentProduct) return;
  const total = currentProduct.price * selectedQty;
  const savings = currentProduct.oldPrice ? (currentProduct.oldPrice - currentProduct.price) * selectedQty : 0;

  document.getElementById('summary-price').textContent = `৳${(currentProduct.price * selectedQty).toLocaleString('en-IN')}`;
  document.getElementById('summary-discount').textContent = savings > 0 ? `–৳${savings.toLocaleString('en-IN')}` : '–৳0';
  document.getElementById('summary-total').textContent = `৳${total.toLocaleString('en-IN')}`;
}

// ====== CART FUNCTIONS ======
function pdAddToCart() {
  const cartEntry = {
    id: currentProduct.id,
    name: currentProduct.name,
    price: currentProduct.price,
    img: currentProduct.img,
    qty: selectedQty,
  };
  const cart = getCart();
  const existing = cart.find(i => i.id === cartEntry.id);
  if (existing) existing.qty += selectedQty;
  else cart.push(cartEntry);
  saveCart(cart);
  updateCartBadge();
  renderCartSidebar();
  showToast(`✅ ${currentProduct.name} (x${selectedQty}) added to cart!`);

  // Animate button
  const btn = document.getElementById('pd-add-cart-btn');
  btn.innerHTML = '<i class="fas fa-check"></i> Added!';
  btn.style.background = 'var(--success)';
  btn.style.borderColor = 'var(--success)';
  btn.style.color = 'white';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
    btn.style.background = '';
    btn.style.borderColor = '';
    btn.style.color = '';
  }, 2000);
}

function pdBuyNow() {
  pdAddToCart();
  setTimeout(() => {
    toggleCart({ preventDefault: () => {} });
  }, 500);
}

function getCart() {
  try { return JSON.parse(localStorage.getItem('diu_startup_cart')) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('diu_startup_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) badge.textContent = total;
}

function renderCartSidebar() {
  const cart = getCart();
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');

  if (!itemsEl) return;

  const grandTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (totalEl) totalEl.textContent = `৳${grandTotal.toLocaleString('en-IN')}`;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-cart"></i>
        <p>Your cart is empty</p>
        <span>Add some products to get started!</span>
      </div>`;
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" onerror="this.src='images/phone.png'" />
      <div class="cart-item-info">
        <div class="name">${item.name}</div>
        <div class="price">৳${item.price.toLocaleString('en-IN')}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="cartChangeQty(${item.id}, -1)">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="cartChangeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="cartRemove(${item.id})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');
}

function cartChangeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) cartRemove(id);
    else { saveCart(cart); renderCartSidebar(); updateCartBadge(); }
  }
}

function cartRemove(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCartSidebar();
  updateCartBadge();
  showToast('🗑️ Removed from cart');
}

function toggleCart(e) {
  if (e && e.preventDefault) e.preventDefault();
  cartOpen = !cartOpen;
  document.getElementById('cart-sidebar').classList.toggle('open', cartOpen);
  document.getElementById('cart-overlay').classList.toggle('active', cartOpen);
  document.body.style.overflow = cartOpen ? 'hidden' : '';
}

// ====== SPECS TABLE ======
function renderSpecsTable(specs) {
  const table = document.getElementById('pd-specs-table');
  if (!specs || !table) return;
  table.innerHTML = Object.entries(specs).map(([key, val]) => `
    <tr>
      <td>${key}</td>
      <td>${val}</td>
    </tr>
  `).join('');
}

// ====== TABS ======
function switchTab(name, btn) {
  document.querySelectorAll('.pd-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.pd-tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(`panel-${name}`).classList.add('active');
}

// ====== REVIEWS ======
const DUMMY_REVIEWS = [
  { name: 'Rahim Uddin', rating: 5, date: '15 Jun 2024', text: 'Absolutely love this product! Quality is outstanding, packaging was perfect, and delivery was super fast. Highly recommend to anyone looking for a premium experience.', color: '#e53935', verified: true, helpful: 42 },
  { name: 'Fatima Khatun', rating: 4, date: '10 Jun 2024', text: 'Great value for money. The product works exactly as described. The build quality is solid and I\'ve been using it daily without any issues. Minor note: could have better documentation.', color: '#8e24aa', verified: true, helpful: 28 },
  { name: 'Arif Hossain', rating: 5, date: '5 Jun 2024', text: 'Exceeded my expectations! This is genuinely one of the best purchases I\'ve made on DIU Startup. The seller was responsive and shipping was within 2 days. ⭐⭐⭐⭐⭐', color: '#1976d2', verified: true, helpful: 35 },
  { name: 'Mitu Akter', rating: 4, date: '28 May 2024', text: 'Really good quality! I was a bit skeptical at first but after using it for 2 weeks I can confirm it\'s genuinely good. Definitely buying again.', color: '#00897b', verified: false, helpful: 19 },
  { name: 'Sabbir Ahmed', rating: 3, date: '20 May 2024', text: 'Product is good but delivery took longer than expected. The quality is decent but the packaging could be improved. Overall okay for the price.', color: '#f57c00', verified: true, helpful: 7 },
];

function renderReviewSummary(p) {
  const el = document.getElementById('pd-rating-summary');
  if (!el) return;
  const dist = [75, 15, 5, 3, 2]; // % for 5,4,3,2,1 stars

  el.innerHTML = `
    <div class="pd-rating-big">${p.rating.toFixed(1)}</div>
    <div class="pd-rating-stars">${getStarHTML(p.rating)}</div>
    <div class="pd-rating-label">Based on ${p.reviews.toLocaleString()} reviews</div>
    ${[5,4,3,2,1].map((star, i) => `
      <div class="pd-rating-bar-row">
        <span>${star}★</span>
        <div class="pd-bar-wrap"><div class="pd-bar-fill" style="width:${dist[i]}%"></div></div>
        <span>${dist[i]}%</span>
      </div>
    `).join('')}
  `;
}

function renderReviews(p) {
  const el = document.getElementById('pd-review-list');
  if (!el) return;
  el.innerHTML = DUMMY_REVIEWS.map(r => `
    <div class="pd-review-item">
      <div class="pd-review-header">
        <div class="pd-reviewer-avatar" style="background:${r.color}">${r.name[0]}</div>
        <div>
          <div class="pd-reviewer-name">${r.name}</div>
          <div class="pd-review-date">${r.date}</div>
        </div>
        <div class="pd-review-stars" style="margin-left:auto">${getStarHTML(r.rating)}</div>
      </div>
      <div class="pd-review-text">${r.text}</div>
      ${r.verified ? `<div class="pd-review-verified"><i class="fas fa-check-circle"></i> Verified Purchase</div>` : ''}
      <div class="pd-review-helpful">Was this helpful? <a href="#" onclick="reviewHelpful(event)" style="color:var(--primary)">Yes (${r.helpful})</a> · <a href="#" onclick="reviewHelpful(event)" style="color:var(--gray-400)">No</a></div>
    </div>
  `).join('');
}

function reviewHelpful(e) {
  e.preventDefault();
  showToast('👍 Feedback recorded!');
}

function setReviewStar(val) {
  reviewStarSelected = val;
  document.querySelectorAll('.star-select i').forEach((star, i) => {
    star.className = i < val ? 'fas fa-star' : 'far fa-star';
    star.style.color = i < val ? 'var(--warning)' : 'var(--gray-300)';
  });
}

function submitReview() {
  const text = document.getElementById('review-text').value.trim();
  const name = document.getElementById('review-name').value.trim();
  if (!reviewStarSelected) { showToast('⚠️ Please select a star rating!'); return; }
  if (!text) { showToast('⚠️ Please write your review!'); return; }
  if (!name) { showToast('⚠️ Please enter your name!'); return; }

  // Add to review list
  const reviewList = document.getElementById('pd-review-list');
  const colors = ['#e53935','#8e24aa','#1976d2','#00897b','#f57c00'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const now = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });

  const newReview = document.createElement('div');
  newReview.className = 'pd-review-item';
  newReview.style.background = '#f0fff4';
  newReview.innerHTML = `
    <div class="pd-review-header">
      <div class="pd-reviewer-avatar" style="background:${color}">${name[0].toUpperCase()}</div>
      <div>
        <div class="pd-reviewer-name">${name}</div>
        <div class="pd-review-date">${now}</div>
      </div>
      <div class="pd-review-stars" style="margin-left:auto">${getStarHTML(reviewStarSelected)}</div>
    </div>
    <div class="pd-review-text">${text}</div>
    <div class="pd-review-verified"><i class="fas fa-check-circle"></i> Just Posted</div>
  `;
  reviewList.insertBefore(newReview, reviewList.firstChild);

  // Reset form
  document.getElementById('review-text').value = '';
  document.getElementById('review-name').value = '';
  setReviewStar(0);
  showToast('🎉 Review submitted successfully!');
}

// ====== Q&A ======
const DUMMY_QNA = [
  { q: 'Does it come with a warranty?', a: 'Yes! This product comes with full official warranty as mentioned in the specifications.', asker: 'Karim', date: '12 Jun 2024', seller: true },
  { q: 'Is cash on delivery available?', a: 'Yes, we offer Cash on Delivery (COD) across all 64 districts of Bangladesh.', asker: 'Rima', date: '8 Jun 2024', seller: true },
  { q: 'Can I return the product if I don\'t like it?', a: 'Yes! We have a 7-day easy return policy. Please make sure the product is unused and in original packaging.', asker: 'Syed', date: '1 Jun 2024', seller: true },
];

function renderQnA(p) {
  const el = document.getElementById('pd-qna-list');
  if (!el) return;
  el.innerHTML = DUMMY_QNA.map(qa => `
    <div class="pd-qna-item">
      <div class="pd-qna-q">
        <div class="pd-qna-badge q-badge">Q</div>
        <div>
          <div class="pd-qna-text">${qa.q}</div>
          <div class="pd-qna-meta">Asked by ${qa.asker} · ${qa.date}</div>
        </div>
      </div>
      <div class="pd-qna-a">
        <div class="pd-qna-badge a-badge">A</div>
        <div>
          <div class="pd-qna-text">${qa.a}</div>
          <div class="pd-qna-meta" style="color:var(--primary)">Answered by ${qa.seller ? 'Seller' : 'Community'}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function submitQnA() {
  const q = document.getElementById('qna-question').value.trim();
  if (!q) { showToast('⚠️ Please type your question!'); return; }
  const el = document.getElementById('pd-qna-list');
  const now = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
  const newQa = document.createElement('div');
  newQa.className = 'pd-qna-item';
  newQa.style.background = '#f0f4ff';
  newQa.innerHTML = `
    <div class="pd-qna-q">
      <div class="pd-qna-badge q-badge">Q</div>
      <div>
        <div class="pd-qna-text">${q}</div>
        <div class="pd-qna-meta">Asked by You · ${now}</div>
      </div>
    </div>
    <div class="pd-qna-a">
      <div class="pd-qna-badge a-badge">A</div>
      <div>
        <div class="pd-qna-text" style="color:var(--gray-400)">⏳ Awaiting seller response...</div>
      </div>
    </div>
  `;
  el.insertBefore(newQa, el.firstChild);
  document.getElementById('qna-question').value = '';
  showToast('✅ Question submitted! Seller will respond soon.');
}

// ====== RELATED PRODUCTS ======
function renderRelatedProducts(p) {
  const el = document.getElementById('related-products-grid');
  if (!el) return;
  const related = PRODUCTS_DB
    .filter(prod => prod.id !== p.id && (prod.category === p.category || prod.subcategory === p.subcategory))
    .slice(0, 5);

  // If not enough, fill with random
  if (related.length < 4) {
    const extra = PRODUCTS_DB.filter(prod => prod.id !== p.id && !related.includes(prod));
    while (related.length < 4 && extra.length) {
      related.push(extra.shift());
    }
  }

  el.innerHTML = related.map(prod => buildProductCard(prod)).join('');
}

// ====== RECENTLY VIEWED ======
const RECENTLY_VIEWED_KEY = 'diu_recently_viewed';

function saveToRecentlyViewed(p) {
  try {
    let rv = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
    rv = rv.filter(i => i.id !== p.id);
    rv.unshift({ id: p.id, name: p.name, img: p.img, price: p.price, rating: p.rating });
    rv = rv.slice(0, 10);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(rv));
  } catch(e) {}
}

function renderRecentlyViewed(currentP) {
  const el = document.getElementById('recently-viewed-grid');
  const section = document.getElementById('recently-viewed-section');
  if (!el) return;
  try {
    const rv = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
    const filtered = rv.filter(i => i.id !== currentP.id);
    if (filtered.length === 0) {
      section.style.display = 'none';
      return;
    }
    el.innerHTML = filtered.map(item => {
      const full = PRODUCTS_DB.find(p => p.id === item.id);
      return full ? buildProductCard(full) : '';
    }).join('');
  } catch(e) {
    section.style.display = 'none';
  }
}

// ====== PRODUCT CARD BUILDER ======
function buildProductCard(p) {
  return `
    <div class="product-card" onclick="goToProduct(${p.id})">
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='images/phone.png'" />
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        ${p.isNew ? `<span class="product-badge new-badge" style="top:${p.badge ? '34px' : '10px'}">NEW</span>` : ''}
        <button class="wishlist-btn" onclick="event.stopPropagation(); showToast('❤️ Added to wishlist!')">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="stars">
          ${getStarHTML(p.rating)}
          <span>(${p.reviews?.toLocaleString() || 0})</span>
        </div>
        <div class="product-price">
          <span class="price-now">৳${p.price.toLocaleString('en-IN')}</span>
          ${p.oldPrice ? `<span class="price-old">৳${p.oldPrice.toLocaleString('en-IN')}</span>` : ''}
          ${p.discount ? `<span class="discount-badge">-${p.discount}%</span>` : ''}
        </div>
        <button class="add-cart-btn" onclick="event.stopPropagation(); cartQuickAdd(${p.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
}

function cartQuickAdd(id) {
  const p = PRODUCTS_DB.find(prod => prod.id === id);
  if (!p) return;
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty: 1 });
  saveCart(cart);
  updateCartBadge();
  renderCartSidebar();
  showToast(`✅ ${p.name} added to cart!`);
}

function goToProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

// ====== STAR HTML ======
function getStarHTML(rating) {
  let html = '';
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
  if (half) html += '<i class="fas fa-star-half-alt"></i>';
  const empty = 5 - full - (half ? 1 : 0);
  for (let i = 0; i < empty; i++) html += '<i class="far fa-star" style="color:var(--gray-300)"></i>';
  return html;
}

// ====== WISHLIST ======
let wishlisted = false;
function toggleWishlist() {
  wishlisted = !wishlisted;
  const icon = document.getElementById('wishlist-icon');
  const btn = document.getElementById('pd-wishlist-btn');
  if (wishlisted) {
    icon.className = 'fas fa-heart';
    icon.style.color = 'var(--accent)';
    btn.classList.add('active');
    showToast('❤️ Added to Wishlist!');
  } else {
    icon.className = 'far fa-heart';
    icon.style.color = '';
    btn.classList.remove('active');
    showToast('💔 Removed from Wishlist');
  }
}

function shareProduct() {
  if (navigator.share) {
    navigator.share({ title: currentProduct?.name, url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    showToast('🔗 Link copied to clipboard!');
  }
}

function compareProduct() {
  showToast('⚖️ Added to compare list!');
}

// ====== SCROLL HANDLER ======
let stickyBarShown = false;
function handleScroll() {
  const scrollY = window.scrollY;

  // Sticky bottom bar
  const stickyBar = document.getElementById('pd-sticky-bar');
  if (stickyBar) {
    const infoEl = document.getElementById('pd-info');
    if (infoEl) {
      const infoBottom = infoEl.getBoundingClientRect().bottom;
      stickyBar.classList.toggle('visible', infoBottom < 0);
    }
  }

  // Scroll to top button
  const scrollBtn = document.getElementById('scroll-top-btn');
  if (scrollBtn) scrollBtn.classList.toggle('visible', scrollY > 500);

  // Header scroll effect
  const header = document.getElementById('main-header');
  if (header) header.classList.toggle('scrolled', scrollY > 60);
}

// ====== SCROLL TO TOP ======
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== TOAST ======
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ====== SEARCH ======
document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  if (searchBtn && searchInput) {
    searchBtn.onclick = () => {
      const q = searchInput.value.trim();
      if (q) showToast(`🔍 Searching for "${q}"...`);
    };
    searchInput.onkeypress = e => {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim();
        if (q) showToast(`🔍 Searching for "${q}"...`);
      }
    };
  }
});
