import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import '../../styles/style.css';

export default function BecomeSellerPage() {
  const { user, register, setUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
    shop_name: '',
    shop_category: 'Electronics',
    shop_description: '',
    shop_phone: '',
    shop_email: '',
    shop_address: ''
  });

  useEffect(() => {
    if (user) {
      if (user.role === 'seller' || user.role === 'admin' || user.role === 'superadmin') {
        navigate('/shop');
        return;
      }
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        phone: user.phone || '',
        shop_email: user.email || '',
        shop_phone: user.phone || ''
      }));
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      let activeUser = user;

      if (!activeUser) {
        if (formData.password !== formData.password2) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }

        const userPayload = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password2: formData.password2,
          role: 'seller'
        };

        activeUser = await register(userPayload);
      }

      const shopPayload = {
        name: formData.shop_name,
        description: formData.shop_description,
        category: formData.shop_category,
        contact_phone: formData.shop_phone || formData.phone,
        contact_email: formData.shop_email || formData.email,
        address: formData.shop_address
      };

      await API.post('/shops/', shopPayload);

      // Refresh user data (role will now be 'seller')
      const meRes = await API.get('/auth/me/');
      setUser(meRes.data);

      setSuccessMsg('Shop created successfully! Redirecting to seller dashboard...');
      setTimeout(() => navigate('/shop'), 2000);

    } catch (err) {
      console.error(err);
      const data = err.response?.data;
      setError(
        data?.email?.[0] ||
        data?.name?.[0] ||
        data?.detail ||
        'Registration failed. Please check your inputs and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #cbd5e1',
    borderRadius: 8,
    outline: 'none',
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    color: '#1e293b',
    boxSizing: 'border-box'
  };
  const labelStyle = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#475569',
    marginBottom: 6
  };
  const stepBadge = (n) => ({
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
    color: '#fff',
    fontSize: '0.8rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    flexShrink: 0
  });

  return (
    <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* HEADER */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '14px 0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: '#fff', padding: '8px 10px', borderRadius: 8 }}>
              <i className="fas fa-rocket"></i>
            </div>
            <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.15rem', fontFamily: 'Outfit, sans-serif' }}>
              DIU<span style={{ color: 'var(--primary)' }}> STARTUP</span>
            </span>
          </Link>
          <Link to="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fas fa-arrow-left"></i> Back to Store
          </Link>
        </div>
      </header>

      {/* HERO BANNER */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#fff', textAlign: 'center', padding: '40px 20px 50px' }}>
        <div style={{ display: 'inline-flex', width: 56, height: 56, background: 'rgba(255,255,255,0.18)', borderRadius: 14, alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: 14 }}>
          <i className="fas fa-store"></i>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: '0 0 8px' }}>Become a Seller</h1>
        <p style={{ fontSize: '1rem', opacity: 0.85, maxWidth: 480, margin: '0 auto' }}>
          Start selling to thousands of DIU students & staff. Set up your shop in under 2 minutes!
        </p>

        {/* Stats row */}
        <div className="resp-flex-row" style={{ marginTop: 24 }}>
          {[['0%', 'Commission (Intro)'], ['Free', 'Account Setup'], ['24/7', 'Support']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{val}</div>
              <div style={{ fontSize: '0.78rem', opacity: 0.75 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FORM CARD */}
      <div className="resp-form-container">

        {error && (
          <div style={{ padding: '12px 18px', background: '#fee2e2', borderLeft: '4px solid #ef4444', color: '#991b1b', fontSize: '0.88rem', borderRadius: 8, marginBottom: 18 }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }}></i>{error}
          </div>
        )}
        {successMsg && (
          <div style={{ padding: '12px 18px', background: '#dcfce7', borderLeft: '4px solid #22c55e', color: '#14532d', fontSize: '0.88rem', borderRadius: 8, marginBottom: 18 }}>
            <i className="fas fa-check-circle" style={{ marginRight: 8 }}></i>{successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 12px 40px rgba(0,0,0,0.07)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* ─── STEP 1: ACCOUNT CREDENTIALS (GUESTS ONLY) ─── */}
          {!user && (
            <section>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={stepBadge(1)}>1</span> Owner Credentials
              </h2>

              <div className="resp-grid-1-1" style={{ marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input type="text" name="first_name" required placeholder="Nurunnabi" value={formData.first_name} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input type="text" name="last_name" required placeholder="Reachad" value={formData.last_name} onChange={handleInputChange} style={inputStyle} />
                </div>
              </div>

              <div className="resp-grid-1-1" style={{ marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Email Address <span style={{ color: '#94a3b8', fontWeight: 400 }}>(login username)</span></label>
                  <input type="email" name="email" required placeholder="seller@diustartup.com" value={formData.email} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input type="text" name="phone" required placeholder="017XXXXXXXX" value={formData.phone} onChange={handleInputChange} style={inputStyle} />
                </div>
              </div>

              <div className="resp-grid-1-1">
                <div>
                  <label style={labelStyle}>Password</label>
                  <input type="password" name="password" required placeholder="••••••••" value={formData.password} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Confirm Password</label>
                  <input type="password" name="password2" required placeholder="••••••••" value={formData.password2} onChange={handleInputChange} style={inputStyle} />
                </div>
              </div>
            </section>
          )}

          {/* ─── STEP 2: SHOP SETUP ─── */}
          <section>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={stepBadge(2)}>{user ? '1' : '2'}</span> Shop Details
            </h2>

            {user && (
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', color: '#0369a1', marginBottom: 16 }}>
                <i className="fas fa-info-circle" style={{ marginRight: 8 }}></i>
                You're signed in as <strong>{user.email}</strong>. Creating a shop will upgrade your account to <strong>Seller</strong>.
              </div>
            )}

            <div className="resp-grid-1-1" style={{ marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Shop Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" name="shop_name" required placeholder="e.g. DIU Gadget Hub" value={formData.shop_name} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Shop Category</label>
                <select name="shop_category" value={formData.shop_category} onChange={handleInputChange} style={{ ...inputStyle, background: '#fff', cursor: 'pointer' }}>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty">Beauty & Health</option>
                  <option value="Sports">Sports & Fitness</option>
                  <option value="Home & Living">Home & Living</option>
                  <option value="Books">Books & Stationery</option>
                  <option value="Food">Food & Beverages</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="resp-grid-1-1" style={{ marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Shop Contact Phone</label>
                <input type="text" name="shop_phone" placeholder="019XXXXXXXX" value={formData.shop_phone} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Shop Contact Email</label>
                <input type="email" name="shop_email" placeholder="shop@domain.com" value={formData.shop_email} onChange={handleInputChange} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Shop Description</label>
              <textarea
                name="shop_description"
                rows={3}
                placeholder="Briefly describe what you sell — this appears on your shop's public profile..."
                value={formData.shop_description}
                onChange={handleInputChange}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={labelStyle}>Physical Address / Outlet Location</label>
              <input type="text" name="shop_address" placeholder="e.g. Daffodil Smart City, Ashulia, Savar" value={formData.shop_address} onChange={handleInputChange} style={inputStyle} />
            </div>
          </section>

          {/* TERMS NOTE */}
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', margin: '-10px 0 -10px' }}>
            By creating a shop you agree to the DIU Startup Seller Terms & Conditions.
          </p>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '14px 0', borderRadius: 10, fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          >
            {loading ? (
              <>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.6s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                Setting Up Your Shop...
              </>
            ) : (
              <><i className="fas fa-store"></i> Open My Shop Now</>
            )}
          </button>

          {!user && (
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', margin: '-15px 0 0' }}>
              Already have a seller account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Log In</Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
