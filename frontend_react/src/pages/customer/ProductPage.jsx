import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/style.css';
import '../../styles/product.css';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Custom Reviews State (prepend new submissions)
  const [reviews, setReviews] = useState([]);
  const [reviewStarSelected, setReviewStarSelected] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');

  // Custom Q&A State
  const [qnaList, setQnaList] = useState([
    { q: 'Does it come with a warranty?', a: 'Yes! This product comes with full official warranty as mentioned in the specifications.', asker: 'Karim', date: '12 Jun 2024', seller: true },
    { q: 'Is cash on delivery available?', a: 'Yes, we offer Cash on Delivery (COD) across all 64 districts of Bangladesh.', asker: 'Rima', date: '8 Jun 2024', seller: true },
    { q: 'Can I return the product if I don\'t like it?', a: 'Yes! We have a 7-day easy return policy. Please make sure the product is unused and in original packaging.', asker: 'Syed', date: '1 Jun 2024', seller: true },
  ]);
  const [questionText, setQuestionText] = useState('');

  // Cart & UI State (synced with diu_startup_cart)
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('diu_startup_cart')) || [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Sticky bar & scroll variables
  const [stickyVisible, setStickyVisible] = useState(false);
  const [scrollTopVisible, setScrollTopVisible] = useState(false);
  const [scrolledHeader, setScrolledHeader] = useState(false);

  // Toast State
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

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('diu_startup_cart', JSON.stringify(cart));
  }, [cart]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrollTopVisible(scrollY > 500);
      setScrolledHeader(scrollY > 60);

      // Sticky Bottom Bar trigger when product info section is passed
      const infoEl = document.getElementById('pd-info-block');
      if (infoEl) {
        const infoBottom = infoEl.getBoundingClientRect().bottom;
        setStickyVisible(infoBottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch product, related, and reviews data on ID change
  useEffect(() => {
    setLoading(true);
    API.get(`/products/${id}/`)
      .then(res => {
        const prod = res.data;
        setProduct(prod);
        setSelectedImage(prod.images?.[0]?.image || '/images/phone.png');
        setLoading(false);

        // Fetch related products in same category
        if (prod.category) {
          API.get(`/products/?category__slug=${prod.category_slug || ''}`)
            .then(rRes => {
              const list = rRes.data.results || rRes.data;
              setRelatedProducts(list.filter(p => p.id !== prod.id).slice(0, 4));
            })
            .catch(() => {
              setRelatedProducts([]);
            });
        }

        // Save to recently viewed
        saveToRecentlyViewed(prod);
      })
      .catch(() => {
        // Fallback dummy product if API fails
        const dummyProd = {
          id: parseInt(id) || 1,
          name: 'Samsung Galaxy S24 Ultra',
          brand_name: 'Samsung',
          category_name: 'Electronics',
          price: 149999,
          discount_price: 139999,
          stock: 12,
          sku: 'SM-S24U-256',
          description: 'Samsung Galaxy S24 Ultra smartphone, 12GB RAM, 256GB storage, Titanium Gray.',
          images: [{ image: '/images/phone.png' }, { image: '/images/headphones.png' }],
          variants: [
            { id: 1, variant_type: 'color', value: 'Titanium Gray' },
            { id: 2, variant_type: 'color', value: 'Titanium Black' },
            { id: 3, variant_type: 'size', value: '256GB' },
            { id: 4, variant_type: 'size', value: '512GB' }
          ],
          weight: 0.233,
          dimensions: { l: 16.23, w: 7.9, h: 0.86 },
          seller: 'DIU Gadget Store',
          seller_rating: 4.8
        };
        setProduct(dummyProd);
        setSelectedImage(dummyProd.images[0].image);
        setLoading(false);

        // Fallback related products
        setRelatedProducts([
          { id: 2, name: 'Sony WH-1000XM5', price: 38500, discount_price: 36000, images: [{ image: '/images/headphones.png' }], rating: 4.8, reviews: 1873 },
          { id: 3, name: 'Premium Leather Laptop Bag', price: 4500, discount_price: 4000, images: [{ image: '/images/bag.png' }], rating: 4.6, reviews: 89 },
          { id: 4, name: 'Men Pro Running Shoes', price: 8500, discount_price: 7500, images: [{ image: '/images/sneakers.png' }], rating: 4.5, reviews: 120 }
        ]);

        // Save to recently viewed
        saveToRecentlyViewed(dummyProd);
      });

    // Fetch reviews
    API.get(`/reviews/?product=${id}`)
      .then(res => {
        setReviews(res.data.results || res.data);
      })
      .catch(() => {
        setReviews([
          { id: 1, user_name: 'Adnan Hossain', rating: 5, text: 'Very nice phone! Delivered within 2 days.', created_at: '25 Jun 2026', verified: true, helpful: 42, color: '#e53935' },
          { id: 2, user_name: 'Sadia Islam', rating: 4, text: 'Awesome camera quality, battery backup is good.', created_at: '20 Jun 2026', verified: true, helpful: 28, color: '#8e24aa' },
          { id: 3, user_name: 'Rahim Uddin', rating: 5, text: 'Quality is outstanding, packaging was perfect. Highly recommend.', created_at: '15 Jun 2026', verified: true, helpful: 35, color: '#1976d2' }
        ]);
      });
  }, [id]);

  // Load recently viewed on mount
  useEffect(() => {
    renderRecentlyViewedList();
  }, [id]);

  const saveToRecentlyViewed = (prod) => {
    try {
      let rv = JSON.parse(localStorage.getItem('diu_recently_viewed')) || [];
      rv = rv.filter(i => i.id !== prod.id);
      rv.unshift({
        id: prod.id,
        name: prod.name,
        image: prod.images?.[0]?.image || '/images/phone.png',
        price: prod.discount_price || prod.price,
        rating: prod.avg_rating || 4.7
      });
      rv = rv.slice(0, 10);
      localStorage.setItem('diu_recently_viewed', JSON.stringify(rv));
      setRecentlyViewed(rv.filter(i => i.id !== prod.id));
    } catch {}
  };

  const renderRecentlyViewedList = () => {
    try {
      const rv = JSON.parse(localStorage.getItem('diu_recently_viewed')) || [];
      setRecentlyViewed(rv.filter(i => i.id !== parseInt(id)));
    } catch {}
  };

  // Cart actions
  const addToCart = (prod = product, qty = quantity) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === prod.id);
      if (existing) {
        triggerToast(`✅ ${prod.name} quantity updated in cart!`);
        return prev.map(item => item.id === prod.id ? { ...item, qty: item.qty + qty } : item);
      }
      triggerToast(`✅ ${prod.name} added to cart!`);
      return [...prev, {
        id: prod.id,
        name: prod.name,
        price: prod.discount_price || prod.price,
        img: prod.images?.[0]?.image || '/images/phone.png',
        qty: qty
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

  // Search logic
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      triggerToast(`🔍 Searching for "${searchQuery}"...`);
    }
  };

  // Image Hover Zoom
  const handleMouseMove = (e) => {
    const wrap = e.currentTarget;
    const img = wrap.querySelector('.pd-main-img');
    if (!img) return;
    const rect = wrap.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = 'scale(1.8)';
  };

  const handleMouseLeave = (e) => {
    const wrap = e.currentTarget;
    const img = wrap.querySelector('.pd-main-img');
    if (!img) return;
    img.style.transform = 'scale(1)';
    img.style.transformOrigin = 'center center';
  };

  // Wishlist Toggle
  const toggleWishlist = () => {
    if (!wishlisted) {
      setWishlistCount(prev => prev + 1);
      setWishlisted(true);
      triggerToast('❤️ Added to Wishlist!');
    } else {
      setWishlistCount(prev => Math.max(0, prev - 1));
      setWishlisted(false);
      triggerToast('💔 Removed from Wishlist');
    }
  };

  // Share Link
  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({ title: product?.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      triggerToast('🔗 Link copied to clipboard!');
    }
  };

  // Submit Review Locally
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewStarSelected) { triggerToast('⚠️ Please select a star rating!'); return; }
    if (!reviewText.trim()) { triggerToast('⚠️ Please write your review!'); return; }
    if (!reviewName.trim()) { triggerToast('⚠️ Please enter your name!'); return; }

    const colors = ['#e53935', '#8e24aa', '#1976d2', '#00897b', '#f57c00'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const newReview = {
      id: Date.now(),
      user_name: reviewName,
      rating: reviewStarSelected,
      text: reviewText,
      created_at: now,
      verified: false,
      color: randomColor,
      helpful: 0
    };

    setReviews(prev => [newReview, ...prev]);
    setReviewText('');
    setReviewName('');
    setReviewStarSelected(0);
    triggerToast('🎉 Review submitted successfully!');
  };

  // Submit Q&A Locally
  const handleSubmitQnA = (e) => {
    e.preventDefault();
    if (!questionText.trim()) { triggerToast('⚠️ Please type your question!'); return; }
    const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const newQna = {
      q: questionText,
      a: '⏳ Awaiting seller response...',
      asker: 'You',
      date: now,
      seller: false,
      isPending: true
    };

    setQnaList(prev => [newQna, ...prev]);
    setQuestionText('');
    triggerToast('✅ Question submitted! Seller will respond soon.');
  };

  // Star Rating Helper
  const getStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating || 0);
    const half = (rating || 0) % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars.push(<i key={`f-${i}`} className="fas fa-star"></i>);
    if (half) stars.push(<i key="h" className="fas fa-star-half-alt"></i>);
    const empty = 5 - full - (half ? 1 : 0);
    for (let i = 0; i < empty; i++) stars.push(<i key={`e-${i}`} className="far fa-star" style={{ color: 'var(--gray-300)' }}></i>);
    return stars;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '4px solid #e2e8f0', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Savings computation
  const savingsAmount = product.price - (product.discount_price || product.price);
  const discountPercent = product.discount_percent || (product.discount_price ? Math.round(((product.price - product.discount_price) / product.price) * 100) : 0);

  return (
    <div className="product-details-body">
      
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
      <header className={`header ${scrolledHeader ? 'scrolled' : ''}`} id="main-header">
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
            <a href="#" className="action-btn" id="header-wishlist" onClick={(e) => { e.preventDefault(); toggleWishlist(); }}>
              <i className="fas fa-heart" style={{ color: wishlisted ? 'var(--accent)' : '' }}></i>
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
              <span className="action-label">{user ? user.username : 'Account'}</span>
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
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); triggerToast('Electronics Category selected'); }}>Electronics</a></li>
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); triggerToast('Fashion Category selected'); }}>Fashion</a></li>
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); triggerToast('Home & Living Category selected'); }}>Home & Living</a></li>
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); triggerToast('Beauty Category selected'); }}>Beauty</a></li>
            <li><Link to="/" className="nav-link flash-link"><i className="fas fa-bolt"></i> Flash Sale</Link></li>
          </ul>
          <div className="nav-promo">
            <i className="fas fa-tag"></i> Up to <strong>70% OFF</strong> today!
          </div>
        </div>

        {/* Categories Menu Drawer */}
        <div className={`category-menu ${catMenuOpen ? 'open' : ''}`} id="category-menu">
          <div className="container">
            <div className="cat-menu-grid">
              <a href="#" className="cat-menu-item" onClick={(e) => { e.preventDefault(); setCatMenuOpen(false); triggerToast('Electronics Selected'); }}><i className="fas fa-mobile-alt"></i><span>Electronics</span></a>
              <a href="#" className="cat-menu-item" onClick={(e) => { e.preventDefault(); setCatMenuOpen(false); triggerToast('Fashion Selected'); }}><i className="fas fa-tshirt"></i><span>Fashion</span></a>
              <a href="#" className="cat-menu-item" onClick={(e) => { e.preventDefault(); setCatMenuOpen(false); triggerToast('Home Selected'); }}><i className="fas fa-couch"></i><span>Home & Living</span></a>
              <a href="#" className="cat-menu-item" onClick={(e) => { e.preventDefault(); setCatMenuOpen(false); triggerToast('Beauty Selected'); }}><i className="fas fa-magic"></i><span>Beauty</span></a>
              <a href="#" className="cat-menu-item" onClick={(e) => { e.preventDefault(); setCatMenuOpen(false); triggerToast('Sports Selected'); }}><i className="fas fa-running"></i><span>Sports</span></a>
            </div>
          </div>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="breadcrumb-bar" id="breadcrumb-bar">
        <div className="container">
          <nav className="breadcrumb" id="breadcrumb-nav">
            <Link to="/"><i className="fas fa-home"></i> Home</Link>
            <span className="bc-sep"><i className="fas fa-chevron-right"></i></span>
            <Link to="/" id="bc-category">{product.category_name || 'Category'}</Link>
            <span className="bc-sep"><i className="fas fa-chevron-right"></i></span>
            <span id="bc-product" className="bc-current">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* MAIN DETAILS (Premium 3-Column Layout) */}
      <section className="pd-main-section" id="pd-info-block">
        <div className="container pd-layout">
          
          {/* COLUMN 1: GALLERY */}
          <div className="pd-gallery" id="pd-gallery">
            <div className="pd-thumbnails" id="pd-thumbnails">
              {product.images?.map((img, i) => (
                <div 
                  key={i} 
                  className={`pd-thumb ${selectedImage === img.image ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img.image)}
                >
                  <img src={img.image} alt={`${product.name} ${i + 1}`} />
                </div>
              ))}
            </div>
            
            <div 
              className="pd-main-img-wrap" 
              id="pd-main-img-wrap"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="pd-badges" id="pd-badges">
                {product.is_new_arrival && <span className="product-badge new-badge">NEW</span>}
                {discountPercent > 0 && <span className="product-badge">{discountPercent}% OFF</span>}
              </div>
              <img src={selectedImage} alt={product.name} className="pd-main-img" id="pd-main-img" />
              <div className="pd-img-zoom-hint"><i className="fas fa-search-plus"></i> Hover to zoom</div>
            </div>

            {/* Share, Wishlist & Compare actions */}
            <div className="pd-actions-row">
              <button className={`pd-action-icon-btn ${wishlisted ? 'active' : ''}`} id="pd-wishlist-btn" onClick={toggleWishlist}>
                <i className={`${wishlisted ? 'fas' : 'far'} fa-heart`} id="wishlist-icon" style={{ color: wishlisted ? 'var(--accent)' : '' }}></i> 
                {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
              <button className="pd-action-icon-btn" onClick={shareProduct}>
                <i className="fas fa-share-alt"></i> Share
              </button>
              <button className="pd-action-icon-btn" onClick={() => triggerToast('⚖️ Added to compare list!')}>
                <i className="fas fa-exchange-alt"></i> Compare
              </button>
            </div>
          </div>

          {/* COLUMN 2: PRODUCT INFO */}
          <div className="pd-info" id="pd-info">
            <div className="pd-brand" id="pd-brand">
              <i className="fas fa-tag"></i> {product.brand_name || 'Generic'}
            </div>
            <h1 className="pd-title" id="pd-title">{product.name}</h1>
            
            <div className="pd-rating-row">
              <div className="pd-stars" id="pd-stars">
                {getStars(product.avg_rating || 4.7)}
              </div>
              <span className="pd-rating-num" id="pd-rating-num">{(product.avg_rating || 4.7).toFixed(1)}</span>
              <span className="pd-review-count" id="pd-review-count" onClick={() => setActiveTab('reviews')}>
                ({reviews.length} reviews)
              </span>
              <span className="pd-divider">|</span>
              <span className="pd-sold" id="pd-sold">68 sold</span>
              <span className="pd-divider">|</span>
              <span className="pd-stock" id="pd-stock" style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--accent)' }}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div className="pd-price-block" id="pd-price-block">
              <div className="pd-flash-tag"><i className="fas fa-bolt"></i> Special Price</div>
              <div className="pd-prices">
                <span className="pd-price-now" id="pd-price-now">৳{(product.discount_price || product.price).toLocaleString()}</span>
                {product.discount_price && <span className="pd-price-old" id="pd-price-old">৳{product.price.toLocaleString()}</span>}
                {discountPercent > 0 && <span className="pd-discount-tag" id="pd-discount-tag">-{discountPercent}%</span>}
              </div>
              {savingsAmount > 0 && (
                <div className="pd-savings" id="pd-savings">
                  You save ৳{savingsAmount.toLocaleString()} on this product!
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="pd-highlights" id="pd-highlights">
              <div className="pd-highlights-title">Key Highlights</div>
              <ul className="pd-highlights-list" id="pd-highlights-list">
                <li>Premium high-quality manufacturing</li>
                <li>Best in category performance and efficiency</li>
                <li>Full customer satisfaction guarantee</li>
                <li>Top-selling authenticated product</li>
              </ul>
            </div>

            {/* Color variants */}
            {product.variants?.filter(v => v.variant_type === 'color').length > 0 && (
              <div className="pd-option-group" id="pd-color-group">
                <div className="pd-option-label">Color: <strong id="pd-selected-color">{selectedColor || 'Not Selected'}</strong></div>
                <div className="pd-color-options" id="pd-color-options">
                  {product.variants.filter(v => v.variant_type === 'color').map(c => (
                    <button 
                      key={c.id} 
                      className={`pd-size-btn ${selectedColor === c.value ? 'active' : ''}`}
                      onClick={() => setSelectedColor(c.value)}
                    >
                      {c.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size variants */}
            {product.variants?.filter(v => v.variant_type === 'size' || v.variant_type === 'storage' || v.variant_type === 'ram').length > 0 && (
              <div className="pd-option-group" id="pd-size-group">
                <div className="pd-option-label" id="pd-size-label">Size / Storage:</div>
                <div className="pd-size-options" id="pd-size-options">
                  {product.variants.filter(v => v.variant_type === 'size' || v.variant_type === 'storage' || v.variant_type === 'ram').map(s => (
                    <button 
                      key={s.id} 
                      className={`pd-size-btn ${selectedSize === s.value ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s.value)}
                    >
                      {s.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="pd-option-group">
              <div className="pd-option-label">Quantity:</div>
              <div className="pd-qty-wrap">
                <button className="pd-qty-btn" id="pd-qty-minus" onClick={() => setQuantity(prev => Math.max(1, prev - 1))}><i className="fas fa-minus"></i></button>
                <span className="pd-qty-display" id="pd-qty-display">{quantity}</span>
                <button className="pd-qty-btn" id="pd-qty-plus" onClick={() => setQuantity(prev => prev + 1)}><i className="fas fa-plus"></i></button>
                <span className="pd-qty-max" id="pd-qty-max">(Max: 10 pcs)</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pd-cta-btns">
              <button className="pd-add-cart-btn" id="pd-add-cart-btn" onClick={() => addToCart(product, quantity)}>
                <i className="fas fa-shopping-cart"></i> Add to Cart
              </button>
              <button className="pd-buy-now-btn" id="pd-buy-now-btn" onClick={() => { addToCart(product, quantity); navigate('/checkout'); }}>
                <i className="fas fa-bolt"></i> Buy Now
              </button>
            </div>

            {/* Delivery Services */}
            <div className="pd-services" id="pd-services">
              <div className="pd-service-item">
                <i className="fas fa-truck"></i>
                <div>
                  <strong>Free Delivery</strong>
                  <span id="pd-delivery-time">2-3 Days</span>
                </div>
              </div>
              <div className="pd-service-item">
                <i className="fas fa-undo"></i>
                <div>
                  <strong>Easy Return</strong>
                  <span id="pd-return-policy">7 Days</span>
                </div>
              </div>
              <div className="pd-service-item">
                <i className="fas fa-shield-alt"></i>
                <div>
                  <strong>Warranty</strong>
                  <span id="pd-warranty">1 Year</span>
                </div>
              </div>
              <div className="pd-service-item">
                <i className="fas fa-certificate"></i>
                <div>
                  <strong>100% Genuine</strong>
                  <span>Authenticated</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: SIDEBAR */}
          <div className="pd-sidebar">
            {/* Seller Card */}
            <div className="pd-sidebar-seller-card pd-seller-card" id="pd-seller-card">
              <div className="pd-seller-header">
                <div className="pd-seller-avatar" id="pd-seller-avatar">
                  {(product.seller || 'DIU').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="pd-seller-name" id="pd-seller-name">{product.seller || 'DIU Gadget Store'}</div>
                  <div className="pd-seller-rating" id="pd-seller-rating">
                    {getStars(product.seller_rating || 4.8)} <span style={{ color: 'var(--gray-600)', marginLeft: 4 }}>{product.seller_rating || '4.8'}</span>
                  </div>
                </div>
              </div>
              <div className="pd-seller-stats">
                <div className="pd-seller-stat"><strong>98.2%</strong><span>Positive Feedback</span></div>
                <div className="pd-seller-stat"><strong>3.2K+</strong><span>Products</span></div>
                <div className="pd-seller-stat"><strong>3Y</strong><span>Since</span></div>
              </div>
              <button className="pd-seller-btn" onClick={() => triggerToast('Visiting seller store...')}>
                Visit Store <i className="fas fa-arrow-right"></i>
              </button>
              <button className="pd-seller-btn pd-seller-btn-outline" onClick={() => triggerToast('Chat started with seller!')}>
                <i className="fas fa-comments"></i> Chat with Seller
              </button>
            </div>

            {/* Price Summary Card */}
            <div className="pd-price-summary-card">
              <div className="pd-summary-title">Order Summary</div>
              <div className="pd-summary-row">
                <span>Price ({quantity} item{quantity > 1 ? 's' : ''})</span>
                <span id="summary-price">৳{(product.price * quantity).toLocaleString()}</span>
              </div>
              {savingsAmount > 0 && (
                <div className="pd-summary-row discount">
                  <span>Discount</span>
                  <span id="summary-discount" className="green">-৳{(savingsAmount * quantity).toLocaleString()}</span>
                </div>
              )}
              <div className="pd-summary-row"><span>Delivery</span><span className="green">FREE</span></div>
              <div className="pd-summary-divider"></div>
              <div className="pd-summary-row total">
                <span>Total Amount</span>
                <span id="summary-total">৳{((product.discount_price || product.price) * quantity).toLocaleString()}</span>
              </div>
              <div className="pd-summary-note">Inclusive of all taxes</div>
              <button className="pd-add-cart-btn" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={() => addToCart(product, quantity)}>
                <i className="fas fa-shopping-cart"></i> Add to Cart
              </button>
              <button className="pd-buy-now-btn" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} onClick={() => { addToCart(product, quantity); navigate('/checkout'); }}>
                <i className="fas fa-bolt"></i> Buy Now
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* TABS (Description, Specs, Reviews, Q&A) */}
      <section className="pd-tabs-section">
        <div className="container">
          <div className="pd-tabs" id="pd-tabs">
            <button className={`pd-tab ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
            <button className={`pd-tab ${activeTab === 'specifications' ? 'active' : ''}`} onClick={() => setActiveTab('specifications')}>Specifications</button>
            <button className={`pd-tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews ({reviews.length})</button>
            <button className={`pd-tab ${activeTab === 'qna' ? 'active' : ''}`} onClick={() => setActiveTab('qna')}>Q&amp;A</button>
          </div>

          <div className="pd-tab-content">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="pd-tab-panel active" id="panel-desc">
                <div className="pd-description" id="pd-description">
                  {product.description || 'No description available.'}
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="pd-tab-panel active" id="panel-specs">
                <table className="pd-specs-table" id="pd-specs-table">
                  <tbody>
                    <tr><td>SKU</td><td>{product.sku || 'N/A'}</td></tr>
                    <tr><td>Category</td><td>{product.category_name || 'N/A'}</td></tr>
                    {product.weight && <tr><td>Weight</td><td>{product.weight} kg</td></tr>}
                    {product.dimensions && (
                      <tr>
                        <td>Dimensions (L x W x H)</td>
                        <td>{product.dimensions.l || '-'} x {product.dimensions.w || '-'} x {product.dimensions.h || '-'} cm</td>
                      </tr>
                    )}
                    <tr><td>Status</td><td>Active</td></tr>
                    <tr><td>Warranty</td><td>1 Year Brand Warranty</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="pd-tab-panel active" id="panel-reviews">
                <div className="pd-reviews-layout">
                  {/* Rating Summary */}
                  <div className="pd-rating-summary" id="pd-rating-summary">
                    <div className="pd-rating-big">{(product.avg_rating || 4.7).toFixed(1)}</div>
                    <div className="pd-rating-stars">{getStars(product.avg_rating || 4.7)}</div>
                    <div className="pd-rating-label">Based on {reviews.length} reviews</div>
                    <div className="pd-rating-bar-row">
                      <span>5★</span>
                      <div className="pd-bar-wrap"><div className="pd-bar-fill" style={{ width: '75%' }}></div></div>
                      <span>75%</span>
                    </div>
                    <div className="pd-rating-bar-row">
                      <span>4★</span>
                      <div className="pd-bar-wrap"><div className="pd-bar-fill" style={{ width: '15%' }}></div></div>
                      <span>15%</span>
                    </div>
                    <div className="pd-rating-bar-row">
                      <span>3★</span>
                      <div className="pd-bar-wrap"><div className="pd-bar-fill" style={{ width: '5%' }}></div></div>
                      <span>5%</span>
                    </div>
                    <div className="pd-rating-bar-row">
                      <span>2★</span>
                      <div className="pd-bar-wrap"><div className="pd-bar-fill" style={{ width: '3%' }}></div></div>
                      <span>3%</span>
                    </div>
                    <div className="pd-rating-bar-row">
                      <span>1★</span>
                      <div className="pd-bar-wrap"><div className="pd-bar-fill" style={{ width: '2%' }}></div></div>
                      <span>2%</span>
                    </div>
                  </div>

                  {/* Review List */}
                  <div className="pd-review-list" id="pd-review-list">
                    {reviews.length === 0 ? (
                      <p style={{ color: 'var(--gray-500)', padding: '20px 0' }}>No reviews yet. Be the first to review this product!</p>
                    ) : (
                      reviews.map((r, i) => (
                        <div key={r.id || i} className="pd-review-item" style={{ background: r.color ? '#f0fff4' : '' }}>
                          <div className="pd-review-header">
                            <div className="pd-reviewer-avatar" style={{ background: r.color || 'var(--primary)' }}>
                              {(r.user_name || 'A')[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="pd-reviewer-name">{r.user_name}</div>
                              <div className="pd-review-date">{r.created_at}</div>
                            </div>
                            <div className="pd-review-stars" style={{ marginLeft: 'auto' }}>
                              {getStars(r.rating)}
                            </div>
                          </div>
                          <div className="pd-review-text">{r.text}</div>
                          {r.verified && <div className="pd-review-verified"><i className="fas fa-check-circle"></i> Verified Purchase</div>}
                          <div className="pd-review-helpful">
                            Was this helpful? <a href="#" onClick={(e) => { e.preventDefault(); triggerToast('👍 Feedback recorded!'); }} style={{ color: 'var(--primary)' }}>Yes ({r.helpful || 0})</a> · <a href="#" onClick={(e) => { e.preventDefault(); triggerToast('👍 Feedback recorded!'); }} style={{ color: 'var(--gray-400)' }}>No</a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Write Review Form */}
                <div className="pd-write-review">
                  <h3>Write a Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="pd-star-input" id="pd-star-input">
                      <span>Your Rating:</span>
                      <div className="star-select">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <i 
                            key={val} 
                            className={`${reviewStarSelected >= val ? 'fas' : 'far'} fa-star`}
                            onClick={() => setReviewStarSelected(val)}
                            style={{ cursor: 'pointer', color: reviewStarSelected >= val ? 'var(--warning)' : 'var(--gray-300)', marginRight: 4 }}
                          ></i>
                        ))}
                      </div>
                    </div>
                    <textarea 
                      id="review-text" 
                      placeholder="Share your experience with this product..." 
                      rows="4"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    ></textarea>
                    <input 
                      type="text" 
                      id="review-name" 
                      placeholder="Your Name" 
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                    />
                    <button type="submit" className="pd-submit-review-btn">
                      Submit Review <i className="fas fa-paper-plane"></i>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Q&A Tab */}
            {activeTab === 'qna' && (
              <div className="pd-tab-panel active" id="panel-qna">
                <div className="pd-qna-list" id="pd-qna-list">
                  {qnaList.map((qa, index) => (
                    <div key={index} className="pd-qna-item" style={{ background: qa.isPending ? '#f0f4ff' : '' }}>
                      <div className="pd-qna-q">
                        <div className="pd-qna-badge q-badge">Q</div>
                        <div>
                          <div className="pd-qna-text">{qa.q}</div>
                          <div className="pd-qna-meta">Asked by {qa.asker} · {qa.date}</div>
                        </div>
                      </div>
                      <div className="pd-qna-a">
                        <div className="pd-qna-badge a-badge">A</div>
                        <div>
                          <div className="pd-qna-text" style={{ color: qa.isPending ? 'var(--gray-400)' : '' }}>{qa.a}</div>
                          {!qa.isPending && <div className="pd-qna-meta" style={{ color: 'var(--primary)' }}>Answered by {qa.seller ? 'Seller' : 'Community'}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pd-ask-question">
                  <h3>Ask a Question</h3>
                  <form onSubmit={handleSubmitQnA}>
                    <input 
                      type="text" 
                      id="qna-question" 
                      placeholder="Type your question about this product..." 
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                    />
                    <button type="submit" className="pd-submit-review-btn">
                      Ask Question <i className="fas fa-question-circle"></i>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="section" id="related-products-section">
          <div className="container">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-tag">🔁 You Might Also Like</span>
                <h2 className="section-title">Related Products</h2>
              </div>
              <Link to="/" className="view-all-link">View All <i className="fas fa-arrow-right"></i></Link>
            </div>
            <div className="products-grid" id="related-products-grid">
              {relatedProducts.map(prod => (
                <div 
                  key={prod.id} 
                  className="product-card" 
                  onClick={() => { navigate(`/product/${prod.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="product-img-wrap">
                    <img src={prod.images?.[0]?.image || '/images/phone.png'} alt={prod.name} />
                    {prod.discount_percent > 0 && <span className="product-badge">-{prod.discount_percent}%</span>}
                    <button className="wishlist-btn" onClick={(e) => { e.stopPropagation(); toggleWishlist(); }}>
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>
                  <div className="product-info">
                    <div className="product-name">{prod.name}</div>
                    <div className="stars">
                      {getStars(prod.avg_rating || 4.7)}
                      <span>({prod.review_count || 120})</span>
                    </div>
                    <div className="product-price">
                      <span className="price-now">৳{(prod.discount_price || prod.price).toLocaleString()}</span>
                      {prod.discount_price && <span className="price-old">৳{prod.price.toLocaleString()}</span>}
                    </div>
                    <button className="add-cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(prod, 1); }}>
                      <i className="fas fa-cart-plus"></i> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RECENTLY VIEWED */}
      {recentlyViewed.length > 0 && (
        <section className="section recently-viewed-section" id="recently-viewed-section">
          <div className="container">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-tag">👁️ Your History</span>
                <h2 className="section-title">Recently Viewed</h2>
              </div>
            </div>
            <div className="products-scroll" id="recently-viewed-grid">
              {recentlyViewed.map(item => (
                <div 
                  key={item.id} 
                  className="product-card" 
                  onClick={() => { navigate(`/product/${item.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ cursor: 'pointer', minWidth: 200 }}
                >
                  <div className="product-img-wrap">
                    <img src={item.image} alt={item.name} />
                    <button className="wishlist-btn" onClick={(e) => { e.stopPropagation(); toggleWishlist(); }}>
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>
                  <div className="product-info">
                    <div className="product-name">{item.name}</div>
                    <div className="stars">
                      {getStars(item.rating)}
                    </div>
                    <div className="product-price">
                      <span className="price-now">৳{item.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-col footer-brand-col">
            <div className="footer-logo"><i className="fas fa-rocket"></i><span>DIU Startup</span></div>
            <p>Bangladesh's premier e-commerce destination — empowering students and entrepreneurs to shop smart.</p>
            <div className="social-links">
              <a href="#" className="social-btn"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-btn"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-btn"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-btn"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/shop">Become a Seller</Link></li>
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

      {/* STICKY BOTTOM BAR (Mobile) */}
      <div className={`pd-sticky-bar ${stickyVisible ? 'visible' : ''}`} id="pd-sticky-bar">
        <div className="pd-sticky-price" id="pd-sticky-price">
          ৳{((product.discount_price || product.price) * quantity).toLocaleString()}
        </div>
        <button className="pd-add-cart-btn" onClick={() => addToCart(product, quantity)}><i className="fas fa-cart-plus"></i> Add to Cart</button>
        <button className="pd-buy-now-btn" onClick={() => { addToCart(product, quantity); navigate('/checkout'); }}><i className="fas fa-bolt"></i> Buy Now</button>
      </div>

      {/* SCROLL TO TOP */}
      <button 
        className={`scroll-top ${scrollTopVisible ? 'visible' : ''}`} 
        id="scroll-top-btn" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <i className="fas fa-chevron-up"></i>
      </button>

      {/* TOAST NOTIFICATION */}
      <div className={`toast ${showToastFlag ? 'show' : ''}`} id="toast-notification">
        {toastMsg}
      </div>

    </div>
  );
}

