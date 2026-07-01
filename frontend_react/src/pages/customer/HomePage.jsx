import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/style.css';

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('diu_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  // UI states
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countdown, setCountdown] = useState({ hours: 12, minutes: 45, seconds: 30 });
  const [activeTab, setActiveTab] = useState('all');
  const [toasts, setToasts] = useState([]);

  // Fetch initial data
  useEffect(() => {
    // Categories from API
    API.get('/categories/')
      .then(res => setCategories(res.data))
      .catch(err => {
        // Fallback dummy categories if API fails
        setCategories([
          { id: 1, name: 'Electronics', icon: 'fas fa-mobile-alt', slug: 'electronics' },
          { id: 2, name: 'Fashion', icon: 'fas fa-tshirt', slug: 'fashion' },
          { id: 3, name: 'Home & Living', icon: 'fas fa-couch', slug: 'home' },
          { id: 4, name: 'Beauty', icon: 'fas fa-magic', slug: 'beauty' },
          { id: 5, name: 'Sports', icon: 'fas fa-running', slug: 'sports' }
        ]);
      });

    // Products from API
    API.get('/products/?status=active')
      .then(res => setProducts(res.data.results || res.data))
      .catch(err => {
        // Fallback dummy products
        setProducts([
          { id: 1, name: 'Samsung Galaxy S24 Ultra', price: 149999, discount_price: 139999, is_flash_sale: true, slug: 'samsung-galaxy-s24-ultra', images: [{ image: '/images/phone.png' }] },
          { id: 2, name: 'Sony WH-1000XM5 Wireless Headphones', price: 38500, discount_price: 34999, is_flash_sale: true, slug: 'sony-headphones', images: [{ image: '/images/headphones.png' }] },
          { id: 3, name: 'Premium Leather Laptop Bag', price: 4500, discount_price: 3200, is_new_arrival: true, slug: 'laptop-bag', images: [{ image: '/images/bag.png' }] },
          { id: 4, name: 'Men Pro Running Shoes', price: 8500, discount_price: null, is_trending: true, slug: 'running-shoes', images: [{ image: '/images/sneakers.png' }] }
        ]);
      });
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('diu_cart', JSON.stringify(cart));
  }, [cart]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Cart operations
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        showToast(`${product.name} quantity updated!`);
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      showToast(`${product.name} added to cart!`);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'warning');
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.product.discount_price || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  // Filter products by tab
  const getFilteredProducts = () => {
    if (activeTab === 'flash') return products.filter(p => p.is_flash_sale);
    if (activeTab === 'new') return products.filter(p => p.is_new_arrival);
    if (activeTab === 'trending') return products.filter(p => p.is_trending);
    return products;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      showToast(`Searching for "${searchQuery}"`, 'info');
      // In full stack, this will fetch filtered products
      API.get(`/products/?search=${searchQuery}`)
        .then(res => setProducts(res.data.results || res.data));
    }
  };

  const handleCategorySelect = (slug) => {
    setCategoryMenuOpen(false);
    API.get(`/products/?category__slug=${slug}`)
      .then(res => {
        setProducts(res.data.results || res.data);
        showToast(`Showing products in ${slug}`, 'info');
      });
  };

  return (
    <div className="home-body">
      
      {/* TOAST CONTAINER */}
      <div className="toast-container" style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast-msg ${t.type}`} style={{ animation: 'slideIn 0.3s ease', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', background: '#333', color: '#fff', borderRadius: 8, marginBottom: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <i className={`fas ${t.type === 'success' ? 'fa-check-circle' : t.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`} style={{ color: t.type === 'success' ? '#10b981' : t.type === 'warning' ? '#f59e0b' : '#3b82f6' }} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* TOP BAR */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-left">
            <span><i className="fas fa-phone-alt"></i> +880 1900-000000</span>
            <span><i className="fas fa-envelope"></i> support@diustartup.com</span>
          </div>
          <div className="top-right">
            <span><i className="fas fa-truck"></i> Free Delivery on orders over ৳500</span>
            <Link to="/shop">Seller Dashboard</Link>
            <Link to="/admin" style={{ color: '#a5b4fc' }}><i className="fas fa-shield-halved"></i> Super Admin</Link>
            <a href="#">Help Center</a>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <div className="logo-icon"><i className="fas fa-rocket"></i></div>
            <div className="logo-text">
              <span className="logo-main">DIU</span>
              <span className="logo-sub">STARTUP</span>
            </div>
          </Link>

          <form onSubmit={handleSearchSubmit} className="search-wrapper">
            <div className="search-category-select">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Living</option>
                <option>Beauty</option>
                <option>Sports</option>
              </select>
            </div>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search for products, brands and categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn"><i class="fas fa-search"></i></button>
          </form>

          <div className="header-actions">
            <a href="#" className="action-btn" onClick={(e) => { e.preventDefault(); showToast('Wishlist feature is coming soon!', 'info'); }}>
              <i className="fas fa-heart"></i>
              <span className="action-label">Wishlist</span>
              <span className="badge">0</span>
            </a>
            <a href="#" className="action-btn" onClick={(e) => { e.preventDefault(); setCartOpen(true); }}>
              <i className="fas fa-shopping-cart"></i>
              <span className="action-label">Cart</span>
              <span className="badge">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </a>
            {user ? (
              <div className="account-dropdown-wrap" style={{ position: 'relative' }}>
                <a href="#" className="action-btn" onClick={(e) => e.preventDefault()}>
                  <i className="fas fa-user-circle"></i>
                  <span className="action-label">{user.full_name || 'Account'}</span>
                </a>
                <div className="account-dropdown" style={{ display: 'none' }}>
                  <Link to="/account">My Profile</Link>
                  <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Logout</a>
                </div>
              </div>
            ) : (
              <Link to="/login" className="action-btn">
                <i className="fas fa-sign-in-alt"></i>
                <span className="action-label">Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="navbar">
        <div className="container nav-inner">
          <div className="nav-categories-btn" onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}>
            <i className="fas fa-th-large"></i> All Categories <i className={`fas fa-chevron-${categoryMenuOpen ? 'up' : 'down'} cat-arrow`}></i>
          </div>
          <ul className="nav-links">
            <li><Link to="/" className="nav-link active">Home</Link></li>
            <li><a href="#" className="nav-link" onClick={() => handleCategorySelect('electronics')}>Electronics</a></li>
            <li><a href="#" className="nav-link" onClick={() => handleCategorySelect('fashion')}>Fashion</a></li>
            <li><a href="#" className="nav-link" onClick={() => handleCategorySelect('beauty')}>Beauty</a></li>
            <li><a href="#" className="nav-link" onClick={() => handleCategorySelect('sports')}>Sports</a></li>
            <li><a href="#flash-sale" className="nav-link flash-link"><i className="fas fa-bolt"></i> Flash Sale</a></li>
          </ul>
          <div className="nav-promo">
            <i className="fas fa-tag"></i> Up to <strong>70% OFF</strong> today!
          </div>
        </div>
        
        {/* Category Menu Dropdown */}
        {categoryMenuOpen && (
          <div className="category-menu" style={{ display: 'block' }}>
            <div className="container">
              <div className="cat-menu-grid">
                {categories.map(cat => (
                  <a key={cat.id} href="#" className="cat-menu-item" onClick={(e) => { e.preventDefault(); handleCategorySelect(cat.slug); }}>
                    <i className={cat.icon || 'fas fa-box'}></i>
                    <span>{cat.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* HERO BANNER SLIDER */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-slider-wrap">
            <div className="hero-slider">
              {currentSlide === 0 && (
                <div className="slide active">
                  <div className="slide-content">
                    <div className="slide-text">
                      <span className="slide-badge">🚀 New Arrival</span>
                      <h1 className="slide-title">Next-Gen<br/><span>Electronics</span></h1>
                      <p className="slide-desc">Discover the latest tech at unbeatable prices. Shop smartphones, laptops &amp; more.</p>
                      <div className="slide-price">Starting from <strong>৳2,499</strong></div>
                      <div className="slide-actions">
                        <button className="btn-primary" onClick={() => handleCategorySelect('electronics')}>Shop Now <i className="fas fa-arrow-right"></i></button>
                      </div>
                    </div>
                    <div className="slide-image">
                      <img src="/images/hero1.png" alt="Electronics Sale" />
                    </div>
                  </div>
                </div>
              )}
              {currentSlide === 1 && (
                <div className="slide active">
                  <div className="slide-content slide-content-red">
                    <div className="slide-text">
                      <span className="slide-badge badge-red">🔥 Flash Deals</span>
                      <h1 className="slide-title">Fashion<br/><span className="text-red">Sale Bonanza</span></h1>
                      <p className="slide-desc">Upgrade your wardrobe with premium brands. T-shirts, shoes &amp; accessories up to 70% off.</p>
                      <div className="slide-price">T-shirts from <strong>৳499</strong></div>
                      <div className="slide-actions">
                        <button className="btn-primary btn-red" onClick={() => handleCategorySelect('fashion')}>View Fashion <i className="fas fa-arrow-right"></i></button>
                      </div>
                    </div>
                    <div className="slide-image">
                      <img src="/images/hero2.png" alt="Fashion Sale" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="slider-nav">
              <button className="slider-btn" onClick={() => setCurrentSlide(prev => (prev === 0 ? 1 : 0))}><i className="fas fa-chevron-left"></i></button>
              <button className="slider-btn" onClick={() => setCurrentSlide(prev => (prev === 0 ? 1 : 0))}><i className="fas fa-chevron-right"></i></button>
            </div>
            <div className="slider-dots">
              <div className={`dot ${currentSlide === 0 ? 'active' : ''}`} onClick={() => setCurrentSlide(0)}></div>
              <div className={`dot ${currentSlide === 1 ? 'active' : ''}`} onClick={() => setCurrentSlide(1)}></div>
            </div>
          </div>
        </div>
      </section>

      {/* FLASH SALE */}
      <section className="flash-sale-section" id="flash-sale">
        <div className="container">
          <div className="flash-header">
            <div className="flash-title-wrap">
              <div className="flash-icon"><i className="fas fa-bolt"></i></div>
              <h2 className="section-heading">Flash Sale</h2>
              <div className="flash-timer">
                <span className="time-block">{String(countdown.hours).padStart(2, '0')}</span>:
                <span className="time-block">{String(countdown.minutes).padStart(2, '0')}</span>:
                <span className="time-block">{String(countdown.seconds).padStart(2, '0')}</span>
              </div>
            </div>
            <a href="#" className="view-all-btn">View All <i className="fas fa-chevron-right"></i></a>
          </div>

          <div className="products-grid">
            {products.filter(p => p.is_flash_sale).map(product => (
              <div key={product.id} className="product-card">
                {product.discount_price && (
                  <div className="badge-discount">-{Math.round(((product.price - product.discount_price) / product.price) * 100)}%</div>
                )}
                <div className="product-img-wrap" onClick={() => navigate(`/product/${product.id}`)}>
                  <img src={product.images?.[0]?.image || '/images/phone.png'} alt={product.name} />
                </div>
                <div className="product-info-wrap">
                  <h3 className="product-title" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</h3>
                  <div className="product-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                    <span className="rating-count">(45)</span>
                  </div>
                  <div className="product-price-wrap">
                    <span className="current-price">৳{product.discount_price || product.price}</span>
                    {product.discount_price && <span className="old-price">৳{product.price}</span>}
                  </div>
                  <button className="add-cart-btn" onClick={() => addToCart(product)}>
                    <i className="fas fa-shopping-cart"></i> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header-wrap">
            <h2 className="section-heading">Featured Products</h2>
            <div className="tabs-wrap">
              <button className={`tab-link ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All</button>
              <button className={`tab-link ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>New Arrivals</button>
              <button className={`tab-link ${activeTab === 'trending' ? 'active' : ''}`} onClick={() => setActiveTab('trending')}>Trending</button>
            </div>
          </div>

          <div className="products-grid">
            {getFilteredProducts().map(product => (
              <div key={product.id} className="product-card">
                <div className="product-img-wrap" onClick={() => navigate(`/product/${product.id}`)}>
                  <img src={product.images?.[0]?.image || '/images/phone.png'} alt={product.name} />
                </div>
                <div className="product-info-wrap">
                  <h3 className="product-title" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</h3>
                  <div className="product-rating">
                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="far fa-star"></i>
                    <span className="rating-count">(12)</span>
                  </div>
                  <div className="product-price-wrap">
                    <span className="current-price">৳{product.discount_price || product.price}</span>
                    {product.discount_price && <span className="old-price">৳{product.price}</span>}
                  </div>
                  <button className="add-cart-btn" onClick={() => addToCart(product)}>
                    <i className="fas fa-shopping-cart"></i> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-col">
            <div className="logo" style={{ marginBottom: 15 }}>
              <div className="logo-icon"><i className="fas fa-rocket"></i></div>
              <div className="logo-text">
                <span className="logo-main" style={{ color: '#fff' }}>DIU</span>
                <span className="logo-sub" style={{ color: 'var(--primary)' }}>STARTUP</span>
              </div>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.6' }}>
              Bangladesh's premier student-powered e-commerce startup program.
            </p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/shop">Become a Seller</Link></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Return Policy</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact Us</h4>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              Daffodil Smart City, Savar, Dhaka<br/>
              Email: support@diustartup.com
            </p>
          </div>
        </div>
      </footer>

      {/* CART SIDEBAR PANEL */}
      {cartOpen && (
        <div className="cart-sidebar-overlay" onClick={() => setCartOpen(false)} style={{ display: 'block', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000 }}>
          <div className="cart-sidebar" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', position: 'fixed', right: 0, top: 0, bottom: 0, width: 380, background: '#fff', boxShadow: '-4px 0 20px rgba(0,0,0,0.15)', zIndex: 10001, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 15 }}>
              <h3>Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: 'none', fontSize: '1.2rem', color: '#64748b' }}><i className="fas fa-times"></i></button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', marginTop: 15 }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: 100, color: '#94a3b8' }}>
                  <i className="fas fa-shopping-cart" style={{ fontSize: '3rem', marginBottom: 15 }}></i>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <img src={item.product.images?.[0]?.image || '/images/phone.png'} alt={item.product.name} style={{ width: 60, height: 60, objectFit: 'contain', border: '1px solid #f1f5f9', borderRadius: 6 }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{item.product.name}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => updateCartQty(item.product.id, -1)} style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateCartQty(item.product.id, 1)} style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>+</button>
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>৳{(item.product.discount_price || item.product.price) * item.quantity}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} style={{ color: '#ef4444', alignSelf: 'center', background: 'none' }}><i className="fas fa-trash"></i></button>
                  </div>
                ))
              )}
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, fontWeight: 700 }}>
                <span>Subtotal:</span>
                <span>৳{cartTotal.toLocaleString()}</span>
              </div>
              <button 
                onClick={() => { setCartOpen(false); navigate('/checkout'); }} 
                className="btn-primary" 
                style={{ width: '100%', padding: '12px 0', borderRadius: 8, fontSize: '0.95rem' }}
                disabled={cart.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
