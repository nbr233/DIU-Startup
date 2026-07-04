import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import '../../styles/style.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    name: '', phone: '', street: '', city: '', district: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('diu_startup_cart');
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    try {
      const { data } = await API.post('/coupons/validate/', {
        code: couponCode,
        subtotal: cartTotal,
      });
      if (data.discount_type === 'percent') {
        setDiscount((cartTotal * data.value) / 100);
      } else {
        setDiscount(data.value);
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid coupon');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.street) {
      setError('Please fill in all required shipping address fields.');
      return;
    }
    
    setLoading(true);
    const orderItems = cart.map(item => ({
      product: item.id,
      quantity: item.qty
    }));

    try {
      await API.post('/orders/', {
        items: orderItems,
        delivery_address: shippingAddress,
        payment_method: paymentMethod,
        coupon_code: couponCode,
        delivery_charge: 60
      });
      
      // Clear cart
      localStorage.removeItem('diu_startup_cart');
      alert('Order placed successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    return sum + (item.price * item.qty);
  }, 0);

  return (
    <div style={{ padding: '40px 0', fontFamily: 'Inter, sans-serif' }}>
      <div className="container">
        <h2 style={{ marginBottom: 25, fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>Checkout</h2>
        
        {error && (
          <div style={{ padding: 12, background: '#fee2e2', borderLeft: '4px solid #ef4444', color: '#991b1b', borderRadius: 6, marginBottom: 20 }}>
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="resp-grid-2-1">
          {/* Left Panel: Address + Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Address */}
            <div style={{ background: '#fff', borderRadius: 8, padding: 20, border: '1px solid #cbd5e1' }}>
              <h3 style={{ marginBottom: 15 }}>Shipping Address</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="text" name="name" placeholder="Full Name *" required value={shippingAddress.name} onChange={handleInputChange} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                <input type="text" name="phone" placeholder="Phone Number *" required value={shippingAddress.phone} onChange={handleInputChange} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                <textarea name="street" placeholder="Street Address / Room / Department *" required value={shippingAddress.street} onChange={handleInputChange} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6, minHeight: 60 }} />
                <div className="resp-grid-1-1">
                  <input type="text" name="city" placeholder="City" value={shippingAddress.city} onChange={handleInputChange} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                  <input type="text" name="district" placeholder="District" value={shippingAddress.district} onChange={handleInputChange} style={{ width: '100%', padding: 10, border: '1px solid #cbd5e1', borderRadius: 6 }} />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div style={{ background: '#fff', borderRadius: 8, padding: 20, border: '1px solid #cbd5e1' }}>
              <h3 style={{ marginBottom: 15 }}>Payment Method</h3>
              <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <span>Cash on Delivery</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" name="payment" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} />
                  <span>bKash</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" name="payment" checked={paymentMethod === 'nagad'} onChange={() => setPaymentMethod('nagad')} />
                  <span>Nagad</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Panel: Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: '#fff', borderRadius: 8, padding: 20, border: '1px solid #cbd5e1', height: 'fit-content' }}>
              <h3 style={{ marginBottom: 15, borderBottom: '1px solid #e2e8f0', paddingBottom: 10 }}>Your Order</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 200, overflowY: 'auto', marginBottom: 15 }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#475569' }}>{item.name.slice(0, 30)}... x{item.qty}</span>
                    <strong>৳{(item.price * item.qty).toLocaleString()}</strong>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 15 }}>
                <input type="text" placeholder="Promo Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} style={{ flex: 1, padding: 8, border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} />
                <button type="button" onClick={handleApplyCoupon} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: 6 }}>Apply</button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem' }}>
                <span>Subtotal:</span>
                <span>৳{cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem' }}>
                <span>Delivery Charge:</span>
                <span>৳60</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem', color: '#ef4444' }}>
                  <span>Discount:</span>
                  <span>-৳{discount}</span>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15, borderTop: '1px solid #e2e8f0', paddingTop: 15, fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Total:</span>
                <span style={{ color: 'var(--primary)' }}>৳{(cartTotal + 60 - discount).toLocaleString()}</span>
              </div>
              
              <button type="submit" disabled={loading || cart.length === 0} className="btn-primary" style={{ width: '100%', marginTop: 20, padding: '12px 0', borderRadius: 8, fontSize: '1rem', fontWeight: 700 }}>
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
