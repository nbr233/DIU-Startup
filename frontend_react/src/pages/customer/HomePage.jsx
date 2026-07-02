import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/style.css';

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('diu_startup_cart')) || [];
    } catch {
      return [];
    }
  });

  // UI state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [countdown, setCountdown] = useState({ hours: 8, minutes: 45, seconds: 30 });
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [showToastFlag, setShowToastFlag] = useState(false);
  const toastTimeoutRef = useRef(null);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToastFlag(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToastFlag(false);
    }, 3000);
  };

  // Fetch products
  useEffect(() => {
    API.get('/products/?status=active')
      .then(res => {
        setProducts(res.data.results || res.data);
      })
      .catch(() => {
        // Fallback static DB if backend is not seeded/reachable
        setProducts([
          { id: 1, name: 'Samsung Galaxy S24 Ultra', category: 'electronics', price: 149999, old_price: 185000, discount: 19, rating: 4.9, reviews: 2341, sold: 68, stock: 45, is_flash_sale: true, images: [{ image: 'images/phone.png' }] },
          { id: 2, name: 'Sony WH-1000XM5', category: 'electronics', price: 38500, old_price: 45000, discount: 14, rating: 4.8, reviews: 1873, sold: 72, stock: 8, is_flash_sale: true, images: [{ image: 'images/headphones.png' }] },
          { id: 3, name: 'Premium Leather Laptop Bag', category: 'fashion', price: 4500, old_price: 6000, discount: 25, rating: 4.6, reviews: 89, sold: 30, stock: 120, is_new_arrival: true, images: [{ image: 'images/bag.png' }] },
          { id: 4, name: 'Men Pro Running Shoes', category: 'sports', price: 8500, old_price: 10000, discount: 15, rating: 4.5, reviews: 120, sold: 40, stock: 35, is_trending: true, images: [{ image: 'images/sneakers.png' }] }
        ]);
      });
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 45, seconds: 30 }; // Reset
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem('diu_startup_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        triggerToast(`✅ ${product.name} quantity updated!`);
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      triggerToast(`✅ ${product.name} added to cart!`);
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.discount_price || product.price,
        img: product.images?.[0]?.image || 'images/phone.png',
        qty: 1
      }];
    });
  };

  const changeQty = (name, delta) => {
    setCart(prev => prev.map(item => {
      if (item.name === name) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const removeFromCart = (name) => {
    setCart(prev => prev.filter(item => item.name !== name));
    triggerToast(`🗑️ Removed from cart`);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      triggerToast(`🔍 Searching for "${searchQuery}"...`);
    }
  };

  return (
    <div className="home-body">

      {/* TOP BAR */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-left">
            <span><i className="fas fa-phone-alt"></i> +880 1900-000000</span>
            <span><i className="fas fa-envelope"></i> support@diustartup.com</span>
          </div>
          <div className="top-right">
            <span><i className="fas fa-truck"></i> Free Delivery on orders over ৳500</span>
            <Link to="/shop" id="top-seller-link">Seller Dashboard</Link>
            <Link to="/admin" id="top-admin-link" style={{ color: '#a5b4fc' }}><i className="fas fa-shield-halved" style={{ fontSize: '0.7rem' }}></i> Super Admin</Link>
            <a href="#" id="top-help-link">Help Center</a>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="header" id="main-header">
        <div className="container header-inner">
          <Link to="/" className="logo" id="site-logo">
            <div className="logo-icon"><i className="fas fa-rocket"></i></div>
            <div className="logo-text">
              <span className="logo-main">DIU</span>
              <span className="logo-sub">STARTUP</span>
            </div>
          </Link>
          <div className="search-wrapper" id="main-search">
            <div className="search-category-select">
              <select id="search-category-dropdown">
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
              id="search-input" 
              className="search-input" 
              placeholder="Search for products, brands and categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
            />
            <button className="search-btn" id="search-button" onClick={() => triggerToast(`🔍 Searching for "${searchQuery}"...`)}><i className="fas fa-search"></i></button>
          </div>
          <div className="header-actions">
            <a href="#" className="action-btn" id="header-wishlist" onClick={(e) => { e.preventDefault(); setWishlistCount(prev => prev + 1); triggerToast('❤️ Added to wishlist!'); }}>
              <i className="fas fa-heart"></i>
              <span className="action-label">Wishlist</span>
              <span className="badge" id="wishlist-badge">{wishlistCount}</span>
            </a>
            <a href="#" className="action-btn" id="header-cart" onClick={(e) => { e.preventDefault(); setCartOpen(true); }}>
              <i className="fas fa-shopping-cart"></i>
              <span className="action-label">Cart</span>
              <span className="badge" id="cart-badge">{cartCount}</span>
            </a>
            <Link to="/login" className="action-btn" id="header-account">
              <i className="fas fa-user-circle"></i>
              <span className="action-label">Account</span>
            </Link>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="navbar" id="main-navbar">
        <div className="container nav-inner">
          <div className="nav-categories-btn" id="all-categories-btn" onClick={() => setCatMenuOpen(!catMenuOpen)}>
            <i className="fas fa-th-large"></i> All Categories <i className="fas fa-chevron-down cat-arrow"></i>
          </div>
          <ul className="nav-links" id="nav-links-list">
            <li><Link to="/" className="nav-link active">Home</Link></li>
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); triggerToast('Electronics Filtered!'); }}>Electronics</a></li>
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); triggerToast('Fashion Filtered!'); }}>Fashion</a></li>
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); triggerToast('Home Filtered!'); }}>Home & Living</a></li>
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); triggerToast('Beauty Filtered!'); }}>Beauty</a></li>
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); triggerToast('Sports Filtered!'); }}>Sports</a></li>
            <li><a href="#flash-sale" className="nav-link flash-link"><i className="fas fa-bolt"></i> Flash Sale</a></li>
            <li><a href="#top-brands" className="nav-link">Brands</a></li>
          </ul>
          <div className="nav-promo">
            <i className="fas fa-tag"></i> Up to <strong>70% OFF</strong> today!
          </div>
        </div>

        {/* Categories Menu */}
        <div className={`category-menu ${catMenuOpen ? 'open' : ''}`} id="category-menu">
          <div className="container">
            <div className="cat-menu-grid">
              <a href="#" className="cat-menu-item" onClick={(e) => { e.preventDefault(); setCatMenuOpen(false); triggerToast('Electronics Selected'); }}><i className="fas fa-mobile-alt"></i><span>Electronics</span></a>
              <a href="#" class="cat-menu-item" onClick={(e) => { e.preventDefault(); setCatMenuOpen(false); triggerToast('Fashion Selected'); }}><i className="fas fa-tshirt"></i><span>Fashion</span></a>
              <a href="#" class="cat-menu-item" onClick={(e) => { e.preventDefault(); setCatMenuOpen(false); triggerToast('Home Selected'); }}><i className="fas fa-couch"></i><span>Home & Living</span></a>
              <a href="#" class="cat-menu-item" onClick={(e) => { e.preventDefault(); setCatMenuOpen(false); triggerToast('Beauty Selected'); }}><i className="fas fa-magic"></i><span>Beauty</span></a>
              <a href="#" class="cat-menu-item" onClick={(e) => { e.preventDefault(); setCatMenuOpen(false); triggerToast('Sports Selected'); }}><i className="fas fa-running"></i><span>Sports</span></a>
              <a href="#" class="cat-menu-item" onClick={(e) => { e.preventDefault(); setCatMenuOpen(false); triggerToast('Books Selected'); }}><i className="fas fa-book"></i><span>Books</span></a>
              <a href="#" class="cat-menu-item" onClick={(e) => { e.preventDefault(); setCatMenuOpen(false); triggerToast('Gaming Selected'); }}><i className="fas fa-gamepad"></i><span>Gaming</span></a>
              <a href="#" class="cat-menu-item" onClick={(e) => { e.preventDefault(); setCatMenuOpen(false); triggerToast('Baby Selected'); }}><i className="fas fa-baby"></i><span>Baby & Kids</span></a>
              <a href="#" class="cat-menu-item" onClick={(e) => { e.preventDefault(); setCatMenuOpen(false); triggerToast('Automotive Selected'); }}><i className="fas fa-car"></i><span>Automotive</span></a>
              <a href="#" class="cat-menu-item" onClick={(e) => { e.preventDefault(); setCatMenuOpen(false); triggerToast('Grocery Selected'); }}><i className="fas fa-shopping-basket"></i><span>Grocery</span></a>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO BANNER SLIDER */}
      <section className="hero-section" id="hero-section">
        <div className="container hero-container">
          <div className="hero-slider-wrap">
            <div className="hero-slider" id="hero-slider">
              
              <div className={`slide ${currentSlide === 0 ? 'active' : ''}`} id="slide-1">
                <div className="slide-content">
                  <div className="slide-text">
                    <span className="slide-badge">🚀 New Arrival</span>
                    <h1 className="slide-title">Next-Gen<br/><span>Electronics</span></h1>
                    <p className="slide-desc">Discover the latest tech at unbeatable prices. Shop smartphones, laptops &amp; more.</p>
                    <div className="slide-price">Starting from <strong>৳2,499</strong></div>
                    <div className="slide-actions">
                      <button className="btn-primary" id="slide1-shop-btn" onClick={() => triggerToast('Electronics category opened!')}>Shop Now <i className="fas fa-arrow-right"></i></button>
                      <button className="btn-outline" id="slide1-explore-btn">Explore All</button>
                    </div>
                  </div>
                  <div className="slide-image">
                    <img src="images/hero1.png" alt="Electronics Sale" />
                  </div>
                </div>
              </div>

              <div className={`slide ${currentSlide === 1 ? 'active' : ''}`} id="slide-2">
                <div className="slide-content slide-content-red">
                  <div className="slide-text">
                    <span className="slide-badge badge-red">🔥 Flash Deals</span>
                    <h1 className="slide-title">Fashion<br/><span className="text-red">Sale Bonanza</span></h1>
                    <p className="slide-desc">Trendy styles at crazy low prices! Up to 70% off on top fashion brands today only.</p>
                    <div className="slide-price">Up to <strong className="text-red">70% OFF</strong></div>
                    <div className="slide-actions">
                      <button className="btn-red" id="slide2-shop-btn" onClick={() => triggerToast('Fashion deals loaded!')}>Grab Deals <i className="fas fa-fire"></i></button>
                      <button className="btn-outline-white" id="slide2-explore-btn">View All</button>
                    </div>
                  </div>
                  <div className="slide-image">
                    <img src="images/hero2.png" alt="Fashion Sale" />
                  </div>
                </div>
              </div>

              <div className={`slide ${currentSlide === 2 ? 'active' : ''}`} id="slide-3">
                <div className="slide-content slide-content-dark">
                  <div className="slide-text">
                    <span className="slide-badge badge-purple">⚡ Tech Week</span>
                    <h1 className="slide-title">Gadgets &amp;<br/><span className="text-purple">Gizmos</span></h1>
                    <p className="slide-desc">Power up your life with cutting-edge gadgets. Exclusive deals for early birds!</p>
                    <div className="slide-price">From <strong className="text-purple">৳999</strong></div>
                    <div className="slide-actions">
                      <button className="btn-purple" id="slide3-shop-btn" onClick={() => triggerToast('Gadgets shop opened!')}>Shop Gadgets <i className="fas fa-bolt"></i></button>
                      <button className="btn-outline-light" id="slide3-explore-btn">Browse All</button>
                    </div>
                  </div>
                  <div className="slide-image">
                    <img src="images/hero3.png" alt="Tech Gadgets" />
                  </div>
                </div>
              </div>

            </div>
            <button className="slider-btn prev" id="slider-prev" onClick={() => setCurrentSlide(prev => (prev === 0 ? 2 : prev - 1))}><i className="fas fa-chevron-left"></i></button>
            <button className="slider-btn next" id="slider-next" onClick={() => setCurrentSlide(prev => (prev === 2 ? 0 : prev + 1))}><i className="fas fa-chevron-right"></i></button>
            <div className="slider-dots" id="slider-dots">
              <button className={`dot ${currentSlide === 0 ? 'active' : ''}`} onClick={() => setCurrentSlide(0)}></button>
              <button className={`dot ${currentSlide === 1 ? 'active' : ''}`} onClick={() => setCurrentSlide(1)}></button>
              <button className={`dot ${currentSlide === 2 ? 'active' : ''}`} onClick={() => setCurrentSlide(2)}></button>
            </div>
          </div>

          <div className="hero-side-banners">
            <div className="side-banner side-banner-1" id="side-banner-flash">
              <div className="side-banner-content">
                <i className="fas fa-bolt sb-icon"></i>
                <span className="sb-label">Flash Sale</span>
                <span className="sb-sub">Up to 60% OFF</span>
                <a href="#flash-sale" className="sb-btn">Shop Now</a>
              </div>
            </div>
            <div className="side-banner side-banner-2" id="side-banner-new">
              <div className="side-banner-content">
                <i className="fas fa-star sb-icon"></i>
                <span className="sb-label">New Arrivals</span>
                <span className="sb-sub">Latest Collection</span>
                <a href="#new-arrivals" className="sb-btn">Explore</a>
              </div>
            </div>
            <div className="side-banner side-banner-3" id="side-banner-brand">
              <div className="side-banner-content">
                <i className="fas fa-crown sb-icon"></i>
                <span className="sb-label">Top Brands</span>
                <span className="sb-sub">Premium Quality</span>
                <a href="#top-brands" className="sb-btn">Discover</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMO STRIP */}
      <section className="promo-strip">
        <div className="container promo-grid">
          <div className="promo-item"><i className="fas fa-shipping-fast"></i><div><strong>Free Shipping</strong><span>On orders above ৳500</span></div></div>
          <div className="promo-item"><i className="fas fa-undo-alt"></i><div><strong>Easy Returns</strong><span>7-day return policy</span></div></div>
          <div className="promo-item"><i className="fas fa-shield-alt"></i><div><strong>Secure Payment</strong><span>100% protected checkout</span></div></div>
          <div className="promo-item"><i className="fas fa-headset"></i><div><strong>24/7 Support</strong><span>We're always here</span></div></div>
          <div className="promo-item"><i className="fas fa-certificate"></i><div><strong>100% Genuine</strong><span>Authentic products only</span></div></div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="section categories-section" id="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <a href="#" className="view-all-link">View All <i className="fas fa-arrow-right"></i></a>
          </div>
          <div className="categories-grid" id="categories-grid">
            <a href="#" className="category-card" onClick={(e) => { e.preventDefault(); triggerToast('Electronics Category selected'); }}><div className="cat-icon-wrap" style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}><i className="fas fa-mobile-alt"></i></div><span>Electronics</span></a>
            <a href="#" className="category-card" onClick={(e) => { e.preventDefault(); triggerToast('Fashion Category selected'); }}><div className="cat-icon-wrap" style={{ background: 'linear-gradient(135deg,#f093fb,#f5576c)' }}><i className="fas fa-tshirt"></i></div><span>Fashion</span></a>
            <a href="#" className="category-card" onClick={(e) => { e.preventDefault(); triggerToast('Home Category selected'); }}><div className="cat-icon-wrap" style={{ background: 'linear-gradient(135deg,#4facfe,#00f2fe)' }}><i className="fas fa-couch"></i></div><span>Home & Living</span></a>
            <a href="#" className="category-card" onClick={(e) => { e.preventDefault(); triggerToast('Beauty Category selected'); }}><div className="cat-icon-wrap" style={{ background: 'linear-gradient(135deg,#fa709a,#fee140)' }}><i className="fas fa-magic"></i></div><span>Beauty</span></a>
            <a href="#" className="category-card" onClick={(e) => { e.preventDefault(); triggerToast('Sports Category selected'); }}><div className="cat-icon-wrap" style={{ background: 'linear-gradient(135deg,#43e97b,#38f9d7)' }}><i className="fas fa-running"></i></div><span>Sports</span></a>
            <a href="#" className="category-card" onClick={(e) => { e.preventDefault(); triggerToast('Books Category selected'); }}><div className="cat-icon-wrap" style={{ background: 'linear-gradient(135deg,#f7971e,#ffd200)' }}><i className="fas fa-book-open"></i></div><span>Books</span></a>
            <a href="#" className="category-card" onClick={(e) => { e.preventDefault(); triggerToast('Gaming Category selected'); }}><div className="cat-icon-wrap" style={{ background: 'linear-gradient(135deg,#30cfd0,#330867)' }}><i className="fas fa-gamepad"></i></div><span>Gaming</span></a>
            <a href="#" className="category-card" onClick={(e) => { e.preventDefault(); triggerToast('Baby Category selected'); }}><div className="cat-icon-wrap" style={{ background: 'linear-gradient(135deg,#a18cd1,#fbc2eb)' }}><i className="fas fa-baby-carriage"></i></div><span>Baby & Kids</span></a>
            <a href="#" className="category-card" onClick={(e) => { e.preventDefault(); triggerToast('Automotive Category selected'); }}><div className="cat-icon-wrap" style={{ background: 'linear-gradient(135deg,#fd7043,#e64a19)' }}><i className="fas fa-car"></i></div><span>Automotive</span></a>
            <a href="#" className="category-card" onClick={(e) => { e.preventDefault(); triggerToast('Grocery Category selected'); }}><div className="cat-icon-wrap" style={{ background: 'linear-gradient(135deg,#56ab2f,#a8e063)' }}><i className="fas fa-shopping-basket"></i></div><span>Grocery</span></a>
          </div>
        </div>
      </section>

      {/* FLASH SALE */}
      <section className="section flash-sale-section" id="flash-sale">
        <div className="container">
          <div className="flash-header">
            <div className="flash-title-wrap">
              <i className="fas fa-bolt flash-bolt"></i>
              <h2 className="flash-title">Flash Sale</h2>
              <i className="fas fa-bolt flash-bolt"></i>
            </div>
            <div className="flash-timer-wrap">
              <span className="timer-label">Ends in:</span>
              <div className="countdown">
                <div className="time-block"><span>{String(countdown.hours).padStart(2, '0')}</span><small>HRS</small></div>
                <span className="colon">:</span>
                <div className="time-block"><span>{String(countdown.minutes).padStart(2, '0')}</span><small>MIN</small></div>
                <span className="colon">:</span>
                <div className="time-block"><span>{String(countdown.seconds).padStart(2, '0')}</span><small>SEC</small></div>
              </div>
            </div>
            <a href="#" className="view-all-link">View All <i className="fas fa-arrow-right"></i></a>
          </div>
          
          <div className="products-scroll" id="flash-products">
            {products.filter(p => p.is_flash_sale).map(product => (
              <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
                <div className="product-img-wrap">
                  <img src={product.images?.[0]?.image || 'images/phone.png'} alt={product.name} />
                  <span className="product-badge">-{product.discount || 19}%</span>
                  <button className="wishlist-btn" onClick={(e) => { e.stopPropagation(); setWishlistCount(prev => prev + 1); triggerToast('❤️ Added to wishlist!'); }}>
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="stars">
                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                    <span>(2,341)</span>
                  </div>
                  <div className="product-price">
                    <span className="price-now">৳{(product.discount_price || product.price).toLocaleString()}</span>
                    <span className="price-old">৳{(product.price).toLocaleString()}</span>
                  </div>
                  <div className="flash-progress">
                    <div className="progress-label">🔥 {product.sold || 58}% sold</div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${product.sold || 58}%` }}></div></div>
                  </div>
                  <button className="add-cart-btn" style={{ marginTop: 8 }} onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
                    <i className="fas fa-bolt"></i> Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section" id="featured-products">
        <div className="container">
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-tag">⭐ Curated Picks</span>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <a href="#" className="view-all-link">View All <i className="fas fa-arrow-right"></i></a>
          </div>
          <div className="tab-bar" id="featured-tabs">
            <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All</button>
            <button className={`tab-btn ${activeTab === 'electronics' ? 'active' : ''}`} onClick={() => setActiveTab('electronics')}>Electronics</button>
            <button className={`tab-btn ${activeTab === 'fashion' ? 'active' : ''}`} onClick={() => setActiveTab('fashion')}>Fashion</button>
            <button className={`tab-btn ${activeTab === 'beauty' ? 'active' : ''}`} onClick={() => setActiveTab('beauty')}>Beauty</button>
          </div>
          <div className="products-grid" id="featured-grid">
            {products.filter(p => activeTab === 'all' || p.category === activeTab).map(product => (
              <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
                <div className="product-img-wrap">
                  <img src={product.images?.[0]?.image || 'images/phone.png'} alt={product.name} />
                  {product.discount && <span className="product-badge">-{product.discount}%</span>}
                  <button className="wishlist-btn" onClick={(e) => { e.stopPropagation(); setWishlistCount(prev => prev + 1); triggerToast('❤️ Added to wishlist!'); }}>
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="stars">
                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
                    <span>(1,873)</span>
                  </div>
                  <div className="product-price">
                    <span className="price-now">৳{(product.discount_price || product.price).toLocaleString()}</span>
                    {product.discount_price && <span className="price-old">৳{product.price.toLocaleString()}</span>}
                  </div>
                  <button className="add-cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
                    <i className="fas fa-cart-plus"></i> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="section bestsellers-section" id="best-sellers">
        <div className="container">
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-tag">🏆 Most Popular</span>
              <h2 className="section-title">Best Sellers</h2>
            </div>
            <a href="#" className="view-all-link">View All <i className="fas fa-arrow-right"></i></a>
          </div>
          <div className="bestsellers-layout">
            <div className="bestseller-hero" id="bestseller-hero">
              <div className="bs-hero-badge">#1 Best Seller</div>
              <img src="images/laptop.png" alt="Best Seller Laptop" />
              <div className="bs-hero-info">
                <h3>UltraBook Pro X15</h3>
                <div className="stars">
                  <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
                  <span>(4.8k reviews)</span>
                </div>
                <div className="product-price">
                  <span className="price-now">৳89,999</span>
                  <span className="price-old">৳1,10,000</span>
                  <span className="discount-badge">-18%</span>
                </div>
                <button className="btn-primary" onClick={() => triggerToast('UltraBook Pro X15 added to cart!')}>Add to Cart <i className="fas fa-shopping-cart"></i></button>
              </div>
            </div>
            <div className="bestsellers-list" id="bestsellers-list">
              <div className="bs-list-item" onClick={() => triggerToast('Sony WH-1000XM5 added to cart!')}>
                <span className="bs-rank">#2</span>
                <img className="bs-img" src="images/headphones.png" alt="Sony Headphones" />
                <div className="bs-info">
                  <div className="bs-name">Sony WH-1000XM5</div>
                  <div className="stars"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                  <div className="product-price"><span className="price-now">৳29,999</span></div>
                </div>
              </div>
              <div className="bs-list-item" onClick={() => triggerToast('Smart Fitness Watch added to cart!')}>
                <span className="bs-rank">#3</span>
                <img className="bs-img" src="images/watch.png" alt="Smart Watch" />
                <div className="bs-info">
                  <div className="bs-name">Smart Fitness Watch</div>
                  <div className="stars"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                  <div className="product-price"><span className="price-now">৳14,999</span></div>
                </div>
              </div>
              <div className="bs-list-item" onClick={() => triggerToast('Samsung Galaxy S24 added to cart!')}>
                <span className="bs-rank">#4</span>
                <img className="bs-img" src="images/phone.png" alt="Samsung S24" />
                <div className="bs-info">
                  <div className="bs-name">Samsung Galaxy S24</div>
                  <div className="stars"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                  <div className="product-price"><span className="price-now">৳149,999</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="section" id="new-arrivals">
        <div className="container">
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-tag">🆕 Just In</span>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <a href="#" className="view-all-link">View All <i className="fas fa-arrow-right"></i></a>
          </div>
          <div className="new-arrivals-grid" id="new-arrivals-grid">
            {products.filter(p => p.is_new_arrival).slice(0, 8).map(product => (
              <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
                <div className="product-img-wrap">
                  <img src={product.images?.[0]?.image || 'images/phone.png'} alt={product.name} />
                  <span className="product-badge new-badge">NEW</span>
                  <button className="wishlist-btn" onClick={(e) => { e.stopPropagation(); setWishlistCount(prev => prev + 1); triggerToast('❤️ Added to wishlist!'); }}>
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="stars">
                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                  </div>
                  <div className="product-price">
                    <span className="price-now">৳{(product.discount_price || product.price).toLocaleString()}</span>
                  </div>
                  <button className="add-cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
                    <i className="fas fa-cart-plus"></i> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING PRODUCTS */}
      <section className="section trending-section" id="trending-products">
        <div className="container">
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-tag">🔥 Trending Now</span>
              <h2 className="section-title">Trending Products</h2>
            </div>
            <a href="#" className="view-all-link">View All <i className="fas fa-arrow-right"></i></a>
          </div>
          <div className="products-scroll" id="trending-products-list">
            {products.filter(p => p.is_trending).map(product => (
              <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
                <div className="product-img-wrap">
                  <img src={product.images?.[0]?.image || 'images/phone.png'} alt={product.name} />
                  <button className="wishlist-btn" onClick={(e) => { e.stopPropagation(); setWishlistCount(prev => prev + 1); triggerToast('❤️ Added to wishlist!'); }}>
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="stars">
                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                  </div>
                  <div className="product-price">
                    <span className="price-now">৳{(product.discount_price || product.price).toLocaleString()}</span>
                  </div>
                  <button className="add-cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
                    <i className="fas fa-cart-plus"></i> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP BRANDS */}
      <section className="section brands-section" id="top-brands">
        <div className="container">
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-tag">👑 Premium</span>
              <h2 className="section-title">Top Brands</h2>
            </div>
          </div>
          <div className="brands-track-wrap">
            <div className="brands-track" id="brands-track">
              <div className="brand-card"><span className="brand-letter" style={{ background: '#1428A0' }}>S</span><span>Samsung</span></div>
              <div className="brand-card"><span className="brand-letter" style={{ background: '#555' }}>A</span><span>Apple</span></div>
              <div className="brand-card"><span className="brand-letter" style={{ background: '#0047AB' }}>S</span><span>Sony</span></div>
              <div className="brand-card"><span className="brand-letter" style={{ background: '#111' }}>N</span><span>Nike</span></div>
              <div className="brand-card"><span className="brand-letter" style={{ background: '#000' }}>A</span><span>Adidas</span></div>
              <div className="brand-card"><span className="brand-letter" style={{ background: '#c00' }}>L</span><span>LG</span></div>
              <div className="brand-card"><span className="brand-letter" style={{ background: '#FF6900' }}>X</span><span>Xiaomi</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIAL OFFERS */}
      <section className="section special-offers-section" id="special-offers">
        <div className="container">
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-tag">🎁 Exclusive</span>
              <h2 className="section-title">Special Offers</h2>
            </div>
          </div>
          <div className="offers-grid">
            <div className="offer-card offer-mega">
              <img src="images/special_offer.png" alt="Mega Sale" />
              <div className="offer-overlay">
                <span className="offer-badge">MEGA SALE</span>
                <h3>Up to 70% OFF<br/>on Everything!</h3>
                <p>Limited time offer – don't miss out!</p>
                <button className="btn-primary" onClick={() => triggerToast('Mega Sale activated! 🎉')}>Shop Now</button>
              </div>
            </div>
            <div className="offers-sub-grid">
              <div className="offer-card offer-sm">
                <div className="offer-sm-content" style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)' }}>
                  <div><span className="offer-tag">Electronics</span><h4>Phones &amp; Gadgets</h4><p>Up to <strong>50% OFF</strong></p><a href="#" className="offer-link">Shop →</a></div>
                  <i className="fas fa-mobile-alt offer-icon"></i>
                </div>
              </div>
              <div className="offer-card offer-sm">
                <div className="offer-sm-content" style={{ background: 'linear-gradient(135deg,#8e0038,#c0003c)' }}>
                  <div><span className="offer-tag">Fashion</span><h4>Apparel &amp; Accessories</h4><p>Up to <strong>60% OFF</strong></p><a href="#" className="offer-link">Shop →</a></div>
                  <i className="fas fa-tshirt offer-icon"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="site-footer">
        <div className="container footer-grid">
          <div className="footer-col footer-brand-col">
            <div className="footer-logo">
              <i className="fas fa-rocket"></i>
              <span>DIU Startup</span>
            </div>
            <p>Bangladesh's premier e-commerce destination — empowering students and entrepreneurs to shop smart.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/become-seller">Become a Seller</Link></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Return Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <p>&copy; 2024 DIU Startup. All rights reserved. | Designed with ❤️ for Bangladesh</p>
          </div>
        </div>
      </footer>

      {/* CART SIDEBAR */}
      <div className={`cart-overlay ${cartOpen ? 'active' : ''}`} id="cart-overlay" onClick={() => setCartOpen(false)}></div>
      <div className={`cart-sidebar ${cartOpen ? 'open' : ''}`} id="cart-sidebar">
        <div className="cart-header">
          <h3><i className="fas fa-shopping-cart"></i> My Cart</h3>
          <button onClick={() => setCartOpen(false)} id="close-cart-btn"><i className="fas fa-times"></i></button>
        </div>
        <div className="cart-items" id="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty" id="cart-empty-msg">
              <i className="fas fa-shopping-cart"></i>
              <p>Your cart is empty</p>
              <span>Add some products to get started!</span>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.img} alt={item.name} />
                <div className="cart-item-info">
                  <div className="name">{item.name}</div>
                  <div className="price">৳{item.price.toLocaleString()}</div>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => changeQty(item.name, -1)}>−</button>
                    <span className="qty-display">{item.qty}</span>
                    <button className="qty-btn" onClick={() => changeQty(item.name, 1)}>+</button>
                  </div>
                </div>
                <button className="remove-item" onClick={() => removeFromCart(item.name)}><i className="fas fa-trash"></i></button>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer" id="cart-footer">
          <div className="cart-total">Total: <strong id="cart-total">৳{cartTotal.toLocaleString()}</strong></div>
          <button className="btn-primary full-width" id="checkout-btn" onClick={() => { setCartOpen(false); navigate('/checkout'); }}>Checkout <i className="fas fa-arrow-right"></i></button>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <div className={`toast ${showToastFlag ? 'show' : ''}`} id="toast-notification">
        {toastMsg}
      </div>

    </div>
  );
}
