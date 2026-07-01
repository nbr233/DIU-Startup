import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/style.css';

export default function AccountPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [addrRes, orderRes] = await Promise.all([
          API.get('/auth/addresses/'),
          API.get('/orders/')
        ]);
        setAddresses(addrRes.data);
        setOrders(orderRes.data.results || orderRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '4px solid #e2e8f0', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0', fontFamily: 'Inter, sans-serif' }}>
      <div className="container">
        <h2 style={{ marginBottom: 25, fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>My Account</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 30 }}>
          {/* Profile Details */}
          <div style={{ background: '#fff', borderRadius: 8, padding: 20, border: '1px solid #cbd5e1', height: 'fit-content' }}>
            <h3 style={{ marginBottom: 15, borderBottom: '1px solid #e2e8f0', paddingBottom: 10 }}>Profile Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Name:</span>
                <p style={{ fontWeight: 600 }}>{user?.first_name} {user?.last_name}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Email:</span>
                <p style={{ fontWeight: 600 }}>{user?.email}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Phone:</span>
                <p style={{ fontWeight: 600 }}>{user?.phone || '—'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Role:</span>
                <p style={{ fontWeight: 600, textTransform: 'capitalize' }}>{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Shipping Addresses & Order History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            {/* Addresses */}
            <div style={{ background: '#fff', borderRadius: 8, padding: 20, border: '1px solid #cbd5e1' }}>
              <h3 style={{ marginBottom: 15 }}>My Addresses</h3>
              {addresses.length === 0 ? (
                <p style={{ color: '#64748b' }}>No addresses saved yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  {addresses.map(addr => (
                    <div key={addr.id} style={{ border: '1px solid #e2e8f0', padding: 12, borderRadius: 6, position: 'relative' }}>
                      <span className="tag" style={{ position: 'absolute', top: 12, right: 12 }}>{addr.label}</span>
                      <strong style={{ display: 'block', marginBottom: 5 }}>{addr.label}</strong>
                      <p style={{ fontSize: '0.85rem', color: '#475569' }}>{addr.street}, {addr.city}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Orders */}
            <div style={{ background: '#fff', borderRadius: 8, padding: 20, border: '1px solid #cbd5e1' }}>
              <h3 style={{ marginBottom: 15 }}>Order History</h3>
              {orders.length === 0 ? (
                <p style={{ color: '#64748b' }}>No orders placed yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                  {orders.map(order => (
                    <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: 15 }}>
                      <div>
                        <strong>{order.order_number}</strong>
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ color: 'var(--primary)' }}>৳{order.total}</strong>
                        <p style={{ textTransform: 'capitalize', fontSize: '0.85rem', color: order.status === 'delivered' ? '#10b981' : '#f59e0b' }}>{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
