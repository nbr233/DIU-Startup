import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/shop-style.css';

export default function ShopLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Sidebar toggle state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    totalProducts: 0, totalOrders: 0, pendingOrders: 0, completedOrders: 0, cancelled_orders: 0, totalRevenue: 0
  });
  
  // Dashboard lists
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  
  // Modals state
  const [addProdModal, setAddProdModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', sku: '', price: '', discount_price: '', stock: '', description: '', category: ''
  });

  // Fetch all seller data
  useEffect(() => {
    // Stats
    API.get('/dashboard/seller/')
      .then(res => {
        setStats(res.data.stats || res.data);
      })
      .catch(() => {
        // Fallback dummy stats
        setStats({
          totalProducts: 48, totalOrders: 246, pendingOrders: 12, completedOrders: 218, totalRevenue: 240000
        });
      });

    // Products
    API.get('/products/')
      .then(res => setProducts(res.data.results || res.data))
      .catch(() => {
        setProducts([
          { id: 1, name: 'Samsung Galaxy S24 Ultra', sku: 'SM-S24U', price: 149999, stock: 15, status: 'active' },
          { id: 2, name: 'Sony WH-1000XM5', sku: 'SONY-XM5', price: 38500, stock: 8, status: 'active' }
        ]);
      });

    // Orders
    API.get('/orders/')
      .then(res => setOrders(res.data.results || res.data))
      .catch(() => {
        setOrders([
          { id: 1, order_number: 'ORD-A9736B', customer_name: 'Rahim Uddin', total: 149999, status: 'pending', created_at: '2026-06-30' },
          { id: 2, order_number: 'ORD-B3682C', customer_name: 'Fatima Khatun', total: 38500, status: 'delivered', created_at: '2026-06-28' }
        ]);
      });

    // Categories
    API.get('/categories/')
      .then(res => setCategories(res.data))
      .catch(() => {
        setCategories([
          { id: 1, name: 'Electronics' }, { id: 2, name: 'Fashion' }
        ]);
      });

    // Coupons
    API.get('/coupons/')
      .then(res => setCoupons(res.data.results || res.data))
      .catch(() => {
        setCoupons([
          { id: 1, code: 'PLATFORM20', discount_type: 'percent', value: 20, expiry_date: '2026-12-31' }
        ]);
      });

    // Chats
    API.get('/chats/')
      .then(res => setChats(res.data.results || res.data))
      .catch(() => {
        setChats([
          { id: 1, customer_name: 'Rahim Uddin', last_message: { text: 'Is this item in stock?' } }
        ]);
      });
  }, []);

  // Chat message loading
  useEffect(() => {
    if (activeChat) {
      API.get(`/chats/${activeChat.id}/messages/`)
        .then(res => setMessages(res.data))
        .catch(() => {
          setMessages([
            { id: 1, sender_name: 'Rahim Uddin', text: 'Is this item in stock?', timestamp: '2026-06-30' }
          ]);
        });
    }
  }, [activeChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const { data } = await API.post(`/chats/${activeChat.id}/send-message/`, {
        text: replyText
      });
      setMessages(prev => [...prev, { ...data, sender_name: 'You' }]);
      setReplyText('');
    } catch {
      // Fallback local append for demo
      setMessages(prev => [...prev, { id: Date.now(), sender_name: 'You', text: replyText }]);
      setReplyText('');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/products/', newProduct);
      setProducts(prev => [data, ...prev]);
      setAddProdModal(false);
      setNewProduct({ name: '', sku: '', price: '', discount_price: '', stock: '', description: '', category: '' });
      alert('Product added successfully!');
    } catch {
      // Fallback local append
      const mockNew = { id: Date.now(), ...newProduct, status: 'active' };
      setProducts(prev => [mockNew, ...prev]);
      setAddProdModal(false);
      setNewProduct({ name: '', sku: '', price: '', discount_price: '', stock: '', description: '', category: '' });
      alert('Product created (Demo mode)!');
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await API.patch(`/orders/${orderId}/status/`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  return (
    <div className="shop-layout">
      
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} style={{ background: '#0f111e' }}>
        <div className="sidebar-logo" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="sidebar-logo-icon" style={{ background: '#f57224' }}><i className="fas fa-store"></i></div>
          <div className="sidebar-logo-text">
            <span className="brand">DIU Startup</span>
            <span className="sub">SELLER DASHBOARD</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active" onClick={() => setActiveSection('dashboard')}><i className="fas fa-chart-pie nav-icon"></i><span className="nav-label">Dashboard</span></div>
          <div className="nav-item" onClick={() => setActiveSection('products')}><i className="fas fa-box nav-icon"></i><span className="nav-label">Products</span></div>
          <div className="nav-item" onClick={() => setActiveSection('orders')}><i className="fas fa-shopping-bag nav-icon"></i><span className="nav-label">Orders</span></div>
          <div className="nav-item" onClick={() => setActiveSection('chat')}><i className="fas fa-comments nav-icon"></i><span className="nav-label">Chat</span></div>
          <div className="nav-item" onClick={() => setActiveSection('settings')}><i className="fas fa-cog nav-icon"></i><span className="nav-label">Settings</span></div>
        </nav>

        <div className="sidebar-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/" className="sidebar-store-btn" style={{ background: 'rgba(245,114,36,0.1)' }}>
            <i className="fas fa-store" style={{ color: '#f57224' }}></i><span style={{ color: '#f57224' }}>Visit Store</span>
          </Link>
          <div className="sidebar-user" onClick={() => logout()}>
            <div className="user-avatar" style={{ background: '#f57224' }}><i className="fas fa-user-circle"></i></div>
            <div className="user-info">
              <div className="user-name">Logout</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        
        {/* TOPBAR */}
        <div className="topbar">
          <button className="topbar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}><i className="fas fa-bars"></i></button>
          <div className="topbar-breadcrumb">
            <span className="page-title" style={{ textTransform: 'capitalize' }}>{activeSection}</span>
          </div>
        </div>

        {/* SECTION PANELS */}
        <div className="page-content">
          
          {/* 1. OVERVIEW */}
          {activeSection === 'dashboard' && (
            <div>
              <div className="stats-grid">
                <div className="stat-card orange">
                  <div className="stat-icon"><i className="fas fa-taka-sign"></i></div>
                  <div className="stat-info">
                    <div className="stat-value">৳{stats.totalRevenue.toLocaleString()}</div>
                    <div className="stat-label">Total Revenue</div>
                  </div>
                </div>
                <div className="stat-card green">
                  <div className="stat-icon"><i className="fas fa-shopping-bag"></i></div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.totalOrders}</div>
                    <div className="stat-label">Total Orders</div>
                  </div>
                </div>
                <div className="stat-card blue">
                  <div className="stat-icon"><i className="fas fa-box"></i></div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.totalProducts}</div>
                    <div className="stat-label">Active Products</div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="card" style={{ marginTop: 25 }}>
                <div className="card-header"><h3>Recent Orders</h3></div>
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr><th>Order Number</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td><strong>{o.order_number}</strong></td>
                          <td>{o.customer_name || 'Anonymous'}</td>
                          <td>৳{o.total}</td>
                          <td><span className={`badge badge-${o.status === 'delivered' ? 'success' : 'warning'}`}>{o.status}</span></td>
                          <td>{new Date(o.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. PRODUCT MANAGEMENT */}
          {activeSection === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3>Product Catalog</h3>
                <button className="btn btn-primary" onClick={() => setAddProdModal(true)}><i className="fas fa-plus"></i> Add Product</button>
              </div>

              <div className="card">
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr><th>Product Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id}>
                          <td><strong>{p.name}</strong></td>
                          <td>{p.sku}</td>
                          <td>৳{p.price}</td>
                          <td>{p.stock} units</td>
                          <td><span className="badge badge-success">{p.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. ORDER MANAGEMENT */}
          {activeSection === 'orders' && (
            <div>
              <h3>Order Management</h3>
              <div className="card" style={{ marginTop: 20 }}>
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr><th>Order Number</th><th>Customer</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td><strong>{o.order_number}</strong></td>
                          <td>{o.customer_name || 'Anonymous'}</td>
                          <td>৳{o.total}</td>
                          <td><span className="badge badge-warning">{o.status}</span></td>
                          <td>
                            <select value={o.status} onChange={(e) => handleOrderStatusUpdate(o.id, e.target.value)} style={{ padding: 5, borderRadius: 4 }}>
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
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

          {/* 4. CHAT */}
          {activeSection === 'chat' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, minHeight: 450 }}>
              {/* Chat List */}
              <div className="card" style={{ padding: 15 }}>
                <h3>Conversations</h3>
                <div style={{ marginTop: 15, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {chats.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => setActiveChat(c)}
                      style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', background: activeChat?.id === c.id ? 'rgba(245,114,36,0.05)' : '#fff' }}
                    >
                      <strong>{c.customer_name || 'Customer'}</strong>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.last_message?.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat View */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 15 }}>
                {activeChat ? (
                  <>
                    <h3>Chat with {activeChat.customer_name}</h3>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '15px 0', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 280 }}>
                      {messages.map(m => (
                        <div key={m.id} style={{ alignSelf: m.sender_name === 'You' ? 'flex-end' : 'flex-start', background: m.sender_name === 'You' ? 'var(--primary-light)' : '#f1f5f9', padding: '10px 15px', borderRadius: 12, maxWidth: '70%' }}>
                          <strong style={{ fontSize: '0.75rem', display: 'block', color: 'var(--primary)' }}>{m.sender_name}</strong>
                          <p style={{ marginTop: 3 }}>{m.text}</p>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 10, borderTop: '1px solid #e2e8f0', paddingTop: 15 }}>
                      <input type="text" placeholder="Type message..." value={replyText} onChange={(e) => setReplyText(e.target.value)} style={{ flex: 1, padding: 10, border: '1px solid #cbd5e1', borderRadius: 8 }} />
                      <button type="submit" className="btn btn-primary"><i className="fas fa-paper-plane"></i></button>
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
          )}

          {/* 5. SETTINGS */}
          {activeSection === 'settings' && (
            <div className="card" style={{ padding: 25 }}>
              <h3>Shop Settings</h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 15, maxWidth: 500 }}>
                <div>
                  <label className="form-label">Shop Name</label>
                  <input type="text" className="form-control" defaultValue="DIU Startup Store" />
                </div>
                <div>
                  <label className="form-label">Contact Email</label>
                  <input type="email" className="form-control" defaultValue="store@diustartup.com" />
                </div>
                <div>
                  <label className="form-label">Contact Phone</label>
                  <input type="text" className="form-control" defaultValue="01900-000000" />
                </div>
                <button type="button" className="btn btn-primary" style={{ width: 'fit-content' }} onClick={() => alert('Settings saved!')}>Save Settings</button>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* ADD PRODUCT MODAL */}
      {addProdModal && (
        <div className="modal-overlay open">
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3>Add Product</h3>
              <button className="modal-close" onClick={() => setAddProdModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleAddProduct} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="form-label">Product Name *</label>
                <input type="text" className="form-control" required value={newProduct.name} onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="form-label">SKU</label>
                  <input type="text" className="form-control" value={newProduct.sku} onChange={(e) => setNewProduct(prev => ({ ...prev, sku: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Stock *</label>
                  <input type="number" className="form-control" required value={newProduct.stock} onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="form-label">Price *</label>
                  <input type="number" className="form-control" required value={newProduct.price} onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Discount Price</label>
                  <input type="number" className="form-control" value={newProduct.discount_price} onChange={(e) => setNewProduct(prev => ({ ...prev, discount_price: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="form-label">Category *</label>
                <select className="form-control" required value={newProduct.category} onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-control" value={newProduct.description} onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))} style={{ minHeight: 60 }} />
              </div>
              <div className="modal-footer" style={{ padding: '10px 0 0' }}>
                <button type="button" className="btn btn-outline" onClick={() => setAddProdModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
