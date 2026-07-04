import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/shop-style.css';

// Chart.js registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function ShopLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Sidebar toggle state — starts collapsed on mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  const [activeSection, setActiveSection] = useState('dashboard');
  const isMobile = window.innerWidth < 768;

  // Stats & Dashboard
  const [stats, setStats] = useState({
    totalProducts: 48,
    totalOrders: 246,
    pendingOrders: 7,
    completedOrders: 218,
    cancelledOrders: 21,
    totalRevenue: 240000,
    totalCustomers: 142,
    avgRating: 4.7
  });
  const [lowStockProducts, setLowStockProducts] = useState([
    { id: 1, name: 'Samsung Galaxy S24 Ultra', stock: 15 },
    { id: 2, name: 'Sony WH-1000XM5', stock: 8 }
  ]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlySales, setMonthlySales] = useState([
    45000, 82000, 68000, 95000, 112000, 240000, 180000, 145000, 198000, 220000, 195000, 240000
  ]);

  // Catalog
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productFilterStatus, setProductFilterStatus] = useState('all');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Sales & Orders
  const [orders, setOrders] = useState([]);
  const [orderFilterStatus, setOrderFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Payments
  const [payments, setPayments] = useState([]);
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Shipping
  const [shippingZones, setShippingZones] = useState([]);

  // Coupons
  const [coupons, setCoupons] = useState([]);

  // Banners
  const [banners, setBanners] = useState([]);
  const [bannerTab, setBannerTab] = useState('hero');

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [replyTexts, setReplyTexts] = useState({});

  // Notifications
  const [notifications, setNotifications] = useState([]);

  // Chats
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');

  // Shop Settings Profile
  const [shopProfile, setShopProfile] = useState({
    name: 'DIU Startup Store',
    description: 'Empowering student entrepreneurs.',
    category: 'Mixed',
    contact_email: 'store@diustartup.com',
    contact_phone: '01900-000000',
    address: 'Daffodil Smart City, Savar, Dhaka',
    social_links: { facebook: '', instagram: '', whatsapp: '', youtube: '' },
    business_hours: { weekday: '09:00 AM - 08:00 PM', weekend: '10:00 AM - 06:00 PM' }
  });

  // Modal display toggles
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [showPaymentVerifyModal, setShowPaymentVerifyModal] = useState(false);
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [showAddSubcatModal, setShowAddSubcatModal] = useState(false);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [showAddPaymentAccModal, setShowAddPaymentAccModal] = useState(false);
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);

  // Add Product Modal sub-tab state
  const [prodModalTab, setProdModalTab] = useState('basic');

  // New item inputs
  const [newProduct, setNewProduct] = useState({
    name: '', sku: '', price: '', discount_price: '', cost_price: '', stock: '',
    low_stock_alert: 5, description: '', category: '', brand: '', barcode: '',
    weight: '', is_active: true, is_featured: false, is_flash_sale: false, is_new_arrival: false
  });
  const [newCat, setNewCat] = useState({ name: '', icon: 'fas fa-box', is_active: true });
  const [newSubcat, setNewSubcat] = useState({ name: '', parent: '', icon: 'fas fa-box', is_active: true });
  const [newCoupon, setNewCoupon] = useState({ code: '', discount_type: 'percent', value: '', min_order: 0, usage_limit: 100, expiry_date: '' });
  const [newBanner, setNewBanner] = useState({ title: '', banner_type: 'hero', link_url: '', display_order: 1 });
  const [newPaymentAcc, setNewPaymentAcc] = useState({ method: 'bkash', account_number: '', account_holder: '', bank_name: '', branch_name: '', is_primary: true });
  const [newZone, setNewZone] = useState({ zone_name: '', areas: '', charge: '', free_above: '', delivery_time: '2-3 Days' });

  // ─── EFFECTS ───

  // Fetch initial configuration & core stats
  useEffect(() => {
    fetchDashboardStats();
    fetchProducts();
    fetchCategories();
    fetchBrands();
    fetchOrders();
    fetchPayments();
    fetchPaymentAccounts();
    fetchShippingZones();
    fetchCoupons();
    fetchBanners();
    fetchReviews();
    fetchNotifications();
    fetchChats();
    fetchShopProfile();
  }, []);

  // Fetch chat messages when active conversation changes
  useEffect(() => {
    if (activeChat) {
      API.get(`/chats/${activeChat.id}/messages/`)
        .then(res => setMessages(res.data))
        .catch(() => {
          setMessages([
            { id: 1, sender_name: activeChat.customer_name || 'Customer', text: 'Is this item in stock?', timestamp: '2026-06-30' },
            { id: 2, sender_name: 'You', text: 'Yes, it is!', timestamp: '2026-06-30' }
          ]);
        });
    }
  }, [activeChat]);

  // ─── API HANDLERS ───

  const fetchDashboardStats = () => {
    API.get('/dashboard/seller/')
      .then(res => {
        if (res.data.stats) setStats(prev => ({ ...prev, ...res.data.stats }));
        if (res.data.lowStockAlerts) setLowStockProducts(res.data.lowStockAlerts);
        if (res.data.recentOrders) setRecentOrders(res.data.recentOrders);
        if (res.data.monthlySales) setMonthlySales(res.data.monthlySales);
      })
      .catch(err => console.error('Dashboard Stats API error:', err));
  };

  const fetchProducts = () => {
    API.get('/products/')
      .then(res => setProducts(res.data.results || res.data))
      .catch(() => {
        setProducts([
          { id: 1, name: 'Samsung Galaxy S24 Ultra', sku: 'SM-S24U', price: 149999, discount_price: 139999, stock: 15, category_name: 'Electronics', status: 'active', review_count: 42, avg_rating: 4.8 },
          { id: 2, name: 'Sony WH-1000XM5', sku: 'SONY-XM5', price: 38500, stock: 8, category_name: 'Electronics', status: 'active', review_count: 26, avg_rating: 4.6 }
        ]);
      });
  };

  const fetchCategories = () => {
    API.get('/categories/')
      .then(res => {
        setCategories(res.data);
        // Flatten subcategories
        const sub = [];
        res.data.forEach(c => {
          if (c.children) {
            c.children.forEach(child => {
              sub.push({ ...child, parent_name: c.name });
            });
          }
        });
        setSubcategories(sub);
      })
      .catch(() => {
        const dummyCats = [
          { id: 1, name: 'Electronics', slug: 'electronics', icon: 'fas fa-mobile-alt', is_active: true, children: [
            { id: 3, name: 'Smartphones', slug: 'smartphones', icon: 'fas fa-mobile', is_active: true },
            { id: 4, name: 'Laptops', slug: 'laptops', icon: 'fas fa-laptop', is_active: true }
          ]},
          { id: 2, name: 'Fashion', slug: 'fashion', icon: 'fas fa-tshirt', is_active: true, children: [
            { id: 5, name: 'Clothing', slug: 'clothing', icon: 'fas fa-shirt', is_active: true }
          ]}
        ];
        setCategories(dummyCats);
        const sub = [];
        dummyCats.forEach(c => {
          if (c.children) {
            c.children.forEach(child => {
              sub.push({ ...child, parent_name: c.name });
            });
          }
        });
        setSubcategories(sub);
      });
  };

  const fetchBrands = () => {
    API.get('/products/brands/')
      .then(res => setBrands(res.data))
      .catch(() => setBrands([{ id: 1, name: 'Samsung' }, { id: 2, name: 'Sony' }]));
  };

  const fetchOrders = () => {
    API.get('/orders/')
      .then(res => setOrders(res.data.results || res.data))
      .catch(() => {
        setOrders([
          { id: 1, order_number: 'ORD-2401', customer_name: 'Rahim Uddin', items_count: 2, total: 149999, payment_method: 'bKash', status: 'pending', created_at: '2026-06-30' },
          { id: 2, order_number: 'ORD-2400', customer_name: 'Fatima Khatun', items_count: 1, total: 38500, payment_method: 'COD', status: 'delivered', created_at: '2026-06-28' }
        ]);
      });
  };

  const fetchPayments = () => {
    API.get('/payments/')
      .then(res => setPayments(res.data.results || res.data))
      .catch(() => {
        setPayments([
          { id: 1, order: '#ORD-2401', order_number: 'ORD-2401', customer_name: 'Rahim Uddin', method: 'bKash', amount: 149999, transaction_id: 'BK123456', status: 'pending', created_at: '2026-06-30' }
        ]);
      });
  };

  const fetchPaymentAccounts = () => {
    API.get('/shops/accounts/')
      .then(res => setPaymentAccounts(res.data))
      .catch(() => {
        setPaymentAccounts([
          { id: 1, method: 'bkash', account_number: '01900-000000', account_holder: 'DIU Reachad', is_primary: true }
        ]);
      });
  };

  const fetchShippingZones = () => {
    API.get('/shops/shipping-zones/')
      .then(res => setShippingZones(res.data))
      .catch(() => {
        setShippingZones([
          { id: 1, zone_name: 'Dhaka Metro', areas: 'Mirpur, Gulshan, Dhanmondi, Savar', charge: 60, free_above: 1000, delivery_time: '1-2 Days' }
        ]);
      });
  };

  const fetchCoupons = () => {
    API.get('/coupons/')
      .then(res => setCoupons(res.data.results || res.data))
      .catch(() => {
        setCoupons([
          { id: 1, code: 'PLATFORM20', discount_type: 'percent', value: 20, min_order: 1000, usage_limit: 100, used_count: 5, expiry_date: '2026-12-31', is_active: true }
        ]);
      });
  };

  const fetchBanners = () => {
    API.get('/banners/')
      .then(res => setBanners(res.data.results || res.data))
      .catch(() => {
        setBanners([
          { id: 1, title: 'Summer Mega Sale', banner_type: 'hero', is_active: true },
          { id: 2, title: 'Flash Sale Alert', banner_type: 'popup', is_active: true }
        ]);
      });
  };

  const fetchReviews = () => {
    API.get('/reviews/')
      .then(res => setReviews(res.data.results || res.data))
      .catch(() => {
        setReviews([
          { id: 1, product_name: 'Samsung Galaxy S24 Ultra', user_name: 'Rahim Uddin', rating: 5, comment: 'Awesome phone! Highly recommended.', reply: '', created_at: '2026-06-29' }
        ]);
      });
  };

  const fetchNotifications = () => {
    API.get('/notifications/')
      .then(res => setNotifications(res.data.results || res.data))
      .catch(() => {
        setNotifications([
          { id: 1, notif_type: 'order', title: 'New Order Received', message: 'Order #ORD-2401 has been placed.', is_read: false, created_at: '2026-06-30' }
        ]);
      });
  };

  const fetchChats = () => {
    API.get('/chats/')
      .then(res => setChats(res.data.results || res.data))
      .catch(() => {
        setChats([
          { id: 1, customer_name: 'Rahim Uddin', last_message: { text: 'Is this item in stock?' } }
        ]);
      });
  };

  const fetchShopProfile = () => {
    API.get('/shops/')
      .then(res => {
        const myShop = res.data.results?.[0] || res.data[0];
        if (myShop) {
          setShopProfile(prev => ({
            ...prev,
            name: myShop.name,
            description: myShop.description,
            category: myShop.category,
            contact_email: myShop.contact_email,
            contact_phone: myShop.contact_phone,
            address: myShop.address,
            social_links: myShop.social_links || prev.social_links,
            business_hours: myShop.business_hours || prev.business_hours
          }));
        }
      })
      .catch(err => console.error('Shop Profile API error:', err));
  };

  // ─── SUBMISSION CRUD HANDLERS ───

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/products/', newProduct);
      setProducts(prev => [data, ...prev]);
      setShowAddProductModal(false);
      resetNewProductForm();
      alert('Product created successfully!');
    } catch (err) {
      alert('Error creating product. Please verify fields.');
    }
  };

  const resetNewProductForm = () => {
    setNewProduct({
      name: '', sku: '', price: '', discount_price: '', cost_price: '', stock: '',
      low_stock_alert: 5, description: '', category: '', brand: '', barcode: '',
      weight: '', is_active: true, is_featured: false, is_flash_sale: false, is_new_arrival: false
    });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/categories/', newCat);
      setCategories(prev => [...prev, data]);
      setShowAddCatModal(false);
      setNewCat({ name: '', icon: 'fas fa-box', is_active: true });
    } catch {
      alert('Failed to create category.');
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/categories/', {
        name: newSubcat.name,
        parent: newSubcat.parent,
        icon: newSubcat.icon,
        is_active: newSubcat.is_active
      });
      fetchCategories(); // Reload all categories to correctly display nested tree
      setShowAddSubcatModal(false);
      setNewSubcat({ name: '', parent: '', icon: 'fas fa-box', is_active: true });
    } catch {
      alert('Failed to create subcategory.');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/coupons/', newCoupon);
      setCoupons(prev => [data, ...prev]);
      setShowAddCouponModal(false);
      setNewCoupon({ code: '', discount_type: 'percent', value: '', min_order: 0, usage_limit: 100, expiry_date: '' });
    } catch {
      alert('Failed to create coupon.');
    }
  };

  const handleAddShippingZone = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/shops/shipping-zones/', newZone);
      setShippingZones(prev => [...prev, data]);
      setShowAddZoneModal(false);
      setNewZone({ zone_name: '', areas: '', charge: '', free_above: '', delivery_time: '2-3 Days' });
    } catch {
      alert('Failed to create shipping zone.');
    }
  };

  const handleDeleteShippingZone = async (id) => {
    if (window.confirm('Delete this shipping zone?')) {
      try {
        await API.delete(`/shops/shipping-zones/${id}/`);
        setShippingZones(prev => prev.filter(z => z.id !== id));
      } catch {
        alert('Failed to delete zone.');
      }
    }
  };

  const handleAddPaymentAcc = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/shops/accounts/', newPaymentAcc);
      setPaymentAccounts(prev => [...prev, data]);
      setShowAddPaymentAccModal(false);
      setNewPaymentAcc({ method: 'bkash', account_number: '', account_holder: '', bank_name: '', branch_name: '', is_primary: true });
    } catch {
      alert('Failed to add payment account.');
    }
  };

  const handleDeletePaymentAcc = async (id) => {
    if (window.confirm('Remove this payment account?')) {
      try {
        await API.delete(`/shops/accounts/${id}/`);
        setPaymentAccounts(prev => prev.filter(a => a.id !== id));
      } catch {
        alert('Failed to remove account.');
      }
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await API.patch(`/orders/${orderId}/`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const handleVerifyPayment = async (statusVal) => {
    if (!selectedPayment) return;
    try {
      await API.post(`/payments/${selectedPayment.id}/verify/`, { status: statusVal });
      setPayments(prev => prev.map(p => p.id === selectedPayment.id ? { ...p, status: statusVal } : p));
      setShowPaymentVerifyModal(false);
      alert(`Payment marked as ${statusVal}!`);
      fetchOrders(); // Reload orders to reflect status updates
    } catch {
      alert('Failed to verify payment.');
    }
  };

  const handleReviewReplySubmit = async (reviewId) => {
    const text = replyTexts[reviewId];
    if (!text?.trim()) return;
    try {
      await API.post(`/reviews/${reviewId}/reply/`, { reply: text });
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, reply: text } : r));
      alert('Reply saved!');
    } catch {
      alert('Failed to submit reply.');
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChat) return;
    try {
      const { data } = await API.post(`/chats/${activeChat.id}/send-message/`, { text: replyText });
      setMessages(prev => [...prev, { ...data, sender_name: 'You' }]);
      setReplyText('');
    } catch {
      // Offline fallback
      setMessages(prev => [...prev, { id: Date.now(), sender_name: 'You', text: replyText, timestamp: new Date().toLocaleTimeString() }]);
      setReplyText('');
    }
  };

  const handleSaveSettings = async () => {
    try {
      // Find seller's active shop slug
      const slugRes = await API.get('/shops/');
      const myShop = slugRes.data.results?.[0] || slugRes.data[0];
      if (myShop) {
        await API.patch(`/shops/${myShop.slug}/`, {
          name: shopProfile.name,
          description: shopProfile.description,
          category: shopProfile.category,
          contact_email: shopProfile.contact_email,
          contact_phone: shopProfile.contact_phone,
          address: shopProfile.address,
          social_links: shopProfile.social_links,
          business_hours: shopProfile.business_hours
        });
        alert('Shop profile settings saved successfully!');
      }
    } catch {
      alert('Failed to save shop settings. Check connection.');
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await API.post('/notifications/mark-all-read/');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  const markSingleNotificationRead = async (notif) => {
    try {
      await API.post(`/notifications/${notif.id}/mark_read/`);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    } catch {
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    }
  };

  // ─── HELPER CALCULATORS ───

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  // Get distinct customers from orders list
  const getUniqueCustomers = () => {
    const custMap = {};
    orders.forEach(o => {
      const name = o.customer_name || 'Anonymous';
      if (!custMap[name]) {
        custMap[name] = { name, phone: o.customer_phone || 'N/A', count: 0, totalSpent: 0, lastOrderDate: o.created_at, status: 'active' };
      }
      custMap[name].count += 1;
      custMap[name].totalSpent += parseFloat(o.total || 0);
    });
    return Object.values(custMap);
  };

  // Filtered lists
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? String(p.category) === String(selectedCategory) : true;
    const matchesStatus = productFilterStatus === 'all' ? true : p.status === productFilterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredOrders = orders.filter(o => orderFilterStatus === 'all' ? true : o.status === orderFilterStatus);

  const filteredReviews = reviews.filter(r => reviewFilter === 'all' ? true : r.rating === parseInt(reviewFilter));

  const filteredBanners = banners.filter(b => b.banner_type === bannerTab);

  // ─── CHARTS CONFIGS ───

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Sales (৳)',
        data: monthlySales,
        borderColor: '#f57224',
        backgroundColor: 'rgba(245, 114, 36, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 2
      }
    ]
  };

  const donutChartData = {
    labels: ['Electronics', 'Fashion', 'Beauty', 'Home & Living'],
    datasets: [
      {
        data: [120000, 60000, 40000, 20000],
        backgroundColor: ['#6366f1', '#3b82f6', '#ec4899', '#10b981'],
        borderWidth: 0,
        hoverOffset: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile sidebar overlay backdrop */}
      {!sidebarCollapsed && isMobile && (
        <div
          onClick={() => setSidebarCollapsed(true)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 1050, backdropFilter: 'blur(2px)'
          }}
        />
      )}
      {/* ============================================================ SIDEBAR */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} style={{ background: '#0f172a' }}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><i className="fas fa-rocket"></i></div>
          <div className="sidebar-logo-text">
            <span className="brand">DIU Startup</span>
            <span className="sub">SELLER PANEL</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">MAIN</div>
          <div className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveSection('dashboard')}>
            <i className="fas fa-chart-pie nav-icon"></i>
            <span className="nav-label">Dashboard</span>
          </div>

          <div className="nav-section-label">CATALOG</div>
          <div className={`nav-item ${activeSection === 'products' ? 'active' : ''}`} onClick={() => setActiveSection('products')}>
            <i className="fas fa-box nav-icon"></i>
            <span className="nav-label">Products</span>
            <span className="nav-badge" id="badge-products">{products.length}</span>
          </div>
          <div className={`nav-item ${activeSection === 'categories' ? 'active' : ''}`} onClick={() => setActiveSection('categories')}>
            <i className="fas fa-th nav-icon"></i>
            <span className="nav-label">Categories</span>
          </div>

          <div className="nav-section-label">SALES</div>
          <div className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`} onClick={() => setActiveSection('orders')}>
            <i className="fas fa-shopping-bag nav-icon"></i>
            <span className="nav-label">Orders</span>
            <span className="nav-badge" id="badge-orders">{orders.length}</span>
          </div>
          <div className={`nav-item ${activeSection === 'payments' ? 'active' : ''}`} onClick={() => setActiveSection('payments')}>
            <i className="fas fa-credit-card nav-icon"></i>
            <span className="nav-label">Payments</span>
            <span className="nav-badge" id="badge-payments">{payments.filter(p => p.status === 'pending').length}</span>
          </div>
          <div className={`nav-item ${activeSection === 'shipping' ? 'active' : ''}`} onClick={() => setActiveSection('shipping')}>
            <i className="fas fa-truck nav-icon"></i>
            <span className="nav-label">Shipping</span>
          </div>
          <div className={`nav-item ${activeSection === 'coupons' ? 'active' : ''}`} onClick={() => setActiveSection('coupons')}>
            <i className="fas fa-ticket-alt nav-icon"></i>
            <span className="nav-label">Coupons</span>
          </div>

          <div className="nav-section-label">ANALYTICS</div>
          <div className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`} onClick={() => setActiveSection('reports')}>
            <i className="fas fa-chart-bar nav-icon"></i>
            <span className="nav-label">Sales Report</span>
          </div>
          <div className={`nav-item ${activeSection === 'customers' ? 'active' : ''}`} onClick={() => setActiveSection('customers')}>
            <i className="fas fa-users nav-icon"></i>
            <span className="nav-label">Customers</span>
          </div>

          <div className="nav-section-label">CONTENT</div>
          <div className={`nav-item ${activeSection === 'reviews' ? 'active' : ''}`} onClick={() => setActiveSection('reviews')}>
            <i className="fas fa-star nav-icon"></i>
            <span className="nav-label">Reviews</span>
            <span className="nav-badge" id="badge-reviews">{reviews.length}</span>
          </div>
          <div className={`nav-item ${activeSection === 'banners' ? 'active' : ''}`} onClick={() => setActiveSection('banners')}>
            <i className="fas fa-image nav-icon"></i>
            <span className="nav-label">Banners</span>
          </div>

          <div className="nav-section-label">COMMUNICATION</div>
          <div className={`nav-item ${activeSection === 'notifications' ? 'active' : ''}`} onClick={() => setActiveSection('notifications')}>
            <i className="fas fa-bell nav-icon"></i>
            <span className="nav-label">Notifications</span>
            <span className="nav-badge" id="badge-notif">{notifications.filter(n => !n.is_read).length}</span>
          </div>
          <div className={`nav-item ${activeSection === 'chat' ? 'active' : ''}`} onClick={() => setActiveSection('chat')}>
            <i className="fas fa-comments nav-icon"></i>
            <span className="nav-label">Chat</span>
            <span className="nav-badge" id="badge-chat">{chats.length}</span>
          </div>

          <div className="nav-section-label">SETTINGS</div>
          <div className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => setActiveSection('settings')}>
            <i className="fas fa-cog nav-icon"></i>
            <span className="nav-label">Shop Settings</span>
          </div>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="sidebar-store-btn">
            <i className="fas fa-external-link-alt"></i>
            <span>Visit Store</span>
          </Link>
          <div className="sidebar-user" onClick={logout}>
            <div className="user-avatar">SU</div>
            <div className="user-info">
              <div className="user-name">Logout</div>
              <div className="user-role">{user?.email || 'Seller'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ============================================================ MAIN CONTAINER */}
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        
        {/* TOPBAR */}
        <div className="topbar">
          <button className="topbar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <i className="fas fa-bars"></i>
          </button>
          <div className="topbar-breadcrumb">
            <i className="fas fa-home" style={{ fontSize: '0.75rem' }}></i>
            <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem', color: '#cbd5e1' }}></i>
            <span className="page-title">{capitalize(activeSection)}</span>
          </div>
          <div className="topbar-right">
            <button className="topbar-btn" onClick={() => setActiveSection('notifications')}>
              <i className="fas fa-bell"></i>
              {notifications.filter(n => !n.is_read).length > 0 && (
                <span className="tb-badge">{notifications.filter(n => !n.is_read).length}</span>
              )}
            </button>
            <button className="topbar-btn" onClick={() => setActiveSection('chat')}>
              <i className="fas fa-comments"></i>
              {chats.length > 0 && <span className="tb-badge">{chats.length}</span>}
            </button>
            <button className="topbar-btn" style={{ borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),#ff6a00)', color: 'white', border: 'none' }}>
              DR
            </button>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="page-content">

          {/* ──────────────────────────────────────────────────────── 1. DASHBOARD */}
          {activeSection === 'dashboard' && (
            <div className="section-panel active">
              <div className="section-header">
                <div>
                  <div className="section-title">Dashboard Overview</div>
                  <div className="section-subtitle">Welcome back! Here's what's happening with your store.</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => window.print()}><i className="fas fa-download"></i> Export</button>
                  <button className="btn btn-primary btn-sm" onClick={() => { resetNewProductForm(); setShowAddProductModal(true); }}><i className="fas fa-plus"></i> Add Product</button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card orange">
                  <div className="stat-icon"><i className="fas fa-box"></i></div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.totalProducts}</div>
                    <div className="stat-label">Total Products</div>
                    <div className="stat-change up"><i className="fas fa-arrow-up"></i> 12% from last month</div>
                  </div>
                </div>
                <div className="stat-card blue">
                  <div className="stat-icon"><i className="fas fa-shopping-bag"></i></div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.totalOrders}</div>
                    <div className="stat-label">Total Orders</div>
                    <div className="stat-change up"><i className="fas fa-arrow-up"></i> 8% from last month</div>
                  </div>
                </div>
                <div className="stat-card yellow">
                  <div className="stat-icon"><i className="fas fa-clock"></i></div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.pendingOrders}</div>
                    <div className="stat-label">Pending Orders</div>
                    <div className="stat-change up"><i className="fas fa-exclamation"></i> Needs attention</div>
                  </div>
                </div>
                <div className="stat-card green">
                  <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.completedOrders}</div>
                    <div className="stat-label">Completed Orders</div>
                    <div className="stat-change up"><i className="fas fa-arrow-up"></i> 5% from last month</div>
                  </div>
                </div>
                <div className="stat-card red">
                  <div className="stat-icon"><i className="fas fa-times-circle"></i></div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.cancelledOrders}</div>
                    <div className="stat-label">Cancelled Orders</div>
                    <div className="stat-change down"><i className="fas fa-arrow-down"></i> 3% improvement</div>
                  </div>
                </div>
                <div className="stat-card purple">
                  <div className="stat-icon"><i className="fas fa-taka-sign"></i></div>
                  <div className="stat-info">
                    <div className="stat-value">৳{(stats.totalRevenue / 100000).toFixed(1)}L</div>
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-change up"><i className="fas fa-arrow-up"></i> 18% from last month</div>
                  </div>
                </div>
              </div>

              {/* Dashboard visual panels */}
              <div className="dashboard-grid">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title"><i className="fas fa-chart-line"></i> Monthly Sales (2026)</div>
                  </div>
                  <div className="card-body">
                    <div className="chart-wrap" style={{ height: 280 }}><Line data={lineChartData} options={chartOptions} /></div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title"><i className="fas fa-exclamation-triangle" style={{ color: 'var(--warning)' }}></i> Low Stock Alert</div>
                  </div>
                  <div className="card-body">
                    <div id="low-stock-list">
                      {lowStockProducts.map(p => (
                        <div className="stock-alert-item" key={p.id}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{p.name}</span>
                          <span style={{ color: '#ef4444', fontWeight: 700, marginLeft: 'auto' }}>{p.stock} left</span>
                          <div className="stock-bar-wrap">
                            <div className="stock-bar stock-critical" style={{ width: `${(p.stock / 20) * 100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders + Donut */}
              <div className="dashboard-grid">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title"><i className="fas fa-receipt"></i> Recent Orders</div>
                    <button className="btn btn-outline btn-sm" onClick={() => setActiveSection('orders')}>View All</button>
                  </div>
                  <div className="data-table-wrap">
                    <table className="data-table">
                      <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                      <tbody>
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id}>
                            <td><strong style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => { setSelectedOrder(o); setShowOrderDetailModal(true); }}>#{o.order_number}</strong></td>
                            <td>{o.customer_name}</td>
                            <td>৳{o.total}</td>
                            <td><span className={`badge badge-${o.status === 'delivered' ? 'success' : o.status === 'pending' ? 'warning' : 'info'}`}>{o.status}</span></td>
                            <td>{new Date(o.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title"><i className="fas fa-chart-pie"></i> Sales by Category</div>
                  </div>
                  <div className="card-body">
                    <div className="chart-wrap" style={{ height: 220 }}><Doughnut data={donutChartData} options={chartOptions} /></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── 2. PRODUCTS */}
          {activeSection === 'products' && (
            <div className="section-panel active">
              <div className="section-header">
                <div>
                  <div className="section-title">Product Management</div>
                  <div className="section-subtitle">Manage your product catalog</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" onClick={() => { resetNewProductForm(); setShowAddProductModal(true); }}><i className="fas fa-plus"></i> Add Product</button>
                </div>
              </div>
              <div className="card" style={{ padding: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="text" className="form-control" style={{ width: 240 }} placeholder="🔍 Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <select className="form-control" style={{ width: 160 }} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <div className="order-status-bar" style={{ margin: 0 }}>
                    {['all', 'active', 'draft', 'inactive'].map(st => (
                      <button key={st} className={`order-status-btn ${productFilterStatus === st ? 'active' : ''}`} onClick={() => setProductFilterStatus(st)}>
                        {capitalize(st)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead>
                    <tbody>
                      {filteredProducts.map(p => (
                        <tr key={p.id}>
                          <td><strong>{p.name}</strong></td>
                          <td>{p.sku || 'N/A'}</td>
                          <td><span className="tag">{p.category_name}</span></td>
                          <td>৳{p.price}</td>
                          <td>{p.stock} units</td>
                          <td><span className={`badge badge-${p.status === 'active' ? 'success' : 'warning'}`}>{capitalize(p.status)}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── 3. CATEGORIES */}
          {activeSection === 'categories' && (
            <div className="section-panel active">
              <div className="section-header">
                <div className="section-title">Category Management</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-outline" onClick={() => setShowAddSubcatModal(true)}><i className="fas fa-sitemap"></i> Add Subcategory</button>
                  <button className="btn btn-primary" onClick={() => setShowAddCatModal(true)}><i className="fas fa-plus"></i> Add Category</button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="card">
                  <div className="card-header"><div class="card-title"><i class="fas fa-th"></i> Categories</div></div>
                  <div className="data-table-wrap">
                    <table className="data-table">
                      <thead><tr><th>Name</th><th>Slug</th><th>Status</th></tr></thead>
                      <tbody>
                        {categories.map(c => (
                          <tr key={c.id}>
                            <td><strong>{c.name}</strong></td>
                            <td>{c.slug}</td>
                            <td><span className={`badge badge-${c.is_active ? 'success' : 'gray'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header"><div class="card-title"><i class="fas fa-sitemap"></i> Subcategories</div></div>
                  <div className="data-table-wrap">
                    <table className="data-table">
                      <thead><tr><th>Name</th><th>Parent</th><th>Status</th></tr></thead>
                      <tbody>
                        {subcategories.map(s => (
                          <tr key={s.id}>
                            <td><strong>{s.name}</strong></td>
                            <td>{s.parent_name}</td>
                            <td><span className={`badge badge-${s.is_active ? 'success' : 'gray'}`}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── 4. ORDERS */}
          {activeSection === 'orders' && (
            <div className="section-panel active">
              <div className="section-header">
                <div className="section-title">Order Management</div>
              </div>
              <div className="order-status-bar">
                {['all', 'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'].map(status => (
                  <button key={status} className={`order-status-btn ${orderFilterStatus === status ? 'active' : ''}`} onClick={() => setOrderFilterStatus(status)}>
                    {capitalize(status)}
                  </button>
                ))}
              </div>
              <div className="card">
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filteredOrders.map(o => (
                        <tr key={o.id}>
                          <td><strong style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => { setSelectedOrder(o); setShowOrderDetailModal(true); }}>#{o.order_number}</strong></td>
                          <td>{o.customer_name}</td>
                          <td>৳{o.total}</td>
                          <td><span className="badge badge-info">{o.payment_method}</span></td>
                          <td><span className={`badge badge-${o.status === 'delivered' ? 'success' : o.status === 'pending' ? 'warning' : 'info'}`}>{capitalize(o.status)}</span></td>
                          <td>{new Date(o.created_at).toLocaleDateString()}</td>
                          <td>
                            <select value={o.status} onChange={(e) => handleOrderStatusUpdate(o.id, e.target.value)} style={{ padding: 5, borderRadius: 4 }}>
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="packed">Packed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="returned">Returned</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── 5. PAYMENTS */}
          {activeSection === 'payments' && (
            <div className="section-panel active">
              <div className="section-header">
                <div className="section-title">Payment Management</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
                <div>
                  {/* Pending Verifications */}
                  <div className="card" style={{ marginBottom: 16 }}>
                    <div className="card-header">
                      <div className="card-title"><i className="fas fa-clock" style={{ color: 'var(--warning)' }}></i> Pending Verifications</div>
                    </div>
                    <div className="card-body">
                      {payments.filter(p => p.status === 'pending').map(p => (
                        <div key={p.id} className="stock-alert-item" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                          <div>
                            <strong>{p.order_number}</strong> - {p.customer_name}
                            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{p.method} · ৳{p.amount} · Trx: {p.transaction_id}</p>
                          </div>
                          <button className="btn btn-primary btn-xs" style={{ marginLeft: 'auto' }} onClick={() => { setSelectedPayment(p); setShowPaymentVerifyModal(true); }}>Verify</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment History */}
                  <div className="card">
                    <div className="card-header"><div className="card-title"><i className="fas fa-history"></i> Payment History</div></div>
                    <div className="data-table-wrap">
                      <table className="data-table">
                        <thead><tr><th>Order</th><th>Customer</th><th>Method</th><th>Amount</th><th>Trx ID</th><th>Status</th></tr></thead>
                        <tbody>
                          {payments.map(p => (
                            <tr key={p.id}>
                              <td>{p.order_number}</td>
                              <td>{p.customer_name}</td>
                              <td>{p.method}</td>
                              <td>৳{p.amount}</td>
                              <td><code>{p.transaction_id}</code></td>
                              <td><span className={`badge badge-${p.status === 'received' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'}`}>{capitalize(p.status)}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Accounts Manager */}
                <div>
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title"><i className="fas fa-wallet"></i> Payment Accounts</div>
                      <button className="btn btn-primary btn-sm" onClick={() => setShowAddPaymentAccModal(true)}><i className="fas fa-plus"></i></button>
                    </div>
                    <div className="card-body">
                      {paymentAccounts.map(a => (
                        <div key={a.id} style={{ padding: 12, border: '1.5px dashed var(--border)', borderRadius: 8, marginBottom: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{capitalize(a.method)}</strong>
                            {a.is_primary && <span className="badge badge-success">Primary</span>}
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>No: {a.account_number}</p>
                          {a.account_holder && <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Name: {a.account_holder}</p>}
                          <button className="btn btn-outline btn-xs" style={{ marginTop: 8, color: '#ef4444', borderColor: '#fee2e2' }} onClick={() => handleDeletePaymentAcc(a.id)}>Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── 6. SHIPPING */}
          {activeSection === 'shipping' && (
            <div className="section-panel active">
              <div className="section-header"><div className="section-title">Shipping Settings</div></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title"><i className="fas fa-truck"></i> Shipping Zones</div>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddZoneModal(true)}><i className="fas fa-plus"></i> Add Zone</button>
                  </div>
                  <div className="card-body">
                    {shippingZones.map(z => (
                      <div key={z.id} style={{ padding: 12, border: '1.5px dashed var(--border)', borderRadius: 8, marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong>{z.zone_name}</strong>
                          <button className="btn btn-outline btn-xs" style={{ color: '#ef4444' }} onClick={() => handleDeleteShippingZone(z.id)}>Delete</button>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>Areas: {z.areas}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: 2 }}>Charge: ৳{z.charge} (Free above ৳{z.free_above || 'N/A'}) · {z.delivery_time}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <div className="card-header"><div className="card-title"><i className="fas fa-shipping-fast"></i> Courier Partners</div></div>
                  <div className="card-body">
                    {[['Sundarban Courier', 'Yes', 'Yes'], ['Pathao Courier', 'Yes', 'Yes'], ['RedX', 'Yes', 'Yes']].map(([name, tracking, cod]) => (
                      <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                        <strong>{name}</strong>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Tracking: {tracking} · COD: {cod}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── 7. COUPONS */}
          {activeSection === 'coupons' && (
            <div className="section-panel active">
              <div className="section-header">
                <div className="section-title">Coupon Management</div>
                <button className="btn btn-primary" onClick={() => setShowAddCouponModal(true)}><i className="fas fa-plus"></i> Create Coupon</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {coupons.map(c => (
                  <div key={c.id} style={{ background: 'white', border: '1.5px dashed var(--border)', borderRadius: 12, padding: 18, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: 5, height: '100%', background: 'var(--primary)' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'Courier New, monospace', fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: 2 }}>{c.code}</span>
                      <span className={`badge badge-${c.is_active ? 'success' : 'gray'}`}>{c.is_active ? 'Active' : 'Expired'}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 6 }}>
                      {c.discount_type === 'percent' ? `${c.value}% OFF` : `৳${c.value} OFF`} · Min Order ৳{c.min_order}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>Used: {c.used_count}/{c.usage_limit || 'Unlimited'} · Expiry: {new Date(c.expiry_date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── 8. REPORTS */}
          {activeSection === 'reports' && (
            <div className="section-panel active">
              <div className="section-header"><div className="section-title">Sales Analytics Report</div></div>
              <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="stat-card orange"><div className="stat-icon"><i className="fas fa-calendar-day"></i></div><div className="stat-info"><div className="stat-value">৳14,200</div><div className="stat-label">Today's Sales</div></div></div>
                <div className="stat-card blue"><div className="stat-icon"><i className="fas fa-calendar-week"></i></div><div className="stat-info"><div className="stat-value">৳82,500</div><div className="stat-label">This Week</div></div></div>
                <div className="stat-card green"><div className="stat-icon"><i className="fas fa-calendar-alt"></i></div><div className="stat-info"><div className="stat-value">৳{(stats.totalRevenue/100000).toFixed(1)}L</div><div className="stat-label">This Month</div></div></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                <div className="card">
                  <div className="card-header"><div className="card-title"><i className="fas fa-chart-area"></i> Sales Trend</div></div>
                  <div className="card-body"><div className="chart-wrap" style={{ height: 260 }}><Line data={lineChartData} options={chartOptions} /></div></div>
                </div>
                <div className="card">
                  <div className="card-header"><div className="card-title"><i className="fas fa-trophy"></i> Best Sellers</div></div>
                  <div className="card-body">
                    {products.slice(0, 3).map((p, i) => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)' }}>{i + 1}</span>
                        <div>
                          <strong>{p.name}</strong>
                          <p style={{ fontSize: '0.72rem', color: '#64748b' }}>{p.review_count || 0} reviews</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── 9. CUSTOMERS */}
          {activeSection === 'customers' && (
            <div className="section-panel active">
              <div className="section-header"><div className="section-title">Customer Directory</div></div>
              <div className="card">
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Customer Name</th><th>Contact Phone</th><th>Orders Count</th><th>Total Spent</th><th>Last Order</th></tr></thead>
                    <tbody>
                      {getUniqueCustomers().map((c, idx) => (
                        <tr key={idx}>
                          <td><strong>{c.name}</strong></td>
                          <td>{c.phone}</td>
                          <td><span className="badge badge-info">{c.count}</span></td>
                          <td><strong>৳{c.totalSpent.toLocaleString()}</strong></td>
                          <td>{new Date(c.lastOrderDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── 10. REVIEWS */}
          {activeSection === 'reviews' && (
            <div className="section-panel active">
              <div className="section-header">
                <div className="section-title">Reviews & Feedback</div>
                <div className="report-period-btns">
                  {['all', '5', '4', '3', '2'].map(star => (
                    <button key={star} className={`period-btn ${reviewFilter === star ? 'active' : ''}`} onClick={() => setReviewFilter(star)}>
                      {star === 'all' ? 'All' : `${star}★`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card" style={{ padding: 20 }}>
                {filteredReviews.map(r => (
                  <div key={r.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 15, marginBottom: 15 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{r.user_name}</strong>
                      <span style={{ color: 'var(--warning)', fontWeight: 700 }}>{'★'.repeat(r.rating)}</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Product: {r.product_name}</p>
                    <p style={{ marginTop: 6, fontSize: '0.85rem' }}>{r.comment}</p>
                    {r.reply ? (
                      <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, marginTop: 8, fontSize: '0.82rem' }}>
                        <strong>Your Reply:</strong> {r.reply}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <input type="text" className="form-control" style={{ flex: 1 }} placeholder="Type reply..." value={replyTexts[r.id] || ''} onChange={(e) => setReplyTexts(prev => ({ ...prev, [r.id]: e.target.value }))} />
                        <button className="btn btn-primary btn-sm" onClick={() => handleReviewReplySubmit(r.id)}>Submit Reply</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── 11. BANNERS */}
          {activeSection === 'banners' && (
            <div className="section-panel active">
              <div className="section-header">
                <div className="section-title">Banner Management</div>
                <button className="btn btn-primary" onClick={() => setShowAddBannerModal(true)}><i className="fas fa-plus"></i> Upload Banner</button>
              </div>
              <div className="tabs" style={{ marginBottom: 16 }}>
                {['hero', 'offer', 'popup'].map(tab => (
                  <button key={tab} className={`tab-btn ${bannerTab === tab ? 'active' : ''}`} onClick={() => setBannerTab(tab)}>
                    {capitalize(tab)} Slider
                  </button>
                ))}
              </div>
              <div className="banner-grid">
                {filteredBanners.map(b => (
                  <div className="banner-card" key={b.id}>
                    <div style={{ height: 130, background: 'linear-gradient(135deg, var(--primary), #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
                      {b.title}
                    </div>
                    <div className="banner-card-footer">
                      <span className="banner-card-title">{b.title}</span>
                      <span className={`badge badge-${b.is_active ? 'success' : 'gray'}`}>{b.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── 12. NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="section-panel active">
              <div className="section-header">
                <div className="section-title">Notifications</div>
                <button className="btn btn-outline btn-sm" onClick={markAllNotificationsRead}><i className="fas fa-check-double"></i> Mark All Read</button>
              </div>
              <div className="card" style={{ padding: 20 }}>
                {notifications.map(n => (
                  <div key={n.id} className={`notif-item ${!n.is_read ? 'unread' : ''}`} onClick={() => markSingleNotificationRead(n)}>
                    <div className="notif-icon" style={{ background: '#e0e7ff', color: 'var(--primary)' }}><i className="fas fa-bell"></i></div>
                    <div className="notif-body">
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-desc">{n.message}</div>
                      <div className="notif-time">{new Date(n.created_at).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── 13. CHAT */}
          {activeSection === 'chat' && (
            <div className="section-panel active">
              <div className="chat-layout card">
                <div className="chat-sidebar">
                  <div className="chat-sidebar-header">
                    <input type="text" placeholder="🔍 Search chats..." />
                  </div>
                  {chats.map(c => (
                    <div key={c.id} className={`chat-list-item ${activeChat?.id === c.id ? 'active' : ''}`} onClick={() => setActiveChat(c)}>
                      <div className="chat-avatar" style={{ background: 'var(--primary)' }}>{c.customer_name?.[0] || 'C'}</div>
                      <div>
                        <div className="chat-list-name">{c.customer_name}</div>
                        <div className="chat-list-preview">{c.last_message?.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="chat-main">
                  {activeChat ? (
                    <>
                      <div className="chat-header">
                        <div className="chat-avatar" style={{ background: 'var(--primary)' }}>{activeChat.customer_name?.[0] || 'C'}</div>
                        <div>
                          <strong>{activeChat.customer_name}</strong>
                          <div style={{ fontSize: '0.7rem', color: 'var(--success)' }}><i className="fas fa-circle" style={{ fontSize: '0.4rem', marginRight: 4 }}></i>Online</div>
                        </div>
                      </div>
                      <div className="chat-messages">
                        {messages.map(m => (
                          <div key={m.id} className={`msg-bubble-wrap ${m.sender_name === 'You' ? 'own' : ''}`}>
                            <div className={`msg-bubble ${m.sender_name === 'You' ? 'sent' : 'received'}`}>
                              <strong style={{ fontSize: '0.72rem', display: 'block', color: m.sender_name === 'You' ? 'white' : 'var(--primary)' }}>{m.sender_name}</strong>
                              <p style={{ marginTop: 2 }}>{m.text}</p>
                              <div className="msg-time">{m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : ''}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleSendChatMessage} className="chat-input-bar">
                        <input type="text" className="chat-input" placeholder="Type message..." value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                        <button type="submit" className="btn btn-primary btn-icon"><i className="fas fa-paper-plane"></i></button>
                      </form>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', margin: 'auto', color: '#94a3b8' }}>
                      <i className="fas fa-comments" style={{ fontSize: '3rem', marginBottom: 10 }}></i>
                      <p>Select a conversation to start chatting</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── 14. SHOP SETTINGS */}
          {activeSection === 'settings' && (
            <div className="section-panel active">
              <div className="section-header">
                <div className="section-title">Shop Settings</div>
                <button className="btn btn-primary" onClick={handleSaveSettings}><i className="fas fa-save"></i> Save Changes</button>
              </div>
              <div className="card" style={{ padding: 24 }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Shop Name</label>
                    <input className="form-control" value={shopProfile.name} onChange={(e) => setShopProfile(prev => ({ ...prev, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Email</label>
                    <input className="form-control" value={shopProfile.contact_email} onChange={(e) => setShopProfile(prev => ({ ...prev, contact_email: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input className="form-control" value={shopProfile.contact_phone} onChange={(e) => setShopProfile(prev => ({ ...prev, contact_phone: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Shop Category</label>
                    <input className="form-control" value={shopProfile.category} onChange={(e) => setShopProfile(prev => ({ ...prev, category: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} value={shopProfile.description} onChange={(e) => setShopProfile(prev => ({ ...prev, description: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Physical Address</label>
                  <input className="form-control" value={shopProfile.address} onChange={(e) => setShopProfile(prev => ({ ...prev, address: e.target.value }))} />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ============================================================ MODALS */}

      {/* 1. Add Product Modal */}
      {showAddProductModal && (
        <div className="modal-overlay open">
          <div className="modal modal-lg">
            <div className="modal-header">
              <div className="modal-title"><i className="fas fa-box" style={{ color: 'var(--primary)' }}></i> Add New Product</div>
              <button className="modal-close" onClick={() => setShowAddProductModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleAddProduct} className="modal-body">
              <div className="tabs">
                {['basic', 'pricing', 'variants', 'media'].map(t => (
                  <button type="button" key={t} className={`tab-btn ${prodModalTab === t ? 'active' : ''}`} onClick={() => setProdModalTab(t)}>
                    {capitalize(t)}
                  </button>
                ))}
              </div>

              {prodModalTab === 'basic' && (
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input className="form-control" required placeholder="e.g. Leather Wallet" value={newProduct.name} onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SKU</label>
                    <input className="form-control" placeholder="SKU code" value={newProduct.sku} onChange={(e) => setNewProduct(prev => ({ ...prev, sku: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-control" required value={newProduct.category} onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <select className="form-control" value={newProduct.brand} onChange={(e) => setNewProduct(prev => ({ ...prev, brand: e.target.value }))}>
                      <option value="">Select Brand</option>
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows={3} placeholder="Detailed product descriptions..." value={newProduct.description} onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))} />
                  </div>
                </div>
              )}

              {prodModalTab === 'pricing' && (
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Selling Price *</label>
                    <input className="form-control" type="number" required placeholder="৳ Selling price" value={newProduct.price} onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discount Price</label>
                    <input className="form-control" type="number" placeholder="৳ Discount price" value={newProduct.discount_price} onChange={(e) => setNewProduct(prev => ({ ...prev, discount_price: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock *</label>
                    <input className="form-control" type="number" required placeholder="Units in stock" value={newProduct.stock} onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))} />
                  </div>
                </div>
              )}

              {prodModalTab === 'variants' && (
                <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}><i className="fas fa-info-circle" style={{ color: 'var(--primary)', marginRight: 6 }}></i>Variants can be managed directly on the product detail page once the product is successfully published.</p>
                </div>
              )}

              {prodModalTab === 'media' && (
                <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}><i className="fas fa-info-circle" style={{ color: 'var(--primary)', marginRight: 6 }}></i>Media uploads are processed securely via cloud storage once the product is active.</p>
                </div>
              )}

              <div className="modal-footer" style={{ padding: '20px 0 0' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddProductModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Order Detail Modal */}
      {showOrderDetailModal && selectedOrder && (
        <div className="modal-overlay open">
          <div className="modal modal-lg">
            <div className="modal-header">
              <div className="modal-title"><i className="fas fa-receipt" style={{ color: 'var(--primary)' }}></i> Order Detail #{selectedOrder.order_number}</div>
              <button className="modal-close" onClick={() => setShowOrderDetailModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body order-detail-grid">
              <div>
                <h4>Customer Info</h4>
                <p style={{ marginTop: 6, fontSize: '0.88rem' }}><strong>Name:</strong> {selectedOrder.customer_name}</p>
                <p style={{ marginTop: 2, fontSize: '0.88rem' }}><strong>Method:</strong> {selectedOrder.payment_method} · Total: ৳{selectedOrder.total}</p>
                
                <h4 style={{ marginTop: 20 }}>Timeline / Status</h4>
                <div className="order-timeline">
                  <div className="timeline-step">
                    <div className="timeline-dot done"><i className="fas fa-check"></i></div>
                    <div className="timeline-info"><div className="tl-title">Order Placed</div><div className="tl-time">{new Date(selectedOrder.created_at).toLocaleString()}</div></div>
                  </div>
                  <div className="timeline-step">
                    <div className={`timeline-dot ${selectedOrder.status !== 'pending' ? 'done' : 'active'}`}><i className="fas fa-clock"></i></div>
                    <div className="timeline-info"><div className="tl-title">Processing</div></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowOrderDetailModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Payment Verify Modal */}
      {showPaymentVerifyModal && selectedPayment && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title"><i className="fas fa-check-circle" style={{ color: 'var(--success)' }}></i> Verify Payment</div>
              <button className="modal-close" onClick={() => setShowPaymentVerifyModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <p>Verify payment proof for order <strong>{selectedPayment.order_number}</strong></p>
              <div style={{ marginTop: 10 }}>
                <p><strong>Method:</strong> {selectedPayment.method}</p>
                <p><strong>Amount:</strong> ৳{selectedPayment.amount}</p>
                <p><strong>Transaction ID:</strong> <code>{selectedPayment.transaction_id}</code></p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={() => handleVerifyPayment('rejected')}>Reject</button>
              <button className="btn btn-success" onClick={() => handleVerifyPayment('received')}>Approve</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Add Category Modal */}
      {showAddCatModal && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title"><i className="fas fa-th" style={{ color: 'var(--primary)' }}></i> Add Category</div>
              <button className="modal-close" onClick={() => setShowAddCatModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleAddCategory} className="modal-body">
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input className="form-control" required placeholder="e.g. Health & Beauty" value={newCat.name} onChange={(e) => setNewCat(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">FontAwesome Icon Class</label>
                <input className="form-control" placeholder="fas fa-magic" value={newCat.icon} onChange={(e) => setNewCat(prev => ({ ...prev, icon: e.target.value }))} />
              </div>
              <div className="modal-footer" style={{ padding: '20px 0 0' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddCatModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add Subcategory Modal */}
      {showAddSubcatModal && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title"><i className="fas fa-sitemap" style={{ color: 'var(--primary)' }}></i> Add Subcategory</div>
              <button className="modal-close" onClick={() => setShowAddSubcatModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleAddSubcategory} className="modal-body">
              <div className="form-group">
                <label className="form-label">Subcategory Name *</label>
                <input className="form-control" required placeholder="e.g. Skin Care" value={newSubcat.name} onChange={(e) => setNewSubcat(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Parent Category *</label>
                <select className="form-control" required value={newSubcat.parent} onChange={(e) => setNewSubcat(prev => ({ ...prev, parent: e.target.value }))}>
                  <option value="">Select Parent Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="modal-footer" style={{ padding: '20px 0 0' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddSubcatModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Subcategory</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Create Coupon Modal */}
      {showAddCouponModal && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title"><i className="fas fa-ticket-alt" style={{ color: 'var(--primary)' }}></i> Create Coupon</div>
              <button className="modal-close" onClick={() => setShowAddCouponModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleCreateCoupon} className="modal-body">
              <div className="form-group">
                <label className="form-label">Coupon Code *</label>
                <input className="form-control" required placeholder="SAVE25" value={newCoupon.code} onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Discount Type</label>
                  <select className="form-control" value={newCoupon.discount_type} onChange={(e) => setNewCoupon(prev => ({ ...prev, discount_type: e.target.value }))}>
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Value *</label>
                  <input className="form-control" type="number" required placeholder="25" value={newCoupon.value} onChange={(e) => setNewCoupon(prev => ({ ...prev, value: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Min Order amount (৳)</label>
                  <input className="form-control" type="number" value={newCoupon.min_order} onChange={(e) => setNewCoupon(prev => ({ ...prev, min_order: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Expiry Date *</label>
                  <input className="form-control" type="date" required value={newCoupon.expiry_date} onChange={(e) => setNewCoupon(prev => ({ ...prev, expiry_date: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer" style={{ padding: '20px 0 0' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddCouponModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Add Payment Account Modal */}
      {showAddPaymentAccModal && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title"><i className="fas fa-wallet" style={{ color: 'var(--primary)' }}></i> Add Payment Account</div>
              <button className="modal-close" onClick={() => setShowAddPaymentAccModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleAddPaymentAcc} className="modal-body">
              <div className="form-group">
                <label className="form-label">Method</label>
                <select className="form-control" value={newPaymentAcc.method} onChange={(e) => setNewPaymentAcc(prev => ({ ...prev, method: e.target.value }))}>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Account Number *</label>
                <input className="form-control" required placeholder="017XXXXXXXX" value={newPaymentAcc.account_number} onChange={(e) => setNewPaymentAcc(prev => ({ ...prev, account_number: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Account Holder Name</label>
                <input className="form-control" placeholder="Account Name" value={newPaymentAcc.account_holder} onChange={(e) => setNewPaymentAcc(prev => ({ ...prev, account_holder: e.target.value }))} />
              </div>
              <div className="modal-footer" style={{ padding: '20px 0 0' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddPaymentAccModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Add Shipping Zone Modal */}
      {showAddZoneModal && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title"><i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)' }}></i> Add Shipping Zone</div>
              <button className="modal-close" onClick={() => setShowAddZoneModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleAddShippingZone} className="modal-body">
              <div className="form-group">
                <label className="form-label">Zone Name *</label>
                <input className="form-control" required placeholder="e.g. Sylhet Metro" value={newZone.zone_name} onChange={(e) => setNewZone(prev => ({ ...prev, zone_name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Areas Covered *</label>
                <textarea className="form-control" required placeholder="Sylhet City, Zindabazar..." value={newZone.areas} onChange={(e) => setNewZone(prev => ({ ...prev, areas: e.target.value }))} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Charge (৳) *</label>
                  <input className="form-control" type="number" required placeholder="120" value={newZone.charge} onChange={(e) => setNewZone(prev => ({ ...prev, charge: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Free Above (৳)</label>
                  <input className="form-control" type="number" placeholder="2000" value={newZone.free_above} onChange={(e) => setNewZone(prev => ({ ...prev, free_above: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer" style={{ padding: '20px 0 0' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddZoneModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Zone</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
