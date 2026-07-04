import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/style.css';

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('diu_startup_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const updateCartQty = (productId, delta) => {
    const updated = cart.map(item => {
      if (item.id === productId) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }).filter(item => item.qty > 0);
    setCart(updated);
    localStorage.setItem('diu_startup_cart', JSON.stringify(updated));
  };

  const removeFromCart = (productId) => {
    const updated = cart.filter(item => item.id !== productId);
    setCart(updated);
    localStorage.setItem('diu_startup_cart', JSON.stringify(updated));
  };

  const cartTotal = cart.reduce((sum, item) => {
    return sum + (item.price * item.qty);
  }, 0);

  return (
    <div style={{ padding: '40px 0', fontFamily: 'Inter, sans-serif' }}>
      <div className="container">
        <h2 style={{ marginBottom: 25, fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>Your Shopping Cart</h2>
        
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 8, border: '1px solid #cbd5e1' }}>
            <i className="fas fa-shopping-cart" style={{ fontSize: '3rem', color: '#94a3b8', marginBottom: 15 }}></i>
            <h3>Your cart is empty</h3>
            <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: 15, padding: '10px 20px', borderRadius: 8 }}>Go Shopping</Link>
          </div>
        ) : (
          <div className="resp-grid-2-1">
            {/* Cart Items */}
            <div style={{ background: '#fff', borderRadius: 8, padding: 20, border: '1px solid #cbd5e1' }}>
              {cart.map(item => {
                return (
                  <div key={item.id} className="resp-cart-item">
                    <img src={item.img || '/images/phone.png'} alt={item.name} style={{ width: 80, height: 80, objectFit: 'contain' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: '#1e293b', fontWeight: 600 }}>{item.name}</h4>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>৳{item.price}</span>
                    </div>
                    <div className="qty-container" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button onClick={() => updateCartQty(item.id, -1)} style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateCartQty(item.id, 1)} style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>+</button>
                    </div>
                    <strong style={{ minWidth: 80, textAlign: 'right' }}>৳{(item.price * item.qty).toLocaleString()}</strong>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', background: 'none', marginLeft: 15 }}><i className="fas fa-trash"></i></button>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div style={{ background: '#fff', borderRadius: 8, padding: 20, border: '1px solid #cbd5e1', height: 'fit-content' }}>
              <h3 style={{ marginBottom: 15, borderBottom: '1px solid #e2e8f0', paddingBottom: 10 }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span>Subtotal:</span>
                <span>৳{cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span>Delivery:</span>
                <span>৳60</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15, borderTop: '1px solid #e2e8f0', paddingTop: 15, fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Total:</span>
                <span style={{ color: 'var(--primary)' }}>৳{(cartTotal + 60).toLocaleString()}</span>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-primary" style={{ width: '100%', marginTop: 20, padding: '12px 0', borderRadius: 8, fontSize: '1rem' }}>
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
