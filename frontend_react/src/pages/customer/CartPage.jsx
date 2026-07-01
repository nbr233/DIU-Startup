import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/style.css';

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('diu_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const updateCartQty = (productId, delta) => {
    const updated = cart.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0);
    setCart(updated);
    localStorage.setItem('diu_cart', JSON.stringify(updated));
  };

  const removeFromCart = (productId) => {
    const updated = cart.filter(item => item.product.id !== productId);
    setCart(updated);
    localStorage.setItem('diu_cart', JSON.stringify(updated));
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.product.discount_price || item.product.price;
    return sum + (price * item.quantity);
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
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 30 }}>
            {/* Cart Items */}
            <div style={{ background: '#fff', borderRadius: 8, padding: 20, border: '1px solid #cbd5e1' }}>
              {cart.map(item => {
                const price = item.product.discount_price || item.product.price;
                return (
                  <div key={item.product.id} style={{ display: 'flex', gap: 15, padding: '15px 0', borderBottom: '1px solid #e2e8f0', alignItems: 'center' }}>
                    <img src={item.product.images?.[0]?.image || '/images/phone.png'} alt={item.product.name} style={{ width: 80, height: 80, objectFit: 'contain' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: '#1e293b', fontWeight: 600 }}>{item.product.name}</h4>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>৳{price}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button onClick={() => updateCartQty(item.product.id, -1)} style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateCartQty(item.product.id, 1)} style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>+</button>
                    </div>
                    <strong style={{ minWidth: 80, textAlign: 'right' }}>৳{(price * item.quantity).toLocaleString()}</strong>
                    <button onClick={() => removeFromCart(item.product.id)} style={{ color: '#ef4444', background: 'none', marginLeft: 15 }}><i className="fas fa-trash"></i></button>
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
