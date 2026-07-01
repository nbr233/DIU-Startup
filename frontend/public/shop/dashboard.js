/* ================================================
   DIU STARTUP – Shop Dashboard JavaScript
   Full interactive dashboard with dummy data
================================================ */

// ===== DUMMY DATA =====
const DUMMY_PRODUCTS = [
  { id:1, name:'Samsung Galaxy S24 Ultra', sku:'SKU-001', category:'Electronics', price:149999, oldPrice:185000, stock:45, status:'active', img:'../images/phone.png', sales:128 },
  { id:2, name:'UltraBook Pro X15 Laptop', sku:'SKU-002', category:'Electronics', price:89999, oldPrice:110000, stock:18, status:'active', img:'../images/laptop.png', sales:72 },
  { id:3, name:'Sony WH-1000XM5 Headphones', sku:'SKU-003', category:'Electronics', price:29999, oldPrice:42000, stock:72, status:'active', img:'../images/headphones.png', sales:215 },
  { id:4, name:'Smart Fitness Watch Pro', sku:'SKU-004', category:'Electronics', price:14999, oldPrice:22000, stock:5, status:'active', img:'../images/watch.png', sales:89 },
  { id:5, name:'Air Boost Running Sneakers', sku:'SKU-005', category:'Fashion', price:6499, oldPrice:9500, stock:95, status:'active', img:'../images/sneakers.png', sales:43 },
  { id:6, name:'Premium Cotton T-Shirt', sku:'SKU-006', category:'Fashion', price:899, oldPrice:1500, stock:200, status:'draft', img:'../images/tshirt.png', sales:31 },
  { id:7, name:'Leather Shoulder Bag', sku:'SKU-007', category:'Fashion', price:3999, oldPrice:6500, stock:8, status:'active', img:'../images/bag.png', sales:62 },
  { id:8, name:'Luxe Fragrance Perfume', sku:'SKU-008', category:'Beauty', price:4500, oldPrice:6800, stock:0, status:'inactive', img:'../images/perfume.png', sales:147 },
];

const DUMMY_ORDERS = [
  { id:'#ORD-2401', customer:'Rahim Uddin', phone:'01712-345678', address:'Mirpur-10, Dhaka', products:[{name:'Samsung Galaxy S24',qty:1,price:149999}], total:149999, payment:'bKash', deliveryCharge:60, status:'pending', date:'30 Jun 2024', paymentStatus:'received', txnId:'BK123456' },
  { id:'#ORD-2400', customer:'Fatima Khatun', phone:'01812-987654', address:'Gulshan-2, Dhaka', products:[{name:'Sony Headphones',qty:1,price:29999},{name:'Perfume',qty:2,price:9000}], total:38999, payment:'Cash on Delivery', deliveryCharge:100, status:'confirmed', date:'29 Jun 2024', paymentStatus:'pending', txnId:'' },
  { id:'#ORD-2399', customer:'Arif Hossain', phone:'01611-456123', address:'Uttara, Dhaka', products:[{name:'Laptop X15',qty:1,price:89999}], total:89999, payment:'Nagad', deliveryCharge:0, status:'shipped', date:'28 Jun 2024', paymentStatus:'received', txnId:'NG789012' },
  { id:'#ORD-2398', customer:'Mitu Akter', phone:'01911-234567', address:'Chittagong', products:[{name:'Sneakers',qty:2,price:12998}], total:12998, payment:'Cash on Delivery', deliveryCharge:150, status:'delivered', date:'27 Jun 2024', paymentStatus:'received', txnId:'' },
  { id:'#ORD-2397', customer:'Sabbir Ahmed', phone:'01511-765432', address:'Sylhet', products:[{name:'Fitness Watch',qty:1,price:14999}], total:14999, payment:'bKash', deliveryCharge:100, status:'cancelled', date:'26 Jun 2024', paymentStatus:'rejected', txnId:'BK000001' },
  { id:'#ORD-2396', customer:'Nadia Islam', phone:'01712-111222', address:'Comilla', products:[{name:'T-Shirt',qty:3,price:2697},{name:'Bag',qty:1,price:3999}], total:6696, payment:'Nagad', deliveryCharge:80, status:'delivered', date:'25 Jun 2024', paymentStatus:'received', txnId:'NG345678' },
  { id:'#ORD-2395', customer:'Karim Mia', phone:'01812-333444', address:'Rajshahi', products:[{name:'Perfume',qty:1,price:4500}], total:4500, payment:'bKash', deliveryCharge:100, status:'returned', date:'24 Jun 2024', paymentStatus:'refunded', txnId:'BK222333' },
  { id:'#ORD-2394', customer:'Sadia Rahman', phone:'01911-555666', address:'Khulna', products:[{name:'Headphones',qty:1,price:29999}], total:29999, payment:'Bank Transfer', deliveryCharge:200, status:'packed', date:'23 Jun 2024', paymentStatus:'received', txnId:'BK-TXN-001' },
];

const DUMMY_CUSTOMERS = [
  { name:'Rahim Uddin', phone:'01712-345678', email:'rahim@email.com', orders:8, spent:342000, last:'30 Jun 2024', status:'active' },
  { name:'Fatima Khatun', phone:'01812-987654', email:'fatima@email.com', orders:3, spent:86000, last:'29 Jun 2024', status:'active' },
  { name:'Arif Hossain', phone:'01611-456123', email:'arif@email.com', orders:12, spent:510000, last:'28 Jun 2024', status:'active' },
  { name:'Mitu Akter', phone:'01911-234567', email:'mitu@email.com', orders:2, spent:25000, last:'27 Jun 2024', status:'active' },
  { name:'Sabbir Ahmed', phone:'01511-765432', email:'sabbir@email.com', orders:1, spent:14999, last:'26 Jun 2024', status:'blocked' },
];

const DUMMY_REVIEWS = [
  { id:1, customer:'Rahim Uddin', product:'Samsung Galaxy S24 Ultra', rating:5, text:'Absolutely amazing phone! The camera is insane. Delivery was super fast. Highly recommend DIU Startup!', date:'28 Jun 2024', color:'#e53935', reply:'' },
  { id:2, customer:'Fatima Khatun', product:'Sony WH-1000XM5', rating:4, text:'Great headphones, excellent noise cancellation. Packaging was good, delivery was on time. Only wish the price was lower.', date:'25 Jun 2024', color:'#8e24aa', reply:'Thank you for the wonderful review! We are glad you enjoy the headphones.' },
  { id:3, customer:'Arif Hossain', product:'UltraBook Pro X15', rating:5, text:'Best laptop I have ever used! The performance is exceptional. Seller was very responsive and helpful.', date:'22 Jun 2024', color:'#1976d2', reply:'' },
  { id:4, customer:'Mitu Akter', product:'Air Boost Sneakers', rating:3, text:'Shoes are good but sizing runs a bit small. I should have ordered a size up. Otherwise quality is fine.', date:'20 Jun 2024', color:'#00897b', reply:'' },
  { id:5, customer:'Nadia Islam', product:'Leather Shoulder Bag', rating:5, text:'Gorgeous bag! Real leather, smells great, very spacious. Got so many compliments. Worth every taka!', date:'18 Jun 2024', color:'#f57c00', reply:'' },
];

const DUMMY_NOTIFICATIONS = [
  { type:'order', icon:'fas fa-shopping-bag', color:'#3b82f6', bg:'#dbeafe', title:'New Order Received!', desc:'Order #ORD-2401 from Rahim Uddin (৳149,999)', time:'2 min ago', read:false },
  { type:'review', icon:'fas fa-star', color:'#f59e0b', bg:'#fef3c7', title:'New Review Posted', desc:'Fatima Khatun gave 4★ on Sony Headphones', time:'15 min ago', read:false },
  { type:'stock', icon:'fas fa-exclamation-triangle', color:'#ef4444', bg:'#fee2e2', title:'Low Stock Alert!', desc:'Smart Fitness Watch Pro – Only 5 left in stock', time:'1 hour ago', read:false },
  { type:'payment', icon:'fas fa-credit-card', color:'#10b981', bg:'#d1fae5', title:'Payment Received', desc:'bKash payment confirmed for Order #ORD-2399', time:'2 hours ago', read:false },
  { type:'order', icon:'fas fa-shopping-bag', color:'#3b82f6', bg:'#dbeafe', title:'Order Delivered', desc:'Order #ORD-2398 marked as delivered', time:'3 hours ago', read:true },
  { type:'chat', icon:'fas fa-comments', color:'#8b5cf6', bg:'#ede9fe', title:'New Customer Message', desc:'Karim Mia: "Is this product available?"', time:'4 hours ago', read:true },
  { type:'review', icon:'fas fa-star', color:'#f59e0b', bg:'#fef3c7', title:'New Review Posted', desc:'Arif Hossain gave 5★ on UltraBook Pro X15', time:'5 hours ago', read:true },
  { type:'stock', icon:'fas fa-exclamation-triangle', color:'#ef4444', bg:'#fee2e2', title:'Out of Stock!', desc:'Luxe Fragrance Perfume is now out of stock', time:'Yesterday', read:true },
];

const DUMMY_CHAT = [
  { id:1, name:'Rahim Uddin', avatar:'R', color:'#e53935', lastMsg:'Is the Galaxy S24 available?', time:'2m', unread:2, messages:[
    { from:'customer', text:'Hi! Is the Samsung Galaxy S24 Ultra available?', time:'10:30 AM' },
    { from:'seller', text:'Yes! It is in stock. Would you like to place an order?', time:'10:32 AM' },
    { from:'customer', text:'What is the delivery time to Mirpur?', time:'10:33 AM' },
    { from:'customer', text:'Is the Galaxy S24 available?', time:'10:35 AM' },
  ]},
  { id:2, name:'Fatima Khatun', avatar:'F', color:'#8e24aa', lastMsg:'Thanks for the quick delivery!', time:'1h', unread:0, messages:[
    { from:'customer', text:'Order received, thank you!', time:'9:15 AM' },
    { from:'seller', text:'Thank you for shopping with us!', time:'9:20 AM' },
    { from:'customer', text:'Thanks for the quick delivery!', time:'9:25 AM' },
  ]},
  { id:3, name:'Arif Hossain', avatar:'A', color:'#1976d2', lastMsg:'Can I return this product?', time:'3h', unread:1, messages:[
    { from:'customer', text:'I received a different product. Can I return it?', time:'7:00 AM' },
    { from:'seller', text:'We are sorry about that! Please send us a photo and we will arrange a replacement.', time:'7:30 AM' },
    { from:'customer', text:'Can I return this product?', time:'7:45 AM' },
  ]},
  { id:4, name:'Karim Mia', avatar:'K', color:'#00897b', lastMsg:'Is this product available?', time:'4h', unread:1, messages:[
    { from:'customer', text:'Is this product available?', time:'6:00 AM' },
  ]},
];

const DUMMY_COUPONS = [
  { code:'SAVE20', type:'percent', value:20, minOrder:500, used:45, limit:100, expiry:'31 Jul 2024', active:true },
  { code:'FLAT100', type:'fixed', value:100, minOrder:1000, used:23, limit:50, expiry:'15 Jul 2024', active:true },
  { code:'NEWUSER', type:'percent', value:15, minOrder:0, used:89, limit:200, expiry:'31 Dec 2024', active:true },
  { code:'EID2024', type:'percent', value:30, minOrder:2000, used:100, limit:100, expiry:'30 Jun 2024', active:false },
];

const DUMMY_CATEGORIES = [
  { name:'Electronics', icon:'fas fa-mobile-alt', subcats:4, products:18, active:true },
  { name:'Fashion', icon:'fas fa-tshirt', subcats:6, products:22, active:true },
  { name:'Beauty', icon:'fas fa-magic', subcats:3, products:8, active:true },
  { name:'Sports', icon:'fas fa-running', subcats:2, products:5, active:true },
  { name:'Home & Living', icon:'fas fa-couch', subcats:5, products:0, active:false },
];

const DUMMY_SUBCATS = [
  { name:'Smartphones', parent:'Electronics', products:8 },
  { name:'Laptops', parent:'Electronics', products:5 },
  { name:'Audio', parent:'Electronics', products:3 },
  { name:'Wearables', parent:'Electronics', products:2 },
  { name:'Clothing', parent:'Fashion', products:12 },
  { name:'Footwear', parent:'Fashion', products:6 },
  { name:'Bags', parent:'Fashion', products:4 },
  { name:'Fragrances', parent:'Beauty', products:5 },
];

const DUMMY_PAYMENT_ACCOUNTS = [
  { method:'bKash', number:'01712-345678', name:'DIU Reachad', primary:true, color:'#e81c5e' },
  { method:'Nagad', number:'01812-987654', name:'DIU Reachad', primary:false, color:'#f47920' },
  { method:'Rocket', number:'01611-456123', name:'DIU Reachad', primary:false, color:'#8d1782' },
];

const DUMMY_SHIPPING = [
  { zone:'Dhaka Metro', areas:'Mirpur, Gulshan, Dhanmondi, Uttara, Motijheel', charge:60, freeAbove:1000, delivery:'1-2 Days' },
  { zone:'Dhaka Outskirts', areas:'Savar, Keraniganj, Narayanganj', charge:100, freeAbove:1500, delivery:'2-3 Days' },
  { zone:'Chittagong', areas:'CTG City, Halishahar, Agrabad', charge:120, freeAbove:2000, delivery:'2-4 Days' },
  { zone:'National', areas:'All other districts', charge:150, freeAbove:2500, delivery:'3-5 Days' },
];

const DUMMY_COURIERS = [
  { name:'Sundarban Courier', tracking:'Yes', cod:'Yes', active:true },
  { name:'Pathao Courier', tracking:'Yes', cod:'Yes', active:true },
  { name:'RedX', tracking:'Yes', cod:'Yes', active:true },
  { name:'Ecourier', tracking:'Yes', cod:'No', active:false },
];

const PAYMENT_VERIFICATIONS = [
  { order:'#ORD-2401', customer:'Rahim Uddin', method:'bKash', amount:149999, txnId:'BK123456', screenshot:'../images/phone.png', date:'30 Jun 2024' },
  { order:'#ORD-2403', customer:'Karim Ahmed', method:'Nagad', amount:8999, txnId:'NG789011', screenshot:'../images/headphones.png', date:'29 Jun 2024' },
  { order:'#ORD-2405', customer:'Lima Begum', method:'Rocket', amount:3999, txnId:'RK001122', screenshot:'../images/bag.png', date:'28 Jun 2024' },
];

// ===== STATE =====
let activeSectionEl = null;
let sidebarCollapsed = false;
let activeChatId = 1;
let currentOrderFilter = 'all';

// ===== SECTION NAVIGATION =====
function showSection(name, navEl) {
  document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('section-' + name);
  if (panel) panel.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navEl) navEl.classList.add('active');

  const titles = {
    dashboard:'Dashboard',products:'Product Management',categories:'Category Management',
    orders:'Order Management',payments:'Payment Management',shipping:'Shipping',
    coupons:'Coupons',reports:'Sales Report',customers:'Customers',
    reviews:'Reviews',banners:'Banner Management',notifications:'Notifications',
    chat:'Customer Chat',settings:'Shop Settings',
  };
  document.getElementById('page-title-text').textContent = titles[name] || name;
}

// ===== SIDEBAR TOGGLE =====
function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed', sidebarCollapsed);
  document.getElementById('main-content').classList.toggle('expanded', sidebarCollapsed);
}

// ===== MODAL =====
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.addEventListener('keydown', e => { if(e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open')); });
document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', e => { if(e.target === m) m.classList.remove('open'); }));

// ===== TOAST =====
function showToast(msg, type='success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const icons = { success:'check-circle', error:'times-circle', warning:'exclamation-triangle', info:'info-circle' };
  toast.className = `toast-msg ${type}`;
  toast.innerHTML = `<i class="fas fa-${icons[type] || 'check-circle'}"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(60px)'; toast.style.transition = '.3s'; setTimeout(() => toast.remove(), 350); }, 3500);
}

// ===== CHARTS =====
function initSalesChart() {
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const data = [45000,82000,68000,95000,112000,240000,180000,145000,198000,220000,195000,240000];
  new Chart(ctx, {
    type:'bar',
    data:{
      labels: months,
      datasets:[{
        label:'Revenue (৳)',
        data,
        backgroundColor: months.map((_,i) => i===5 ? 'rgba(245,114,36,0.9)' : 'rgba(245,114,36,0.4)'),
        borderColor:'rgba(245,114,36,1)',
        borderWidth:2,
        borderRadius:6,
      },{
        label:'Orders',
        data:[12,22,18,25,30,64,48,38,52,58,51,64],
        type:'line',
        borderColor:'#6c63ff',
        backgroundColor:'rgba(108,99,255,0.08)',
        borderWidth:2.5,
        pointBackgroundColor:'#6c63ff',
        pointRadius:4,
        tension:0.4,
        yAxisID:'y2',
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'bottom', labels:{ font:{ size:11 }, padding:12 } } },
      scales:{
        y:{ beginAtZero:true, grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ callback: v => '৳'+v.toLocaleString() } },
        y2:{ position:'right', beginAtZero:true, grid:{ display:false }, ticks:{ color:'#6c63ff' } },
        x:{ grid:{ display:false } }
      }
    }
  });
}

function initRevenueDonut() {
  const ctx = document.getElementById('revenueDonut');
  if (!ctx) return;
  new Chart(ctx, {
    type:'doughnut',
    data:{
      labels:['Electronics','Fashion','Beauty','Sports','Others'],
      datasets:[{ data:[58,24,10,5,3], backgroundColor:['#f57224','#6c63ff','#ec4899','#10b981','#f59e0b'], borderWidth:0, hoverOffset:6 }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'bottom', labels:{ padding:14, font:{ size:11 } } } },
      cutout:'68%',
    }
  });
}

function initReportTrend() {
  const ctx = document.getElementById('reportTrend');
  if (!ctx) return;
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  new Chart(ctx, {
    type:'line',
    data:{
      labels: days,
      datasets:[{
        label:'Sales (৳)',
        data:[12000,19000,8000,25000,14200,32000,21000],
        borderColor:'#f57224', backgroundColor:'rgba(245,114,36,0.1)',
        fill:true, tension:0.4, borderWidth:2.5, pointRadius:5, pointBackgroundColor:'#f57224',
      },{
        label:'Orders',
        data:[4,7,3,9,5,11,8],
        borderColor:'#6c63ff', backgroundColor:'rgba(108,99,255,0)',
        fill:false, tension:0.4, borderWidth:2, pointRadius:4, pointBackgroundColor:'#6c63ff',
        yAxisID:'y2',
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'bottom', labels:{ font:{size:11}, padding:12 } } },
      scales:{
        y:{ beginAtZero:true, grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ callback:v=>'৳'+v.toLocaleString() } },
        y2:{ position:'right', beginAtZero:true, grid:{ display:false }, ticks:{ color:'#6c63ff' } },
        x:{ grid:{ display:false } }
      }
    }
  });
}

// ===== RENDER FUNCTIONS =====

function renderLowStock() {
  const el = document.getElementById('low-stock-list');
  if (!el) return;
  const low = DUMMY_PRODUCTS.filter(p => p.stock <= 10);
  el.innerHTML = low.map(p => `
    <div class="stock-alert-item">
      <img src="${p.img}" style="width:36px;height:36px;object-fit:contain;border-radius:6px;background:#f1f5f9;padding:4px;border:1px solid #e2e8f0" onerror="this.src='../images/phone.png'" />
      <div style="flex:1">
        <div style="font-size:0.8rem;font-weight:600;color:var(--text)">${p.name}</div>
        <div class="stock-bar-wrap" style="margin-top:4px">
          <div class="stock-bar ${p.stock===0?'stock-critical':p.stock<10?'stock-low':'stock-ok'}" style="width:${Math.min((p.stock/20)*100,100)}%"></div>
        </div>
      </div>
      <span class="badge ${p.stock===0?'badge-danger':p.stock<5?'badge-warning':'badge-orange'}" style="font-size:0.65rem">${p.stock===0?'OUT':p.stock+' left'}</span>
    </div>
  `).join('');
}

function renderRecentOrders() {
  const tbody = document.getElementById('recent-orders-body');
  if (!tbody) return;
  const statusClass = { pending:'badge-warning', confirmed:'badge-info', packed:'badge-purple', shipped:'badge-blue', delivered:'badge-success', cancelled:'badge-danger', returned:'badge-gray' };
  tbody.innerHTML = DUMMY_ORDERS.slice(0,6).map(o => `
    <tr onclick="viewOrder('${o.id}')" style="cursor:pointer">
      <td><span style="font-weight:700;color:var(--primary)">${o.id}</span></td>
      <td>
        <div style="font-weight:600;font-size:0.82rem">${o.customer}</div>
        <div style="font-size:0.7rem;color:var(--text-muted)">${o.phone}</div>
      </td>
      <td><strong>৳${o.total.toLocaleString('en-IN')}</strong></td>
      <td><span class="badge ${statusClass[o.status]||'badge-gray'}">${capitalize(o.status)}</span></td>
      <td style="font-size:0.75rem;color:var(--text-muted)">${o.date}</td>
    </tr>
  `).join('');
}

function renderProductsTable() {
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;
  tbody.innerHTML = DUMMY_PRODUCTS.map(p => `
    <tr>
      <td><input type="checkbox" /></td>
      <td>
        <div style="display:flex;align-items:center;gap:12px">
          <img class="product-thumb" src="${p.img}" onerror="this.src='../images/phone.png'" />
          <div class="product-info-cell">
            <div class="pname">${p.name}</div>
            <div class="psku">${p.sku}</div>
          </div>
        </div>
      </td>
      <td style="font-size:0.78rem;color:var(--text-muted)">${p.sku}</td>
      <td><span class="chip">${p.category}</span></td>
      <td>
        <strong>৳${p.price.toLocaleString('en-IN')}</strong>
        ${p.oldPrice ? `<div style="font-size:0.7rem;color:var(--text-muted);text-decoration:line-through">৳${p.oldPrice.toLocaleString('en-IN')}</div>` : ''}
      </td>
      <td>
        <span class="${p.stock===0?'badge badge-danger':p.stock<10?'badge badge-warning':'badge badge-success'}">${p.stock===0?'Out of Stock':p.stock+' units'}</span>
      </td>
      <td>
        <div class="toggle-wrap">
          <label class="toggle-switch"><input type="checkbox" ${p.status==='active'?'checked':''} onchange="toggleProductStatus(${p.id},this)"/><span class="toggle-slider"></span></label>
          <span style="font-size:0.72rem">${p.status==='draft'?'Draft':p.status==='active'?'Active':'Inactive'}</span>
        </div>
      </td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-icon btn-outline btn-sm" onclick="editProduct(${p.id})" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn btn-icon btn-sm" style="background:#dbeafe;color:#1e40af" onclick="duplicateProduct(${p.id})" title="Duplicate"><i class="fas fa-copy"></i></button>
          <button class="btn btn-icon btn-sm" style="background:#fee2e2;color:#991b1b" onclick="deleteProduct(${p.id})" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderOrdersTable(filter = 'all') {
  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;
  const statusColor = { pending:'badge-warning', confirmed:'badge-info', packed:'badge-purple', shipped:'badge-blue', delivered:'badge-success', cancelled:'badge-danger', returned:'badge-gray' };
  const filtered = filter === 'all' ? DUMMY_ORDERS : DUMMY_ORDERS.filter(o => o.status === filter);
  tbody.innerHTML = filtered.length === 0 ? `<tr><td colspan="8"><div class="empty-state" style="padding:40px"><i class="fas fa-inbox"></i><h4>No orders found</h4></div></td></tr>` :
  filtered.map(o => `
    <tr>
      <td><span style="font-weight:700;color:var(--primary);cursor:pointer" onclick="viewOrder('${o.id}')">${o.id}</span></td>
      <td>
        <div style="font-weight:600;font-size:0.82rem">${o.customer}</div>
        <div style="font-size:0.7rem;color:var(--text-muted)">${o.phone}</div>
      </td>
      <td style="font-size:0.78rem;max-width:180px">
        ${o.products.map(p=>`${p.name} ×${p.qty}`).join('<br/>')}
      </td>
      <td><strong>৳${(o.total+o.deliveryCharge).toLocaleString('en-IN')}</strong></td>
      <td>
        <span class="badge ${o.payment==='Cash on Delivery'?'badge-orange':'badge-info'}" style="font-size:0.65rem">${o.payment}</span>
      </td>
      <td>
        <select class="form-control" style="width:130px;font-size:0.75rem;padding:5px 10px" onchange="updateOrderStatusInline('${o.id}',this.value)">
          ${['pending','confirmed','packed','shipped','delivered','cancelled','returned'].map(s=>`<option ${o.status===s?'selected':''}>${capitalize(s)}</option>`).join('')}
        </select>
      </td>
      <td style="font-size:0.75rem;color:var(--text-muted)">${o.date}</td>
      <td>
        <div style="display:flex;gap:5px">
          <button class="btn btn-sm btn-outline" onclick="viewOrder('${o.id}')" title="View"><i class="fas fa-eye"></i></button>
          <button class="btn btn-sm btn-outline" onclick="printInvoice()" title="Invoice"><i class="fas fa-print"></i></button>
          <button class="btn btn-sm btn-outline" onclick="showToast('Calling ${o.customer}...','info')" title="Contact"><i class="fas fa-phone"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function viewOrder(id) {
  const o = DUMMY_ORDERS.find(x => x.id === id);
  if (!o) return;
  const statusSteps = ['pending','confirmed','packed','shipped','delivered'];
  const currentIdx = statusSteps.indexOf(o.status);
  const statusColor = { pending:'badge-warning', confirmed:'badge-info', packed:'badge-purple', shipped:'badge-blue', delivered:'badge-success', cancelled:'badge-danger', returned:'badge-gray' };
  document.getElementById('order-detail-body').innerHTML = `
    <div class="order-detail-grid">
      <div>
        <div class="card" style="padding:20px;margin-bottom:16px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
            <div>
              <div style="font-size:1.1rem;font-weight:800;color:var(--primary)">${o.id}</div>
              <div style="font-size:0.78rem;color:var(--text-muted)">${o.date}</div>
            </div>
            <span class="badge ${statusColor[o.status]||'badge-gray'}" style="font-size:0.78rem;padding:6px 14px">${capitalize(o.status)}</span>
          </div>
          <div style="margin-bottom:16px">
            <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-bottom:8px">Ordered Products</div>
            <table class="data-table">
              <thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead>
              <tbody>${o.products.map(p=>`<tr><td>${p.name}</td><td>${p.qty}</td><td>৳${p.price.toLocaleString()}</td></tr>`).join('')}</tbody>
            </table>
          </div>
          <div style="border-top:1px solid var(--border);padding-top:12px">
            <div style="display:flex;justify-content:space-between;font-size:0.83rem;margin-bottom:6px"><span>Subtotal</span><span>৳${o.total.toLocaleString()}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:0.83rem;margin-bottom:6px"><span>Delivery</span><span>${o.deliveryCharge===0?'<span style="color:var(--success)">FREE</span>':'৳'+o.deliveryCharge}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:1rem;font-weight:800;color:var(--primary)"><span>Total</span><span>৳${(o.total+o.deliveryCharge).toLocaleString()}</span></div>
          </div>
        </div>
        <div class="card" style="padding:20px">
          <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-bottom:14px">Order Timeline</div>
          <div class="order-timeline">
            ${statusSteps.map((step, i) => `
              <div class="timeline-step">
                <div class="timeline-dot ${i < currentIdx ? 'done' : i === currentIdx ? 'active' : 'pending'}">
                  <i class="fas ${i < currentIdx ? 'fa-check' : i === currentIdx ? 'fa-circle' : 'fa-circle'}"></i>
                </div>
                <div class="timeline-info">
                  <div class="tl-title">${capitalize(step)}</div>
                  <div class="tl-time">${i <= currentIdx ? o.date : 'Pending'}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div>
        <div class="card" style="padding:18px;margin-bottom:14px">
          <div style="font-weight:700;margin-bottom:12px;font-size:0.9rem"><i class="fas fa-user" style="color:var(--primary);margin-right:6px"></i>Customer Info</div>
          <div style="font-size:0.83rem;display:flex;flex-direction:column;gap:8px">
            <div><strong>${o.customer}</strong></div>
            <div><i class="fas fa-phone" style="color:var(--text-muted);width:16px"></i> ${o.phone}</div>
            <div><i class="fas fa-map-marker-alt" style="color:var(--text-muted);width:16px"></i> ${o.address}</div>
          </div>
        </div>
        <div class="card" style="padding:18px;margin-bottom:14px">
          <div style="font-weight:700;margin-bottom:12px;font-size:0.9rem"><i class="fas fa-credit-card" style="color:var(--primary);margin-right:6px"></i>Payment Info</div>
          <div style="font-size:0.83rem;display:flex;flex-direction:column;gap:6px">
            <div>Method: <strong>${o.payment}</strong></div>
            <div>Status: <span class="badge ${o.paymentStatus==='received'?'badge-success':o.paymentStatus==='pending'?'badge-warning':'badge-danger'}">${capitalize(o.paymentStatus)}</span></div>
            ${o.txnId ? `<div>Txn ID: <code style="font-size:0.78rem;background:#f1f5f9;padding:2px 6px;border-radius:4px">${o.txnId}</code></div>` : ''}
          </div>
        </div>
        <div class="card" style="padding:18px">
          <div style="font-weight:700;margin-bottom:12px;font-size:0.9rem"><i class="fas fa-truck" style="color:var(--primary);margin-right:6px"></i>Update Status</div>
          <select class="form-control" style="margin-bottom:12px">
            ${['pending','confirmed','packed','shipped','delivered','cancelled','returned'].map(s=>`<option ${o.status===s?'selected':''}>${capitalize(s)}</option>`).join('')}
          </select>
          <input class="form-control" placeholder="Tracking Number (optional)" style="margin-bottom:10px"/>
          <button class="btn btn-primary" style="width:100%" onclick="updateOrderStatus()"><i class="fas fa-save"></i> Save Status</button>
        </div>
      </div>
    </div>
  `;
  openModal('modal-order-detail');
}

function renderCategoriesTable() {
  const tbody = document.getElementById('categories-tbody');
  if (!tbody) return;
  tbody.innerHTML = DUMMY_CATEGORIES.map(c => `
    <tr>
      <td><span style="font-weight:600"><i class="${c.icon}" style="color:var(--primary);margin-right:8px"></i>${c.name}</span></td>
      <td><span class="badge badge-info">${c.subcats}</span></td>
      <td><span class="badge badge-gray">${c.products}</span></td>
      <td><span class="badge ${c.active?'badge-success':'badge-danger'}">${c.active?'Active':'Inactive'}</span></td>
      <td><div style="display:flex;gap:5px">
        <button class="btn btn-icon btn-outline btn-sm" onclick="showToast('Editing ${c.name}','info')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-icon btn-sm" style="background:#fee2e2;color:#991b1b" onclick="showToast('${c.name} deleted!','error')"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('');
  const stbody = document.getElementById('subcategories-tbody');
  if (!stbody) return;
  stbody.innerHTML = DUMMY_SUBCATS.map(s => `
    <tr>
      <td style="font-weight:600">${s.name}</td>
      <td><span class="chip">${s.parent}</span></td>
      <td>${s.products}</td>
      <td><div style="display:flex;gap:5px">
        <button class="btn btn-icon btn-outline btn-sm"><i class="fas fa-edit"></i></button>
        <button class="btn btn-icon btn-sm" style="background:#fee2e2;color:#991b1b"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('');
}

function renderPayments() {
  const verifEl = document.getElementById('payment-verif-list');
  if (verifEl) {
    verifEl.innerHTML = PAYMENT_VERIFICATIONS.map((p,i) => `
      <div style="border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;margin-bottom:12px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div>
            <div style="font-weight:700;font-size:0.88rem">${p.order} – ${p.customer}</div>
            <div style="font-size:0.75rem;color:var(--text-muted)">${p.method} · Txn: ${p.txnId} · ${p.date}</div>
          </div>
          <strong style="color:var(--primary);font-size:1rem">৳${p.amount.toLocaleString()}</strong>
        </div>
        <img src="${p.screenshot}" alt="Payment Screenshot" class="payment-proof-img" onerror="this.src='../images/phone.png'" style="height:120px;object-fit:cover" />
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-success btn-sm" style="flex:1" onclick="approvePaymentItem(${i})"><i class="fas fa-check"></i> Approve</button>
          <button class="btn btn-danger btn-sm" style="flex:1" onclick="rejectPaymentItem(${i})"><i class="fas fa-times"></i> Reject</button>
        </div>
      </div>
    `).join('');
  }

  const histTbody = document.getElementById('payment-history-tbody');
  if (histTbody) {
    histTbody.innerHTML = DUMMY_ORDERS.map(o => `
      <tr>
        <td style="font-weight:700;color:var(--primary)">${o.id}</td>
        <td>${o.customer}</td>
        <td><span class="badge badge-info" style="font-size:0.65rem">${o.payment}</span></td>
        <td><strong>৳${o.total.toLocaleString()}</strong></td>
        <td><code style="font-size:0.72rem;background:#f1f5f9;padding:2px 6px;border-radius:4px">${o.txnId||'—'}</code></td>
        <td><span class="badge ${o.paymentStatus==='received'?'badge-success':o.paymentStatus==='refunded'?'badge-purple':o.paymentStatus==='rejected'?'badge-danger':'badge-warning'}">${capitalize(o.paymentStatus||'pending')}</span></td>
        <td style="font-size:0.75rem;color:var(--text-muted)">${o.date}</td>
      </tr>
    `).join('');
  }

  const accEl = document.getElementById('payment-accounts-list');
  if (accEl) {
    accEl.innerHTML = DUMMY_PAYMENT_ACCOUNTS.map(a => `
      <div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border)">
        <div style="width:42px;height:42px;background:${a.color};border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;font-size:0.8rem;font-weight:800;flex-shrink:0">${a.method.slice(0,2)}</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:0.85rem">${a.method}</div>
          <div style="font-size:0.78rem;color:var(--text-muted)">${a.number} · ${a.name}</div>
        </div>
        ${a.primary ? '<span class="badge badge-success">Primary</span>' : ''}
        <button class="btn btn-icon btn-outline btn-sm" onclick="showToast(\'Account deleted!\',\'error\')"><i class="fas fa-trash"></i></button>
      </div>
    `).join('') + `<button class="btn btn-outline" style="width:100%;margin-top:12px" onclick="openModal('modal-add-payment-acc')"><i class="fas fa-plus"></i> Add Account</button>`;
  }
}

function renderShipping() {
  const zonesEl = document.getElementById('shipping-zones-list');
  if (zonesEl) {
    zonesEl.innerHTML = DUMMY_SHIPPING.map(z => `
      <div style="border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;margin-bottom:10px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <strong style="font-size:0.88rem">${z.zone}</strong>
          <div style="display:flex;gap:5px">
            <button class="btn btn-icon btn-outline btn-sm"><i class="fas fa-edit"></i></button>
            <button class="btn btn-icon btn-sm" style="background:#fee2e2;color:#991b1b"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:8px">${z.areas}</div>
        <div style="display:flex;gap:12px;font-size:0.78rem">
          <span><i class="fas fa-taka-sign" style="color:var(--primary)"></i> ৳${z.charge}</span>
          <span><i class="fas fa-gift" style="color:var(--success)"></i> Free above ৳${z.freeAbove.toLocaleString()}</span>
          <span><i class="fas fa-clock" style="color:var(--info)"></i> ${z.delivery}</span>
        </div>
      </div>
    `).join('') + `<button class="btn btn-outline" style="width:100%;margin-top:8px" onclick="openModal('modal-add-zone')"><i class="fas fa-plus"></i> Add Zone</button>`;
  }
  const courierEl = document.getElementById('courier-list');
  if (courierEl) {
    courierEl.innerHTML = DUMMY_COURIERS.map(c => `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)">
        <div class="toggle-wrap" style="flex:1">
          <label class="toggle-switch"><input type="checkbox" ${c.active?'checked':''} onchange="showToast('${c.name} status updated')"/><span class="toggle-slider"></span></label>
          <div>
            <div style="font-weight:600;font-size:0.85rem">${c.name}</div>
            <div style="font-size:0.72rem;color:var(--text-muted)">Tracking: ${c.tracking} · COD: ${c.cod}</div>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function renderCoupons() {
  const el = document.getElementById('coupons-grid');
  if (!el) return;
  el.innerHTML = DUMMY_COUPONS.map(c => `
    <div class="coupon-card" style="${!c.active?'opacity:0.6':''}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <div class="coupon-code">${c.code}</div>
        <span class="badge ${c.active?'badge-success':'badge-gray'}">${c.active?'Active':'Expired'}</span>
      </div>
      <div class="coupon-desc">${c.type==='percent'?c.value+'% OFF':'৳'+c.value+' OFF'} · Min. ৳${c.minOrder.toLocaleString()}</div>
      <div class="coupon-meta">
        <div class="coupon-meta-item"><i class="fas fa-users"></i> ${c.used}/${c.limit} used</div>
        <div class="coupon-meta-item"><i class="fas fa-calendar"></i> Expires ${c.expiry}</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-outline btn-sm" onclick="showToast('${c.code} copied!','info')"><i class="fas fa-copy"></i> Copy</button>
        <button class="btn btn-outline btn-sm" onclick="showToast('Editing ${c.code}','info')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm" style="background:#fee2e2;color:#991b1b;border-radius:var(--radius-sm)" onclick="showToast('Coupon deleted!','error')"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}

function renderCustomers() {
  const tbody = document.getElementById('customers-tbody');
  if (!tbody) return;
  const colors = ['#e53935','#8e24aa','#1976d2','#00897b','#f57c00'];
  tbody.innerHTML = DUMMY_CUSTOMERS.map((c,i) => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:36px;height:36px;border-radius:50%;background:${colors[i%5]};display:flex;align-items:center;justify-content:center;color:white;font-size:0.8rem;font-weight:700">${c.name[0]}</div>
          <div>
            <div style="font-weight:600;font-size:0.83rem">${c.name}</div>
            <div style="font-size:0.7rem;color:var(--text-muted)">${c.email}</div>
          </div>
        </div>
      </td>
      <td style="font-size:0.82rem">${c.phone}</td>
      <td><span class="badge badge-info">${c.orders} orders</span></td>
      <td><strong>৳${c.spent.toLocaleString('en-IN')}</strong></td>
      <td style="font-size:0.75rem;color:var(--text-muted)">${c.last}</td>
      <td><span class="badge ${c.status==='active'?'badge-success':'badge-danger'}">${capitalize(c.status)}</span></td>
      <td>
        <div style="display:flex;gap:5px">
          <button class="btn btn-sm btn-outline" onclick="showToast('Viewing ${c.name} orders','info')"><i class="fas fa-eye"></i></button>
          <button class="btn btn-sm btn-outline" onclick="showToast('Note added for ${c.name}','success')"><i class="fas fa-sticky-note"></i></button>
          <button class="btn btn-sm" style="background:${c.status==='active'?'#fee2e2':'#d1fae5'};color:${c.status==='active'?'#991b1b':'#065f46'};border-radius:var(--radius-sm)" onclick="toggleCustomerBlock('${c.name}',this)">
            <i class="fas ${c.status==='active'?'fa-ban':'fa-check'}"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderReviews(filter='all') {
  const el = document.getElementById('reviews-list');
  if (!el) return;
  const colors = ['#e53935','#8e24aa','#1976d2','#00897b','#f57c00'];
  const filtered = filter === 'all' ? DUMMY_REVIEWS : DUMMY_REVIEWS.filter(r => r.rating >= filter);
  el.innerHTML = filtered.map(r => `
    <div class="review-card">
      <div class="review-header">
        <div class="review-avatar" style="background:${r.color}">${r.customer[0]}</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:0.85rem">${r.customer}</div>
          <div style="font-size:0.72rem;color:var(--text-muted)">${r.product} · ${r.date}</div>
        </div>
        <div class="review-stars">${'<i class="fas fa-star"></i>'.repeat(r.rating)+'<i class="far fa-star"></i>'.repeat(5-r.rating)}</div>
        <div style="display:flex;gap:5px;margin-left:12px">
          ${r.reply ? '' : `<button class="btn btn-sm btn-outline" onclick="openReplyModal(${r.id})"><i class="fas fa-reply"></i> Reply</button>`}
          <button class="btn btn-sm" style="background:#fee2e2;color:#991b1b;border-radius:var(--radius-sm)" onclick="showToast('Review hidden','warning')"><i class="fas fa-eye-slash"></i></button>
        </div>
      </div>
      <div class="review-text">${r.text}</div>
      ${r.reply ? `<div class="review-reply-box"><div class="reply-label">Shop Response</div><p>${r.reply}</p></div>` : ''}
    </div>
  `).join('');
}

function renderBanners(tab = 'hero') {
  const el = document.getElementById('banners-content');
  if (!el) return;
  const banners = [
    { title:'Electronics Sale', type:'hero', img:'../images/hero1.png', active:true },
    { title:'Fashion Bonanza', type:'hero', img:'../images/hero2.png', active:true },
    { title:'Tech Week', type:'hero', img:'../images/hero3.png', active:true },
    { title:'Special Offer', type:'offer', img:'../images/special_offer.png', active:true },
    { title:'Flash Sale Popup', type:'popup', img:'../images/hero1.png', active:false },
  ];
  const filtered = banners.filter(b => b.type === tab);
  el.innerHTML = `<div class="banner-grid">
    ${filtered.map(b => `
      <div class="banner-card">
        <img class="banner-preview" src="${b.img}" onerror="this.src='../images/hero1.png'" />
        <div class="banner-card-footer">
          <div class="banner-card-title">${b.title}</div>
          <div style="display:flex;gap:6px;align-items:center">
            <label class="toggle-switch"><input type="checkbox" ${b.active?'checked':''} onchange="showToast('Banner updated')"/><span class="toggle-slider"></span></label>
            <button class="btn btn-icon btn-sm" style="background:#fee2e2;color:#991b1b;border-radius:var(--radius-sm)"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    `).join('')}
    <div class="banner-card" style="cursor:pointer;display:flex;align-items:center;justify-content:center;min-height:180px" onclick="openModal('modal-add-banner')">
      <div style="text-align:center;color:var(--text-muted)">
        <i class="fas fa-plus" style="font-size:2rem;margin-bottom:8px"></i>
        <p style="font-size:0.82rem">Add Banner</p>
      </div>
    </div>
  </div>`;
}

function renderNotifications() {
  const el = document.getElementById('notifications-list');
  if (!el) return;
  el.innerHTML = DUMMY_NOTIFICATIONS.map((n,i) => `
    <div class="notif-item ${n.read?'':'unread'}" onclick="markRead(${i})">
      <div class="notif-icon" style="background:${n.bg};color:${n.color}"><i class="${n.icon}"></i></div>
      <div class="notif-body">
        <div class="notif-title">${n.title}</div>
        <div class="notif-desc">${n.desc}</div>
        <div class="notif-time"><i class="fas fa-clock" style="font-size:0.6rem;margin-right:3px"></i>${n.time}</div>
      </div>
    </div>
  `).join('');

  const prefsEl = document.getElementById('notif-prefs');
  if (prefsEl) {
    const prefs = ['New Orders','New Reviews','Stock Alerts','Payment Updates','Customer Messages','Promotions'];
    prefsEl.innerHTML = prefs.map(p => `
      <div class="toggle-wrap" style="margin-bottom:14px">
        <label class="toggle-switch"><input type="checkbox" checked onchange="showToast('${p} notifications updated')"/><span class="toggle-slider"></span></label>
        <span style="font-size:0.83rem">${p}</span>
      </div>
    `).join('');
  }
}

function renderChat() {
  const listEl = document.getElementById('chat-list');
  if (!listEl) return;
  const colors = ['#e53935','#8e24aa','#1976d2','#00897b'];
  listEl.innerHTML = DUMMY_CHAT.map((c,i) => `
    <div class="chat-list-item ${c.id===activeChatId?'active':''}" onclick="switchChat(${c.id})">
      <div class="chat-avatar" style="background:${colors[i%4]}">${c.avatar}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div class="chat-list-name">${c.name}</div>
          <div class="chat-list-time">${c.time}</div>
        </div>
        <div class="chat-list-preview">${c.lastMsg}</div>
      </div>
      ${c.unread > 0 ? `<span style="background:var(--danger);color:white;font-size:0.6rem;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0">${c.unread}</span>` : ''}
    </div>
  `).join('');
  loadChatMessages(activeChatId);
}

function switchChat(id) {
  activeChatId = id;
  const chat = DUMMY_CHAT.find(c => c.id === id);
  if (!chat) return;
  document.querySelectorAll('.chat-list-item').forEach((el,i) => el.classList.toggle('active', DUMMY_CHAT[i].id === id));
  document.getElementById('active-chat-name').textContent = chat.name;
  document.getElementById('active-chat-avatar').textContent = chat.avatar;
  loadChatMessages(id);
}

function loadChatMessages(id) {
  const chat = DUMMY_CHAT.find(c => c.id === id);
  const el = document.getElementById('chat-messages');
  if (!chat || !el) return;
  const colors = ['#e53935','#8e24aa','#1976d2','#00897b'];
  const colorIdx = DUMMY_CHAT.findIndex(c => c.id === id) % 4;
  el.innerHTML = chat.messages.map(m => `
    <div class="msg-bubble-wrap ${m.from==='seller'?'own':''}">
      ${m.from==='customer' ? `<div class="msg-avatar" style="background:${colors[colorIdx]}">${chat.avatar}</div>` : ''}
      <div>
        <div class="msg-bubble ${m.from==='seller'?'sent':'received'}">${m.text}</div>
        <div class="msg-time">${m.time}</div>
      </div>
    </div>
  `).join('');
  el.scrollTop = el.scrollHeight;
}

function sendChatMsg() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  const chat = DUMMY_CHAT.find(c => c.id === activeChatId);
  if (chat) {
    chat.messages.push({ from:'seller', text, time: new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) });
    chat.lastMsg = text;
    loadChatMessages(activeChatId);
    input.value = '';
    setTimeout(() => {
      const replies = ['Thank you for contacting us!','We will process your request shortly.','Your order is on the way!','Please let us know if you need anything else.'];
      chat.messages.push({ from:'customer', text: replies[Math.floor(Math.random()*replies.length)], time: new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) });
      loadChatMessages(activeChatId);
    }, 1500);
  }
}

function chatSendOnEnter(e) { if (e.key === 'Enter') sendChatMsg(); }

function renderBestSellers() {
  const el = document.getElementById('best-sellers-list');
  if (!el) return;
  const sorted = [...DUMMY_PRODUCTS].sort((a,b) => b.sales - a.sales).slice(0,5);
  el.innerHTML = sorted.map((p,i) => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:1.1rem;font-weight:900;color:${i<3?'var(--warning)':'var(--text-muted)'};width:24px">${i+1}</span>
      <img src="${p.img}" onerror="this.src='../images/phone.png'" style="width:38px;height:38px;object-fit:contain;background:#f1f5f9;border-radius:6px;padding:4px" />
      <div style="flex:1;min-width:0">
        <div style="font-size:0.8rem;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div>
        <div style="font-size:0.7rem;color:var(--text-muted)">${p.sales} sold</div>
      </div>
      <strong style="color:var(--primary);font-size:0.85rem">৳${p.price.toLocaleString()}</strong>
    </div>
  `).join('');
}

function renderBusinessHours() {
  const el = document.getElementById('business-hours-form');
  if (!el) return;
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  el.innerHTML = days.map((d,i) => `
    <div style="display:flex;align-items:center;gap:16px;padding:12px 0;border-bottom:1px solid var(--border)">
      <span style="width:100px;font-weight:600;font-size:0.85rem">${d}</span>
      <div class="toggle-wrap">
        <label class="toggle-switch"><input type="checkbox" ${i<5?'checked':''} /><span class="toggle-slider"></span></label>
        <span style="font-size:0.8rem">${i<5?'Open':'Closed'}</span>
      </div>
      ${i<5 ? `
        <input type="time" class="form-control" value="09:00" style="width:130px"/>
        <span style="color:var(--text-muted)">to</span>
        <input type="time" class="form-control" value="21:00" style="width:130px"/>
      ` : `<span style="font-size:0.8rem;color:var(--text-muted)">Closed all day</span>`}
    </div>
  `).join('');
}

// ===== ACTION FUNCTIONS =====
function filterOrders(status, btn) {
  currentOrderFilter = status;
  document.querySelectorAll('.order-status-bar .order-status-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderOrdersTable(status);
}

function filterProducts(search, cat) {
  showToast('Filtering products...','info');
}

function filterStatus(status, btn) {
  document.querySelectorAll('#section-products .order-status-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showToast(`Showing ${status} products`,'info');
}

function filterReviews(filter, btn) {
  document.querySelectorAll('#section-reviews .period-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderReviews(filter);
}

function switchBannerTab(tab, btn) {
  document.querySelectorAll('#section-banners .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderBanners(tab);
}

function switchProdTab(tab, btn) {
  document.querySelectorAll('#modal-add-product .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#modal-add-product .tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('prod-tab-' + tab).classList.add('active');
}

function switchSettingsTab(tab, btn) {
  document.querySelectorAll('#section-settings .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#section-settings .tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('settings-' + tab).classList.add('active');
}

function switchChartPeriod(period, btn) {
  document.querySelectorAll('#section-dashboard .report-period-btns .period-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showToast(`Switched to ${period} view`,'info');
}

function updateOrderStatus() { showToast('Order status updated!','success'); closeModal('modal-order-detail'); }
function updateOrderStatusInline(id, status) { showToast(`Order ${id} → ${status}`,'success'); }
function printInvoice() { showToast('Invoice sent to printer!','info'); }
function saveProduct() { showToast('Product published successfully!','success'); closeModal('modal-add-product'); }
function editProduct(id) { showToast(`Editing product #${id}`,'info'); }
function deleteProduct(id) { if(confirm('Delete this product?')) showToast('Product deleted!','error'); }
function duplicateProduct(id) { showToast('Product duplicated!','success'); }
function toggleProductStatus(id, el) { showToast(`Product ${el.checked?'activated':'deactivated'}`,'success'); }
function addCategory() { showToast('Category added!','success'); closeModal('modal-add-cat'); }
function addSubcategory() { showToast('Subcategory added!','success'); closeModal('modal-add-subcat'); }
function createCoupon() { showToast('Coupon created!','success'); closeModal('modal-add-coupon'); }
function uploadBanner() { showToast('Banner uploaded!','success'); closeModal('modal-add-banner'); }
function addPaymentAccount() { showToast('Payment account added!','success'); closeModal('modal-add-payment-acc'); }
function addShippingZone() { showToast('Shipping zone added!','success'); closeModal('modal-add-zone'); }
function approvePayment() { showToast('Payment approved!','success'); closeModal('modal-payment-verify'); }
function rejectPayment() { showToast('Payment rejected!','error'); closeModal('modal-payment-verify'); }
function approvePaymentItem(i) { showToast(`Payment from ${PAYMENT_VERIFICATIONS[i].customer} approved!`,'success'); }
function rejectPaymentItem(i) { showToast(`Payment from ${PAYMENT_VERIFICATIONS[i].customer} rejected!`,'error'); }
function openReplyModal(id) { showToast(`Replying to review #${id}`,'info'); }
function toggleCustomerBlock(name, btn) { showToast(`${name} status toggled`,'warning'); }
function markRead(i) { DUMMY_NOTIFICATIONS[i].read = true; renderNotifications(); }
function markAllRead() { DUMMY_NOTIFICATIONS.forEach(n => n.read = true); renderNotifications(); showToast('All notifications marked as read','success'); }
function genCouponCode() { document.getElementById('coupon-code-input').value = 'SAVE'+Math.floor(Math.random()*90+10); }
function addTag(e) { if(e.key==='Enter'||e.key===',') { const v=e.target.value.trim().replace(',',''); if(v){const chip=document.createElement('span');chip.className='chip';chip.innerHTML=`${v} <i class="fas fa-times" onclick="removeTag(this)"></i>`;document.getElementById('tag-input-wrap').insertBefore(chip,e.target);e.target.value='';} e.preventDefault(); } }
function removeTag(el) { el.parentElement.remove(); }
function saveSettings() { showToast('Shop settings saved!','success'); }

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initSalesChart();
  initRevenueDonut();
  initReportTrend();
  renderLowStock();
  renderRecentOrders();
  renderProductsTable();
  renderOrdersTable();
  renderCategoriesTable();
  renderPayments();
  renderShipping();
  renderCoupons();
  renderCustomers();
  renderReviews();
  renderBanners('hero');
  renderNotifications();
  renderChat();
  renderBestSellers();
  renderBusinessHours();
});

// ===== HELPERS =====
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
