import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import '../../styles/product.css';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Fetch product data
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
            .then(rRes => setRelatedProducts((rRes.data.results || rRes.data).filter(p => p.id !== prod.id).slice(0, 4)));
        }
      })
      .catch(err => {
        // Fallback dummy product if API fails
        const dummyProd = {
          id: 1,
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
          ]
        };
        setProduct(dummyProd);
        setSelectedImage(dummyProd.images[0].image);
        setLoading(false);
      });

    // Fetch reviews
    API.get(`/reviews/?product=${id}`)
      .then(res => setReviews(res.data.results || res.data))
      .catch(() => {
        setReviews([
          { id: 1, user_name: 'Adnan Hossain', rating: 5, text: 'Very nice phone! Delivered within 2 days.', created_at: '2026-06-25' },
          { id: 2, user_name: 'Sadia Islam', rating: 4, text: 'Awesome camera quality, battery backup is good.', created_at: '2026-06-20' }
        ]);
      });
  }, [id]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleAddToCart = () => {
    const saved = localStorage.getItem('diu_cart');
    const cart = saved ? JSON.parse(saved) : [];
    
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    
    localStorage.setItem('diu_cart', JSON.stringify(cart));
    showToast(`${quantity}x ${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '4px solid #e2e8f0', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="product-details-body">
      
      {/* TOAST CONTAINER */}
      <div className="toast-container" style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast-msg ${t.type}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', background: '#333', color: '#fff', borderRadius: 8, marginBottom: 8 }}>
            <i className={`fas ${t.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`} style={{ color: t.type === 'success' ? '#10b981' : '#f59e0b' }} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* TOP BAR & HEADER (SIMPLIFIED FOR PRODUCT PAGE, DIRECT HOMEPAGE LINK) */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-left">
            <span><i className="fas fa-phone-alt"></i> +880 1900-000000</span>
          </div>
          <div className="top-right">
            <Link to="/">Back to Store</Link>
            <Link to="/shop">Seller Dashboard</Link>
          </div>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="pd-breadcrumb-section">
        <div className="container">
          <nav className="pd-breadcrumb">
            <Link to="/">Home</Link>
            <span className="bc-sep"><i className="fas fa-chevron-right"></i></span>
            <span>{product.category_name || 'Category'}</span>
            <span className="bc-sep"><i className="fas fa-chevron-right"></i></span>
            <span className="bc-current">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* MAIN DETAILS */}
      <section className="pd-main-section">
        <div className="container pd-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
          
          {/* GALLERY */}
          <div className="pd-gallery">
            <div style={{ display: 'flex', gap: 15 }}>
              <div className="pd-thumbnails" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {product.images?.map((img, index) => (
                  <img 
                    key={index} 
                    src={img.image} 
                    alt="" 
                    className={`thumb ${selectedImage === img.image ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img.image)}
                    style={{ width: 60, height: 60, objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer' }}
                  />
                ))}
              </div>
              <div className="pd-main-img-wrap" style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: 8, padding: 15, display: 'flex', justifyContent: 'center', background: '#fff' }}>
                <img src={selectedImage} alt={product.name} className="pd-main-img" style={{ maxHeight: 400, objectFit: 'contain' }} />
              </div>
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="pd-info">
            <div className="pd-brand" style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>{product.brand_name || 'Generic'}</div>
            <h1 className="pd-title" style={{ fontSize: '1.8rem', color: '#1e293b', margin: '8px 0' }}>{product.name}</h1>
            
            <div className="pd-rating-row" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' }}>
              <div className="pd-stars" style={{ color: '#f59e0b' }}>
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
              </div>
              <span className="pd-review-count">({reviews.length} customer reviews)</span>
              <span className="pd-stock" style={{ color: product.stock > 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            <div className="pd-price-block" style={{ padding: 15, background: '#f8fafc', borderRadius: 8, margin: '15px 0' }}>
              <div className="pd-prices" style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span className="pd-price-now" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>৳{product.discount_price || product.price}</span>
                {product.discount_price && (
                  <>
                    <span className="pd-price-old" style={{ textDecoration: 'line-through', color: '#94a3b8' }}>৳{product.price}</span>
                    <span className="pd-discount-tag" style={{ background: '#fee2e2', color: '#ef4444', padding: '3px 8px', borderRadius: 4, fontSize: '0.8rem', fontWeight: 700 }}>
                      -{Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* VARIANTS PICKER */}
            <div className="pd-options" style={{ margin: '20px 0' }}>
              {product.variants?.filter(v => v.variant_type === 'color').length > 0 && (
                <div style={{ marginBottom: 15 }}>
                  <h4 style={{ marginBottom: 8, fontSize: '0.9rem', color: '#64748b' }}>Select Color:</h4>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {product.variants.filter(v => v.variant_type === 'color').map(c => (
                      <button 
                        key={c.id} 
                        onClick={() => setSelectedColor(c.value)}
                        style={{ border: selectedColor === c.value ? '2px solid var(--primary)' : '1px solid #cbd5e1', padding: '6px 12px', borderRadius: 6, background: '#fff' }}
                      >
                        {c.value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.variants?.filter(v => v.variant_type === 'size').length > 0 && (
                <div style={{ marginBottom: 15 }}>
                  <h4 style={{ marginBottom: 8, fontSize: '0.9rem', color: '#64748b' }}>Select Storage/Size:</h4>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {product.variants.filter(v => v.variant_type === 'size').map(s => (
                      <button 
                        key={s.id} 
                        onClick={() => setSelectedSize(s.value)}
                        style={{ border: selectedSize === s.value ? '2px solid var(--primary)' : '1px solid #cbd5e1', padding: '6px 12px', borderRadius: 6, background: '#fff' }}
                      >
                        {s.value}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* QTY & BUTTONS */}
            <div className="pd-purchase" style={{ display: 'flex', alignItems: 'center', gap: 15, borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #cbd5e1', borderRadius: 6, padding: '5px 10px' }}>
                <button onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))} style={{ background: 'none', fontSize: '1.1rem' }}>-</button>
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{quantity}</span>
                <button onClick={() => setQuantity(prev => prev + 1)} style={{ background: 'none', fontSize: '1.1rem' }}>+</button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary" style={{ flex: 1, padding: '14px 0', borderRadius: 8, fontSize: '1rem', fontWeight: 700 }}>
                Add to Cart
              </button>
              <button 
                onClick={() => { handleAddToCart(); navigate('/checkout'); }} 
                className="btn-outline" 
                style={{ padding: '14px 20px', borderRadius: 8, fontSize: '1rem', fontWeight: 700 }}
              >
                Buy Now
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* TABS (Description, Reviews) */}
      <section className="pd-tabs-section" style={{ margin: '40px 0' }}>
        <div className="container">
          <div className="pd-tabs" style={{ display: 'flex', borderBottom: '2px solid #e2e8f0' }}>
            <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')} style={{ padding: '12px 24px', border: 'none', background: 'none', fontSize: '1rem', fontWeight: 600, color: activeTab === 'description' ? 'var(--primary)' : '#64748b' }}>Description</button>
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')} style={{ padding: '12px 24px', border: 'none', background: 'none', fontSize: '1rem', fontWeight: 600, color: activeTab === 'reviews' ? 'var(--primary)' : '#64748b' }}>Reviews ({reviews.length})</button>
          </div>

          <div style={{ padding: '20px 0' }}>
            {activeTab === 'description' && (
              <div>
                <p style={{ color: '#475569', lineHeight: '1.8' }}>{product.description}</p>
                <table style={{ marginTop: 20, width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: 10, background: '#f8fafc', fontWeight: 600, border: '1px solid #cbd5e1' }}>SKU</td>
                      <td style={{ padding: 10, border: '1px solid #cbd5e1' }}>{product.sku}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: 10, background: '#f8fafc', fontWeight: 600, border: '1px solid #cbd5e1' }}>Category</td>
                      <td style={{ padding: 10, border: '1px solid #cbd5e1' }}>{product.category_name}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {reviews.map(r => (
                  <div key={r.id} style={{ padding: '15px 0', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <strong>{r.user_name}</strong>
                      <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{r.created_at}</span>
                    </div>
                    <div style={{ color: '#f59e0b', marginBottom: 8 }}>
                      {Array.from({ length: r.rating }).map((_, i) => <i key={i} className="fas fa-star"></i>)}
                    </div>
                    <p style={{ color: '#475569' }}>{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
