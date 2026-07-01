/* ================================================
   DIU STARTUP – Super Admin Panel JavaScript
   Platform-wide data + all interactive features
================================================ */

// ===== DUMMY DATA =====
const SHOPS = [
  { id:1, name:'DIU Startup', owner:'Nurunnabi Reachad', category:'Mixed', products:48, orders:246, revenue:2400000, commission:6, status:'active', color:'#6366f1', joined:'Jan 2024' },
  { id:2, name:'TechBD Store', owner:'Arif Rahman', category:'Electronics', products:32, orders:180, revenue:1850000, commission:5, status:'active', color:'#3b82f6', joined:'Feb 2024' },
  { id:3, name:'FashionHub BD', owner:'Sumaiya Khatun', category:'Fashion', products:95, orders:312, revenue:980000, commission:8, status:'active', color:'#ec4899', joined:'Mar 2024' },
  { id:4, name:'BeautyGlow', owner:'Nadia Akter', category:'Beauty', products:28, orders:145, revenue:620000, commission:10, status:'pending', color:'#f59e0b', joined:'May 2024' },
  { id:5, name:'SportZone BD', owner:'Sabbir Ahmed', category:'Sports', products:15, orders:62, revenue:280000, commission:7, status:'pending', color:'#10b981', joined:'Jun 2024' },
  { id:6, name:'HomeDecor Plus', owner:'Mitu Begum', category:'Home & Living', products:40, orders:0, revenue:0, commission:6, status:'suspended', color:'#ef4444', joined:'Jun 2024' },
];

const SELLERS = [
  { name:'Nurunnabi Reachad', shop:'DIU Startup', phone:'01712-345678', nid:'19XXXXXXXXXX', joined:'Jan 2024', status:'verified', color:'#6366f1' },
  { name:'Arif Rahman', shop:'TechBD Store', phone:'01812-987654', nid:'20XXXXXXXXXX', joined:'Feb 2024', status:'verified', color:'#3b82f6' },
  { name:'Sumaiya Khatun', shop:'FashionHub BD', phone:'01611-456123', nid:'21XXXXXXXXXX', joined:'Mar 2024', status:'verified', color:'#ec4899' },
  { name:'Nadia Akter', shop:'BeautyGlow', phone:'01911-234567', nid:'22XXXXXXXXXX', joined:'May 2024', status:'pending', color:'#f59e0b' },
  { name:'Sabbir Ahmed', shop:'SportZone BD', phone:'01511-765432', nid:'Not Submitted', joined:'Jun 2024', status:'pending', color:'#10b981' },
  { name:'Karim Mia', shop:'—', phone:'01612-111222', nid:'23XXXXXXXXXX', joined:'Jun 2024', status:'rejected', color:'#ef4444' },
];

const USERS = [
  { name:'Rahim Uddin', phone:'01712-345678', email:'rahim@gmail.com', orders:8, spent:342000, joined:'Jan 2024', status:'active', color:'#e53935' },
  { name:'Fatima Khatun', phone:'01812-987654', email:'fatima@gmail.com', orders:3, spent:86000, joined:'Feb 2024', status:'active', color:'#8e24aa' },
  { name:'Arif Hossain', phone:'01611-456123', email:'arif@gmail.com', orders:12, spent:510000, joined:'Mar 2024', status:'active', color:'#1976d2' },
  { name:'Mitu Akter', phone:'01911-234567', email:'mitu@gmail.com', orders:2, spent:25000, joined:'Apr 2024', status:'active', color:'#00897b' },
  { name:'Sabbir Ahmed', phone:'01511-765432', email:'sabbir@gmail.com', orders:1, spent:14999, joined:'May 2024', status:'blocked', color:'#ef4444' },
  { name:'Nadia Islam', phone:'01712-111222', email:'nadia@gmail.com', orders:7, spent:186000, joined:'Jun 2024', status:'active', color:'#f57c00' },
];

const ORDERS = [
  { id:'#ORD-2401', shop:'DIU Startup', customer:'Rahim Uddin', amount:149999, commission:8999, payment:'bKash', status:'pending', date:'30 Jun 2024' },
  { id:'#ORD-2400', shop:'TechBD Store', customer:'Fatima Khatun', amount:38999, commission:2339, payment:'COD', status:'confirmed', date:'29 Jun 2024' },
  { id:'#ORD-2399', shop:'FashionHub BD', customer:'Arif Hossain', amount:89999, commission:7199, payment:'Nagad', status:'shipped', date:'28 Jun 2024' },
  { id:'#ORD-2398', shop:'DIU Startup', customer:'Mitu Akter', amount:12998, commission:779, payment:'COD', status:'delivered', date:'27 Jun 2024' },
  { id:'#ORD-2397', shop:'BeautyGlow', customer:'Sabbir Ahmed', amount:14999, commission:1499, payment:'bKash', status:'cancelled', date:'26 Jun 2024' },
  { id:'#ORD-2396', shop:'TechBD Store', customer:'Nadia Islam', amount:6696, commission:334, payment:'Nagad', status:'delivered', date:'25 Jun 2024' },
  { id:'#ORD-2395', shop:'FashionHub BD', customer:'Karim Mia', amount:4500, commission:450, payment:'bKash', status:'returned', date:'24 Jun 2024' },
];

const PRODUCTS = [
  { name:'Samsung Galaxy S24', shop:'DIU Startup', category:'Electronics', price:149999, stock:45, status:'approved' },
  { name:'Sony Headphones XM5', shop:'DIU Startup', category:'Electronics', price:29999, stock:72, status:'approved' },
  { name:'Summer Floral Dress', shop:'FashionHub BD', category:'Fashion', price:2499, stock:120, status:'pending' },
  { name:'Vitamin C Serum', shop:'BeautyGlow', category:'Beauty', price:899, stock:200, status:'pending' },
  { name:'Running Shoes Pro', shop:'SportZone BD', category:'Sports', price:5999, stock:35, status:'approved' },
  { name:'Fake Brand Bag', shop:'HomeDecor Plus', category:'Fashion', price:999, stock:50, status:'flagged' },
  { name:'Smart Watch Ultra', shop:'TechBD Store', category:'Electronics', price:22999, stock:18, status:'approved' },
];

const CATEGORIES = [
  { name:'Electronics', icon:'fas fa-mobile-alt', subcats:4, products:180, active:true },
  { name:'Fashion', icon:'fas fa-tshirt', subcats:6, products:320, active:true },
  { name:'Beauty', icon:'fas fa-magic', subcats:3, products:95, active:true },
  { name:'Sports', icon:'fas fa-running', subcats:2, products:48, active:true },
  { name:'Home & Living', icon:'fas fa-couch', subcats:5, products:72, active:true },
  { name:'Books', icon:'fas fa-book', subcats:3, products:0, active:false },
];

const SUBCATEGORIES = [
  { name:'Smartphones', parent:'Electronics', products:80 },
  { name:'Laptops', parent:'Electronics', products:42 },
  { name:'Audio', parent:'Electronics', products:35 },
  { name:'Clothing', parent:'Fashion', products:150 },
  { name:'Footwear', parent:'Fashion', products:88 },
  { name:'Bags', parent:'Fashion', products:55 },
  { name:'Fragrances', parent:'Beauty', products:40 },
  { name:'Skincare', parent:'Beauty', products:32 },
];

const PAYMENTS_DATA = [
  { txnId:'BK123456', order:'#ORD-2401', shop:'DIU Startup', customer:'Rahim Uddin', method:'bKash', amount:149999, commission:8999, status:'received', date:'30 Jun 2024' },
  { txnId:'NG789012', order:'#ORD-2399', shop:'FashionHub BD', customer:'Arif Hossain', method:'Nagad', amount:89999, commission:7199, status:'received', date:'28 Jun 2024' },
  { txnId:'—', order:'#ORD-2400', shop:'TechBD Store', customer:'Fatima Khatun', method:'COD', amount:38999, commission:2339, status:'pending', date:'29 Jun 2024' },
  { txnId:'BK000001', order:'#ORD-2397', shop:'BeautyGlow', customer:'Sabbir Ahmed', method:'bKash', amount:14999, commission:1499, status:'rejected', date:'26 Jun 2024' },
  { txnId:'NG345678', order:'#ORD-2396', shop:'TechBD Store', customer:'Nadia Islam', method:'Nagad', amount:6696, commission:334, status:'received', date:'25 Jun 2024' },
];

const COMMISSIONS = [
  { shop:'DIU Startup', rate:6, cap:0, thisMonth:144000, paid:118000, status:'active' },
  { shop:'TechBD Store', rate:5, cap:500000, thisMonth:92500, paid:92500, status:'active' },
  { shop:'FashionHub BD', rate:8, cap:0, thisMonth:78400, paid:50000, status:'partial' },
  { shop:'BeautyGlow', rate:10, cap:200000, thisMonth:62000, paid:0, status:'pending' },
];

const COMMISSION_PAYOUTS = [
  { period:'Jun 2024', shop:'DIU Startup', sales:2400000, rate:6, commission:144000, status:'paid', paidOn:'01 Jul 2024' },
  { period:'Jun 2024', shop:'TechBD Store', sales:1850000, rate:5, commission:92500, status:'paid', paidOn:'01 Jul 2024' },
  { period:'Jun 2024', shop:'FashionHub BD', sales:980000, rate:8, commission:78400, status:'partial', paidOn:'—' },
  { period:'May 2024', shop:'DIU Startup', sales:1900000, rate:6, commission:114000, status:'paid', paidOn:'01 Jun 2024' },
];

const ADMINS = [
  { name:'Super Admin', role:'Super Admin', email:'superadmin@diustartup.com', lastLogin:'Just now', status:'active', color:'#6366f1' },
  { name:'Rashida Begum', role:'Editor', email:'rashida@diustartup.com', lastLogin:'2 hours ago', status:'active', color:'#10b981' },
  { name:'Forhad Hossain', role:'Moderator', email:'forhad@diustartup.com', lastLogin:'Yesterday', status:'active', color:'#3b82f6' },
  { name:'Lima Akter', role:'Support', email:'lima@diustartup.com', lastLogin:'3 days ago', status:'inactive', color:'#f59e0b' },
];

const NOTIFICATIONS = [
  { type:'shop', icon:'fas fa-store', bg:'#e0e7ff', color:'#4338ca', title:'New Shop Registration', desc:'SportZone BD applied for a new shop. Pending your approval.', time:'5 min ago', read:false },
  { type:'seller', icon:'fas fa-user-tie', bg:'#fef3c7', color:'#b45309', title:'Seller Verification Pending', desc:'Sabbir Ahmed submitted NID for SportZone BD.', time:'1 hour ago', read:false },
  { type:'product', icon:'fas fa-exclamation-triangle', bg:'#fee2e2', color:'#dc2626', title:'Product Flagged', desc:'A product in HomeDecor Plus was flagged for policy violation.', time:'2 hours ago', read:false },
  { type:'order', icon:'fas fa-shopping-bag', bg:'#dbeafe', color:'#1d4ed8', title:'High Value Order', desc:'Order #ORD-2401 worth ৳149,999 placed on DIU Startup.', time:'3 hours ago', read:false },
  { type:'payment', icon:'fas fa-taka-sign', bg:'#d1fae5', color:'#059669', title:'Commission Received', desc:'Monthly commission of ৳144,000 from DIU Startup confirmed.', time:'5 hours ago', read:true },
  { type:'system', icon:'fas fa-server', bg:'#ede9fe', color:'#7c3aed', title:'System Backup Completed', desc:'Daily database backup completed successfully at 3:00 AM.', time:'Yesterday', read:true },
  { type:'review', icon:'fas fa-star', bg:'#fef3c7', color:'#b45309', title:'Negative Review Alert', desc:'A 1-star review was posted on TechBD Store. Seller notified.', time:'Yesterday', read:true },
  { type:'security', icon:'fas fa-shield-alt', bg:'#fee2e2', color:'#dc2626', title:'Failed Login Attempt', desc:'5 failed login attempts from IP 103.xxx.xx.xx blocked.', time:'2 days ago', read:true },
];

const ACTIVITY_LOGS = [
  { time:'2026-07-01 19:05:22', admin:'Super Admin', action:'Approved', module:'Shop', detail:'Approved FashionHub BD shop', ip:'192.168.1.1' },
  { time:'2026-07-01 18:44:10', admin:'Rashida Begum', action:'Updated', module:'Product', detail:'Updated Samsung Galaxy S24 price', ip:'192.168.1.5' },
  { time:'2026-07-01 17:22:38', admin:'Forhad Hossain', action:'Suspended', module:'User', detail:'Blocked user Sabbir Ahmed', ip:'192.168.1.8' },
  { time:'2026-07-01 16:11:50', admin:'Super Admin', action:'Created', module:'Coupon', detail:'Created coupon PLATFORM20', ip:'192.168.1.1' },
  { time:'2026-07-01 14:30:05', admin:'Lima Akter', action:'Replied', module:'Review', detail:'Replied to review on DIU Startup', ip:'192.168.1.12' },
  { time:'2026-07-01 13:05:17', admin:'Super Admin', action:'Deleted', module:'Product', detail:'Removed flagged product from HomeDecor Plus', ip:'192.168.1.1' },
  { time:'2026-07-01 11:45:00', admin:'Rashida Begum', action:'Published', module:'CMS', detail:'Published updated Privacy Policy page', ip:'192.168.1.5' },
];

const ACTIVITY_FEED = [
  { icon:'fas fa-store', bg:'#e0e7ff', color:'#4338ca', title:'New shop "SportZone BD" registered, pending approval', meta:'5 min ago' },
  { icon:'fas fa-shopping-bag', bg:'#dbeafe', color:'#1d4ed8', title:'Order #ORD-2401 placed on DIU Startup (৳149,999)', meta:'15 min ago' },
  { icon:'fas fa-user-plus', bg:'#d1fae5', color:'#059669', title:'22 new users registered this week', meta:'1 hour ago' },
  { icon:'fas fa-exclamation-triangle', bg:'#fee2e2', color:'#dc2626', title:'Product flagged for policy violation in HomeDecor Plus', meta:'2 hours ago' },
  { icon:'fas fa-taka-sign', bg:'#d1fae5', color:'#059669', title:'Commission payment ৳144,000 received from DIU Startup', meta:'5 hours ago' },
  { icon:'fas fa-star', bg:'#fef3c7', color:'#b45309', title:'Platform rating updated to 4.6 ⭐ (1,240 reviews)', meta:'Yesterday' },
];

const SYSTEM_ALERTS = [
  { type:'danger', icon:'fas fa-box-open', msg:'7 products pending review across 3 shops' },
  { type:'warning', icon:'fas fa-user-clock', msg:'3 new shops awaiting approval' },
  { type:'warning', icon:'fas fa-user-tie', msg:'5 sellers pending verification' },
  { type:'danger', icon:'fas fa-flag', msg:'1 product flagged for policy violation' },
];

const CMS_PAGES = [
  { title:'About Us', icon:'fas fa-info-circle', active:true },
  { title:'Privacy Policy', icon:'fas fa-shield-alt', active:false },
  { title:'Terms & Conditions', icon:'fas fa-file-contract', active:false },
  { title:'Return Policy', icon:'fas fa-undo', active:false },
  { title:'How It Works', icon:'fas fa-question-circle', active:false },
  { title:'FAQ', icon:'fas fa-comments', active:false },
  { title:'Contact Us', icon:'fas fa-envelope', active:false },
  { title:'Shipping Info', icon:'fas fa-truck', active:false },
];

const COUPONS_DATA = [
  { code:'PLATFORM20', type:'percent', value:20, shops:'All Shops', minOrder:1000, used:89, limit:500, expiry:'31 Dec 2024', active:true },
  { code:'NEWSHOP50', type:'fixed', value:50, shops:'DIU Startup', minOrder:500, used:12, limit:100, expiry:'31 Jul 2024', active:true },
  { code:'WELCOME15', type:'percent', value:15, shops:'All Shops', minOrder:0, used:245, limit:1000, expiry:'31 Aug 2024', active:true },
  { code:'FLASH40', type:'percent', value:40, shops:'TechBD Store', minOrder:5000, used:500, limit:500, expiry:'30 Jun 2024', active:false },
];

const ROLE_PERMISSIONS = {
  Editor:   { shops:[1,0,0], products:[1,1,1], orders:[1,0,0], users:[1,0,0], reports:[1,0,0], settings:[0,0,0] },
  Moderator:{ shops:[1,0,0], products:[1,1,1], orders:[1,1,0], users:[1,1,0], reports:[1,0,0], settings:[0,0,0] },
  Support:  { shops:[1,0,0], products:[1,0,0], orders:[1,0,0], users:[1,0,0], reports:[0,0,0], settings:[0,0,0] },
};
const PERM_MODULES = ['Shops','Products','Orders','Users','Reports','Settings'];
const PERM_ACTIONS = ['View','Edit','Delete'];

// ===== STATE =====
let sidebarCollapsed = false;

// ===== NAVIGATION =====
function showSection(name, navEl) {
  document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('section-' + name);
  if (panel) panel.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navEl) navEl.classList.add('active');
  const titles = {
    dashboard:'Platform Dashboard', shops:'Shop Management', sellers:'Seller Management',
    users:'User / Customer Management', orders:'All Orders', products:'Product Management',
    categories:'Category Management', payments:'Payments Overview', commission:'Commission Management',
    reports:'Reports & Analytics', banners:'Banner Management', coupons:'Platform Coupons',
    content:'CMS / Pages', admins:'Admin Management', notifications:'Notifications',
    logs:'Activity Logs', settings:'Platform Settings',
  };
  document.getElementById('page-title-text').textContent = titles[name] || name;
}

function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed', sidebarCollapsed);
  document.getElementById('main-content').classList.toggle('expanded', sidebarCollapsed);
}

// ===== MODALS =====
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open')); });
document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); }));

// ===== TOAST =====
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  const icons = { success:'check-circle', error:'times-circle', warning:'exclamation-triangle', info:'info-circle' };
  const t = document.createElement('div');
  t.className = `toast-msg ${type}`;
  t.innerHTML = `<i class="fas fa-${icons[type] || 'check-circle'}"></i> ${msg}`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(60px)'; t.style.transition = '.3s'; setTimeout(() => t.remove(), 350); }, 3500);
}

// ===== CHARTS =====
function initPlatformRevenueChart() {
  const ctx = document.getElementById('platformRevenueChart');
  if (!ctx) return;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label:'Total Revenue (৳)', data:[820000,1240000,1080000,1650000,2100000,4860000,3200000,2800000,3600000,4200000,3900000,4860000], backgroundColor:'rgba(99,102,241,0.35)', borderColor:'rgba(99,102,241,1)', borderWidth:2, borderRadius:6 },
        { label:'Commission (৳)', data:[49200,74400,64800,99000,126000,291600,192000,168000,216000,252000,234000,291600], type:'line', borderColor:'#10b981', backgroundColor:'rgba(16,185,129,0.08)', fill:true, tension:0.4, borderWidth:2.5, pointRadius:4, pointBackgroundColor:'#10b981', yAxisID:'y2' },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position:'bottom', labels: { font:{size:11}, padding:14 } } },
      scales: {
        y: { beginAtZero:true, grid:{color:'rgba(0,0,0,0.04)'}, ticks:{callback:v=>'৳'+(v/100000).toFixed(1)+'L'} },
        y2: { position:'right', beginAtZero:true, grid:{display:false}, ticks:{color:'#10b981', callback:v=>'৳'+(v/1000).toFixed(0)+'K'} },
        x: { grid:{display:false} }
      }
    }
  });
}

function initShopOrdersChart() {
  const ctx = document.getElementById('shopOrdersChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: SHOPS.filter(s=>s.orders>0).map(s=>s.name),
      datasets: [{ data: SHOPS.filter(s=>s.orders>0).map(s=>s.orders), backgroundColor:['#6366f1','#3b82f6','#ec4899','#f59e0b','#10b981'], borderWidth:0, hoverOffset:8 }]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{padding:12,font:{size:11}} } }, cutout:'65%' }
  });
}

function initReportTrend() {
  const ctx = document.getElementById('reportTrendChart');
  if (!ctx) return;
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: days,
      datasets: [
        { label:'Revenue (৳)', data:[182000,296000,148000,412000,284000,540000,398000], borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,0.1)', fill:true, tension:0.4, borderWidth:2.5, pointRadius:5, pointBackgroundColor:'#6366f1' },
        { label:'Commission (৳)', data:[10920,17760,8880,24720,17040,32400,23880], borderColor:'#10b981', fill:false, tension:0.4, borderWidth:2, pointRadius:4, pointBackgroundColor:'#10b981', yAxisID:'y2' },
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{legend:{position:'bottom',labels:{font:{size:11},padding:12}}},
      scales:{
        y:{beginAtZero:true,grid:{color:'rgba(0,0,0,0.04)'},ticks:{callback:v=>'৳'+(v/1000).toFixed(0)+'K'}},
        y2:{position:'right',beginAtZero:true,grid:{display:false},ticks:{color:'#10b981',callback:v=>'৳'+(v/1000).toFixed(0)+'K'}},
        x:{grid:{display:false}}
      }
    }
  });
}

// ===== RENDER FUNCTIONS =====

function renderTopShops() {
  const el = document.getElementById('top-shops-list');
  if (!el) return;
  const sorted = [...SHOPS].filter(s=>s.revenue>0).sort((a,b)=>b.revenue-a.revenue).slice(0,4);
  el.innerHTML = sorted.map((s,i) => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:1rem;font-weight:900;color:${i<3?'var(--warning)':'var(--text-muted)'};width:22px;flex-shrink:0">${i+1}</span>
      <div class="shop-avatar" style="background:${s.color};width:36px;height:36px;border-radius:8px;font-size:0.75rem">${s.name.slice(0,2).toUpperCase()}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:0.82rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.name}</div>
        <div style="font-size:0.7rem;color:var(--text-muted)">${s.orders} orders</div>
      </div>
      <strong style="color:var(--primary);font-size:0.83rem">৳${(s.revenue/100000).toFixed(1)}L</strong>
    </div>
  `).join('') + `<div style="padding-top:10px;border-bottom:none!important"></div>`;
}

function renderSystemAlerts() {
  const el = document.getElementById('system-alerts-list');
  if (!el) return;
  el.innerHTML = SYSTEM_ALERTS.map(a => `
    <div class="alert-box ${a.type}" style="margin-bottom:8px">
      <i class="${a.icon}"></i> ${a.msg}
    </div>
  `).join('');
}

function renderActivityFeed() {
  const el = document.getElementById('activity-feed-el');
  if (!el) return;
  el.innerHTML = ACTIVITY_FEED.map(a => `
    <div class="activity-item">
      <div class="activity-dot" style="background:${a.bg}"><i class="${a.icon}" style="color:${a.color}"></i></div>
      <div class="activity-body">
        <div class="act-title">${a.title}</div>
        <div class="act-meta"><i class="fas fa-clock" style="font-size:0.6rem"></i> ${a.meta}</div>
      </div>
    </div>
  `).join('');
}

function renderShopsTable(filter = 'all') {
  const tbody = document.getElementById('shops-tbody');
  if (!tbody) return;
  const statusBadge = { active:'badge-success', pending:'badge-warning', suspended:'badge-danger' };
  const filtered = filter === 'all' ? SHOPS : SHOPS.filter(s => s.status === filter);
  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="shop-avatar" style="background:${s.color}">${s.name.slice(0,2).toUpperCase()}</div>
          <div>
            <div style="font-weight:700;font-size:0.85rem">${s.name}</div>
            <div style="font-size:0.7rem;color:var(--text-muted)">Joined ${s.joined}</div>
          </div>
        </div>
      </td>
      <td style="font-size:0.82rem">${s.owner}</td>
      <td><span class="tag">${s.category}</span></td>
      <td>${s.products}</td>
      <td>${s.orders}</td>
      <td><strong>৳${s.revenue>0?(s.revenue/100000).toFixed(1)+'L':'—'}</strong></td>
      <td><span class="badge badge-indigo">${s.commission}%</span></td>
      <td><span class="badge ${statusBadge[s.status]}">${capitalize(s.status)}</span></td>
      <td>
        <div style="display:flex;gap:5px">
          ${s.status==='pending' ? `<button class="btn btn-xs btn-success" onclick="approveShop('${s.name}')"><i class="fas fa-check"></i> Approve</button><button class="btn btn-xs btn-danger" onclick="rejectShop('${s.name}')"><i class="fas fa-times"></i> Reject</button>` : ''}
          <button class="btn btn-icon btn-outline btn-sm" onclick="viewShop('${s.name}')"><i class="fas fa-eye"></i></button>
          <button class="btn btn-icon btn-sm ${s.status==='active'?'':'btn-success'}" style="${s.status!=='suspended'?'background:#fee2e2;color:#991b1b':''}" onclick="toggleShop('${s.name}',${s.id})"><i class="fas ${s.status==='suspended'?'fa-check':'fa-ban'}"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderSellersTable(filter = 'all') {
  const tbody = document.getElementById('sellers-tbody');
  if (!tbody) return;
  const statusBadge = { verified:'badge-success', pending:'badge-warning', rejected:'badge-danger' };
  const filtered = filter === 'all' ? SELLERS : SELLERS.filter(s => s.status === filter);
  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="avatar-circle" style="background:${s.color}">${s.name[0]}</div>
          <div>
            <div style="font-weight:600;font-size:0.83rem">${s.name}</div>
            <div style="font-size:0.7rem;color:var(--text-muted)">${s.joined}</div>
          </div>
        </div>
      </td>
      <td style="font-size:0.82rem">${s.shop}</td>
      <td style="font-size:0.82rem">${s.phone}</td>
      <td><code style="font-size:0.72rem;background:#f1f5f9;padding:2px 8px;border-radius:4px">${s.nid}</code></td>
      <td style="font-size:0.75rem;color:var(--text-muted)">${s.joined}</td>
      <td><span class="badge ${statusBadge[s.status]}">${capitalize(s.status)}</span></td>
      <td>
        <div style="display:flex;gap:5px">
          ${s.status==='pending' ? `<button class="btn btn-xs btn-success" onclick="verifySeller('${s.name}')"><i class="fas fa-check"></i> Verify</button><button class="btn btn-xs btn-danger" onclick="rejectSeller('${s.name}')"><i class="fas fa-times"></i> Reject</button>` : ''}
          <button class="btn btn-icon btn-outline btn-sm"><i class="fas fa-eye"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderUsersTable() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;
  tbody.innerHTML = USERS.map(u => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="avatar-circle" style="background:${u.color}">${u.name[0]}</div>
          <div>
            <div style="font-weight:600;font-size:0.83rem">${u.name}</div>
            <div style="font-size:0.7rem;color:var(--text-muted)">${u.email}</div>
          </div>
        </div>
      </td>
      <td>${u.phone}</td>
      <td><span class="badge badge-info">${u.orders}</span></td>
      <td><strong>৳${u.spent.toLocaleString('en-IN')}</strong></td>
      <td style="font-size:0.75rem;color:var(--text-muted)">${u.joined}</td>
      <td><span class="badge ${u.status==='active'?'badge-success':'badge-danger'}">${capitalize(u.status)}</span></td>
      <td>
        <div style="display:flex;gap:5px">
          <button class="btn btn-icon btn-outline btn-sm"><i class="fas fa-eye"></i></button>
          <button class="btn btn-xs ${u.status==='active'?'btn-danger':'btn-success'}" onclick="toggleUser('${u.name}')"><i class="fas ${u.status==='active'?'fa-ban':'fa-check'}"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderOrdersTable(filter = 'all') {
  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;
  const statusBadge = { pending:'badge-warning', confirmed:'badge-info', shipped:'badge-indigo', delivered:'badge-success', cancelled:'badge-danger', returned:'badge-gray' };
  const filtered = filter === 'all' ? ORDERS : ORDERS.filter(o => o.status === filter);
  tbody.innerHTML = filtered.map(o => `
    <tr>
      <td><strong style="color:var(--primary)">${o.id}</strong></td>
      <td><span class="tag" style="font-size:0.7rem">${o.shop}</span></td>
      <td>${o.customer}</td>
      <td><strong>৳${o.amount.toLocaleString('en-IN')}</strong></td>
      <td style="color:var(--teal);font-weight:600">৳${o.commission.toLocaleString('en-IN')}</td>
      <td><span class="badge ${o.payment==='COD'?'badge-orange':'badge-info'}" style="font-size:0.63rem">${o.payment}</span></td>
      <td><span class="badge ${statusBadge[o.status]||'badge-gray'}">${capitalize(o.status)}</span></td>
      <td style="font-size:0.75rem;color:var(--text-muted)">${o.date}</td>
      <td><button class="btn btn-sm btn-outline" onclick="showToast('Viewing ${o.id}','info')"><i class="fas fa-eye"></i></button></td>
    </tr>
  `).join('');
}

function renderProductsTable(filter = 'all') {
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;
  const statusBadge = { approved:'badge-success', pending:'badge-warning', rejected:'badge-danger', flagged:'badge-orange' };
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.status === filter);
  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td>
        <div style="font-weight:600;font-size:0.83rem">${p.name}</div>
      </td>
      <td><span class="tag" style="font-size:0.7rem">${p.shop}</span></td>
      <td style="font-size:0.8rem">${p.category}</td>
      <td><strong>৳${p.price.toLocaleString('en-IN')}</strong></td>
      <td><span class="badge ${p.stock===0?'badge-danger':p.stock<10?'badge-warning':'badge-success'}">${p.stock} units</span></td>
      <td><span class="badge ${statusBadge[p.status]||'badge-gray'}">${capitalize(p.status)}</span></td>
      <td>
        <div style="display:flex;gap:5px">
          ${p.status==='pending' ? `<button class="btn btn-xs btn-success" onclick="approveProduct('${p.name}')"><i class="fas fa-check"></i></button><button class="btn btn-xs btn-danger" onclick="rejectProduct('${p.name}')"><i class="fas fa-times"></i></button>` : ''}
          ${p.status==='flagged' ? `<button class="btn btn-xs btn-danger" onclick="removeProduct('${p.name}')"><i class="fas fa-trash"></i> Remove</button>` : ''}
          <button class="btn btn-icon btn-outline btn-sm"><i class="fas fa-eye"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderCategoriesTable() {
  const tbody = document.getElementById('cats-tbody');
  if (tbody) {
    tbody.innerHTML = CATEGORIES.map(c => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td><i class="${c.icon}" style="color:var(--primary)"></i></td>
        <td>${c.subcats}</td>
        <td>${c.products}</td>
        <td><span class="badge ${c.active?'badge-success':'badge-danger'}">${c.active?'Active':'Inactive'}</span></td>
        <td><div style="display:flex;gap:5px"><button class="btn btn-icon btn-outline btn-sm"><i class="fas fa-edit"></i></button><button class="btn btn-icon btn-sm" style="background:#fee2e2;color:#991b1b"><i class="fas fa-trash"></i></button></div></td>
      </tr>
    `).join('');
  }
  const stbody = document.getElementById('subcats-tbody');
  if (stbody) {
    stbody.innerHTML = SUBCATEGORIES.map(s => `
      <tr>
        <td><strong>${s.name}</strong></td>
        <td><span class="tag" style="font-size:0.7rem">${s.parent}</span></td>
        <td>${s.products}</td>
        <td><div style="display:flex;gap:5px"><button class="btn btn-icon btn-outline btn-sm"><i class="fas fa-edit"></i></button><button class="btn btn-icon btn-sm" style="background:#fee2e2;color:#991b1b"><i class="fas fa-trash"></i></button></div></td>
      </tr>
    `).join('');
  }
}

function renderPaymentsTable() {
  const tbody = document.getElementById('payments-tbody');
  if (!tbody) return;
  const statusBadge = { received:'badge-success', pending:'badge-warning', rejected:'badge-danger', refunded:'badge-purple' };
  tbody.innerHTML = PAYMENTS_DATA.map(p => `
    <tr>
      <td><code style="font-size:0.72rem;background:#f1f5f9;padding:2px 8px;border-radius:4px">${p.txnId}</code></td>
      <td><strong style="color:var(--primary)">${p.order}</strong></td>
      <td><span class="tag" style="font-size:0.7rem">${p.shop}</span></td>
      <td>${p.customer}</td>
      <td><span class="badge badge-info" style="font-size:0.63rem">${p.method}</span></td>
      <td><strong>৳${p.amount.toLocaleString('en-IN')}</strong></td>
      <td style="color:var(--teal);font-weight:600">৳${p.commission.toLocaleString('en-IN')}</td>
      <td><span class="badge ${statusBadge[p.status]}">${capitalize(p.status)}</span></td>
      <td style="font-size:0.75rem;color:var(--text-muted)">${p.date}</td>
    </tr>
  `).join('');
}

function renderCommission() {
  const tbody = document.getElementById('commission-tbody');
  if (tbody) {
    tbody.innerHTML = COMMISSIONS.map(c => `
      <tr>
        <td><strong>${c.shop}</strong></td>
        <td><span class="badge badge-indigo">${c.rate}%</span></td>
        <td>${c.cap > 0 ? '৳'+c.cap.toLocaleString() : 'Unlimited'}</td>
        <td>
          <button class="btn btn-icon btn-outline btn-sm" onclick="showToast('Editing ${c.shop} commission','info')"><i class="fas fa-edit"></i></button>
          <button class="btn btn-icon btn-sm" style="background:#fee2e2;color:#991b1b;margin-left:4px" onclick="showToast('Override removed','error')"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
  }
  const ptbody = document.getElementById('payout-tbody');
  if (ptbody) {
    const statusBadge = { paid:'badge-success', partial:'badge-warning', pending:'badge-orange' };
    ptbody.innerHTML = COMMISSION_PAYOUTS.map(p => `
      <tr>
        <td>${p.period}</td>
        <td><span class="tag">${p.shop}</span></td>
        <td>৳${p.sales.toLocaleString('en-IN')}</td>
        <td><span class="badge badge-indigo">${p.rate}%</span></td>
        <td><strong style="color:var(--teal)">৳${p.commission.toLocaleString('en-IN')}</strong></td>
        <td><span class="badge ${statusBadge[p.status]}">${capitalize(p.status)}</span></td>
        <td style="font-size:0.75rem;color:var(--text-muted)">${p.paidOn}</td>
      </tr>
    `).join('');
  }
}

function renderTopShopsReport() {
  const el = document.getElementById('top-shops-report');
  if (!el) return;
  const sorted = [...SHOPS].filter(s=>s.revenue>0).sort((a,b)=>b.revenue-a.revenue);
  el.innerHTML = sorted.map((s,i) => `
    <div style="padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
        <span style="font-size:0.82rem;font-weight:600">${s.name}</span>
        <strong style="color:var(--primary)">৳${(s.revenue/100000).toFixed(1)}L</strong>
      </div>
      <div class="progress-bar-wrap">
        <div class="progress-fill" style="width:${(s.revenue/4860000*100).toFixed(1)}%;background:${s.color}"></div>
      </div>
    </div>
  `).join('');
}

function renderBanners(tab = 'hero') {
  const el = document.getElementById('banners-grid');
  if (!el) return;
  const items = [
    { title:'Summer Mega Sale', type:'hero', active:true },
    { title:'Tech Week 2024', type:'hero', active:true },
    { title:'Back to School', type:'hero', active:false },
    { title:'Weekend Offers', type:'offer', active:true },
    { title:'Flash Sale Alert', type:'popup', active:true },
  ].filter(b => b.type === tab);
  el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px">
    ${items.map(b => `
      <div style="border:2px dashed var(--border);border-radius:var(--radius);overflow:hidden;transition:var(--transition)" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border)'">
        <div style="height:130px;background:linear-gradient(135deg,var(--primary),#818cf8);display:flex;align-items:center;justify-content:center;color:white;font-size:0.88rem;font-weight:600">${b.title}</div>
        <div style="padding:12px;display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:0.8rem;font-weight:600">${b.title}</span>
          <div style="display:flex;align-items:center;gap:8px">
            <label class="toggle-switch"><input type="checkbox" ${b.active?'checked':''} onchange="showToast('Banner updated')"/><span class="toggle-slider"></span></label>
            <button class="btn btn-icon btn-sm" style="background:#fee2e2;color:#991b1b;border-radius:var(--radius-sm);width:28px;height:28px"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    `).join('')}
    <div style="border:2px dashed var(--border);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;min-height:180px;cursor:pointer" onclick="openModal('modal-add-banner')">
      <div style="text-align:center;color:var(--text-muted)"><i class="fas fa-plus" style="font-size:1.8rem;margin-bottom:8px"></i><p style="font-size:0.82rem">Add Banner</p></div>
    </div>
  </div>`;
}

function renderCoupons() {
  const el = document.getElementById('coupons-grid');
  if (!el) return;
  el.innerHTML = COUPONS_DATA.map(c => `
    <div style="background:white;border:1.5px dashed var(--border);border-radius:var(--radius);padding:18px;position:relative;overflow:hidden;transition:var(--transition);${!c.active?'opacity:0.6':''}">
      <div style="position:absolute;top:0;left:0;width:5px;height:100%;background:var(--primary)"></div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <span style="font-family:Courier New,monospace;font-size:1.05rem;font-weight:800;color:var(--primary);letter-spacing:2px">${c.code}</span>
        <span class="badge ${c.active?'badge-success':'badge-gray'}">${c.active?'Active':'Expired'}</span>
      </div>
      <div style="font-size:0.78rem;color:var(--text-muted)">${c.type==='percent'?c.value+'% OFF':'৳'+c.value+' OFF'} · Min ৳${c.minOrder} · ${c.shops}</div>
      <div style="display:flex;gap:14px;margin-top:8px;font-size:0.72rem;color:var(--text-muted)">
        <span><i class="fas fa-users" style="color:var(--primary)"></i> ${c.used}/${c.limit}</span>
        <span><i class="fas fa-calendar" style="color:var(--primary)"></i> ${c.expiry}</span>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-outline btn-sm" onclick="showToast('${c.code} copied!','info')"><i class="fas fa-copy"></i></button>
        <button class="btn btn-outline btn-sm"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm" style="background:#fee2e2;color:#991b1b;border-radius:var(--radius-sm)" onclick="showToast('Coupon deleted!','error')"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}

function renderCMSPages() {
  const el = document.getElementById('cms-page-list');
  if (!el) return;
  el.innerHTML = CMS_PAGES.map((p,i) => `
    <div onclick="selectCmsPage(this,'${p.title}')" style="display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:var(--radius-sm);cursor:pointer;transition:var(--transition);${p.active?'background:var(--primary-light);color:var(--primary)':''}" onmouseover="if(!this.classList.contains('cms-active'))this.style.background='#f8fafc'" onmouseout="if(!this.classList.contains('cms-active'))this.style.background=''">
      <i class="${p.icon}" style="font-size:0.82rem;width:16px;${p.active?'color:var(--primary)':'color:var(--text-muted)'}"></i>
      <span style="font-size:0.82rem;font-weight:${p.active?'700':'500'}">${p.title}</span>
    </div>
  `).join('');
}

function selectCmsPage(el, title) {
  document.querySelectorAll('#cms-page-list > div').forEach(d => { d.style.background=''; d.style.color=''; });
  el.style.background = 'var(--primary-light)';
  el.style.color = 'var(--primary)';
  document.getElementById('cms-edit-title').innerHTML = `<i class="fas fa-file-alt"></i> ${title}`;
  showToast(`Editing: ${title}`,'info');
}

function renderAdminsTable() {
  const tbody = document.getElementById('admins-tbody');
  if (!tbody) return;
  const roleBadge = { 'Super Admin':'badge-indigo', 'Editor':'badge-success', 'Moderator':'badge-info', 'Support':'badge-orange' };
  tbody.innerHTML = ADMINS.map(a => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="avatar-circle" style="background:${a.color}">${a.name[0]}</div>
          <div style="font-weight:600;font-size:0.83rem">${a.name}</div>
        </div>
      </td>
      <td><span class="badge ${roleBadge[a.role]||'badge-gray'}">${a.role}</span></td>
      <td style="font-size:0.8rem">${a.email}</td>
      <td style="font-size:0.75rem;color:var(--text-muted)">${a.lastLogin}</td>
      <td><span class="badge ${a.status==='active'?'badge-success':'badge-gray'}">${capitalize(a.status)}</span></td>
      <td>
        <div style="display:flex;gap:5px">
          ${a.role==='Super Admin' ? '' : `<button class="btn btn-icon btn-outline btn-sm"><i class="fas fa-edit"></i></button><button class="btn btn-icon btn-sm" style="background:#fee2e2;color:#991b1b" onclick="showToast('${a.name} removed','error')"><i class="fas fa-trash"></i></button>`}
        </div>
      </td>
    </tr>
  `).join('');
}

function loadRolePerms(role) {
  const el = document.getElementById('role-perms-content');
  if (!el) return;
  const perms = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['Editor'];
  el.innerHTML = `<table class="perm-table" style="width:100%">
    <thead><tr><th>Module</th>${PERM_ACTIONS.map(a=>`<th style="text-align:center">${a}</th>`).join('')}</tr></thead>
    <tbody>
      ${PERM_MODULES.map((m,mi) => `
        <tr>
          <td>${m}</td>
          ${PERM_ACTIONS.map((a,ai) => {
            const key = m.toLowerCase();
            const val = (perms[key] || [0,0,0])[ai];
            return `<td><div class="perm-check ${val?'on':''}" onclick="togglePerm(this)${val?'':''}"><i class="fas fa-check"></i></div></td>`;
          }).join('')}
        </tr>
      `).join('')}
    </tbody>
  </table>
  <button class="btn btn-primary" style="width:100%;margin-top:14px" onclick="saveRolePerms('${role}')"><i class="fas fa-save"></i> Save Permissions</button>`;
}

function togglePerm(el) {
  el.classList.toggle('on');
}

function renderNotifications() {
  const el = document.getElementById('notif-list');
  if (!el) return;
  el.innerHTML = NOTIFICATIONS.map((n,i) => `
    <div onclick="markRead(${i})" style="display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);cursor:pointer;transition:var(--transition)" onmouseover="this.style.paddingLeft='6px'" onmouseout="this.style.paddingLeft='0'">
      <div style="width:40px;height:40px;border-radius:50%;background:${n.bg};display:flex;align-items:center;justify-content:center;font-size:0.9rem;flex-shrink:0"><i class="${n.icon}" style="color:${n.color}"></i></div>
      <div style="flex:1">
        <div style="font-size:0.83rem;font-weight:600;color:var(--text)">${n.title}${!n.read?'<span style="display:inline-block;width:7px;height:7px;background:var(--primary);border-radius:50%;margin-left:8px;vertical-align:middle"></span>':''}</div>
        <div style="font-size:0.74rem;color:var(--text-muted);margin-top:3px;line-height:1.5">${n.desc}</div>
        <div style="font-size:0.68rem;color:var(--text-muted);margin-top:5px"><i class="fas fa-clock" style="font-size:0.58rem;margin-right:3px"></i>${n.time}</div>
      </div>
    </div>
  `).join('');
}

function renderLogsTable() {
  const tbody = document.getElementById('logs-tbody');
  if (!tbody) return;
  const actionColor = { Approved:'badge-success', Updated:'badge-info', Suspended:'badge-danger', Created:'badge-indigo', Replied:'badge-orange', Deleted:'badge-danger', Published:'badge-success' };
  tbody.innerHTML = ACTIVITY_LOGS.map(l => `
    <tr>
      <td style="font-size:0.76rem;white-space:nowrap;color:var(--text-muted)">${l.time}</td>
      <td><strong style="font-size:0.82rem">${l.admin}</strong></td>
      <td><span class="badge ${actionColor[l.action]||'badge-gray'}">${l.action}</span></td>
      <td><span class="tag" style="font-size:0.7rem">${l.module}</span></td>
      <td style="font-size:0.8rem">${l.detail}</td>
      <td><code style="font-size:0.72rem;background:#f1f5f9;padding:2px 8px;border-radius:4px">${l.ip}</code></td>
    </tr>
  `).join('');
}

// ===== FILTER FUNCTIONS =====
function filterShops(f,btn) { document.querySelectorAll('#section-shops .status-btn').forEach(b=>b.classList.remove('active')); if(btn)btn.classList.add('active'); renderShopsTable(f); }
function filterSellers(f,btn) { document.querySelectorAll('#section-sellers .status-btn').forEach(b=>b.classList.remove('active')); if(btn)btn.classList.add('active'); renderSellersTable(f); }
function filterOrders(f,btn) { document.querySelectorAll('#section-orders .status-btn').forEach(b=>b.classList.remove('active')); if(btn)btn.classList.add('active'); renderOrdersTable(f); }
function filterProducts(f,btn) { document.querySelectorAll('#section-products .status-btn').forEach(b=>b.classList.remove('active')); if(btn)btn.classList.add('active'); renderProductsTable(f); }
function filterOrdersByShop(v) { showToast(v?`Filtered by ${v}`:'Showing all shops','info'); }
function switchBannerTab(tab,btn) { document.querySelectorAll('#section-banners .tab-btn').forEach(b=>b.classList.remove('active')); if(btn)btn.classList.add('active'); renderBanners(tab); }
function switchSettingsTab(tab,btn) {
  document.querySelectorAll('#section-settings .tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('#section-settings .tab-panel').forEach(p=>p.classList.remove('active'));
  if(btn)btn.classList.add('active');
  document.getElementById('settings-'+tab).classList.add('active');
}

// ===== ACTION FUNCTIONS =====
function markRead(i) { NOTIFICATIONS[i].read=true; renderNotifications(); }
function markAllRead() { NOTIFICATIONS.forEach(n=>n.read=true); renderNotifications(); showToast('All notifications marked as read','success'); }
function approveShop(name) { showToast(`✅ ${name} approved!`,'success'); }
function rejectShop(name) { showToast(`❌ ${name} rejected`,'error'); }
function viewShop(name) { showToast(`Viewing ${name}`,'info'); }
function toggleShop(name,id) { showToast(`${name} status toggled`,'warning'); }
function verifySeller(name) { showToast(`✅ ${name} verified as seller!`,'success'); }
function rejectSeller(name) { showToast(`❌ ${name} seller application rejected`,'error'); }
function toggleUser(name) { showToast(`${name} status toggled`,'warning'); }
function approveProduct(name) { showToast(`✅ "${name}" approved!`,'success'); }
function rejectProduct(name) { showToast(`❌ "${name}" rejected`,'error'); }
function removeProduct(name) { if(confirm(`Remove "${name}" from platform?`)) showToast(`"${name}" removed!`,'error'); }
function addShop() { showToast('New shop created!','success'); closeModal('modal-add-shop'); }
function addAdmin() { showToast('Sub-admin created! Invite email sent.','success'); closeModal('modal-add-admin'); }
function inviteSeller() { showToast('Invitation sent to seller!','success'); closeModal('modal-add-seller'); }
function addCategory() { showToast('Category added!','success'); closeModal('modal-add-cat'); }
function addSubcat() { showToast('Subcategory added!','success'); closeModal('modal-add-subcat'); }
function saveShopCommission() { showToast('Commission override saved!','success'); closeModal('modal-shop-commission'); }
function saveCommissionSettings() { showToast('Commission settings saved!','success'); }
function uploadBanner() { showToast('Banner uploaded!','success'); closeModal('modal-add-banner'); }
function createCoupon() { showToast('Platform coupon created!','success'); closeModal('modal-add-coupon'); }
function addCmsPage() { showToast('New page created!','success'); closeModal('modal-add-page'); }
function savePage() { showToast('Page saved and published!','success'); }
function saveRolePerms(role) { showToast(`${role} permissions saved!`,'success'); }
function savePlatformSettings() { showToast('Platform settings saved!','success'); }
function sendBroadcast() { showToast('Broadcast notification sent to all users!','success'); }
function sendNotification() { showToast('Notification sent!','success'); closeModal('modal-send-notif'); }
function genCode() { document.getElementById('coupon-code').value = 'PLAT'+Math.floor(Math.random()*900+100); }

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initPlatformRevenueChart();
  initShopOrdersChart();
  initReportTrend();
  renderTopShops();
  renderSystemAlerts();
  renderActivityFeed();
  renderShopsTable();
  renderSellersTable();
  renderUsersTable();
  renderOrdersTable();
  renderProductsTable();
  renderCategoriesTable();
  renderPaymentsTable();
  renderCommission();
  renderTopShopsReport();
  renderBanners('hero');
  renderCoupons();
  renderCMSPages();
  renderAdminsTable();
  loadRolePerms('Editor');
  renderNotifications();
  renderLogsTable();
});
