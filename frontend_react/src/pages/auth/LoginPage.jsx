import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/style.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'superadmin') {
        navigate('/admin');
      } else if (user.role === 'seller') {
        navigate('/shop');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f1f4f9', fontFamily: 'Inter, sans-serif' }}>
      <div className="resp-auth-card" style={{ maxWidth: 420 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 25 }}>
          <div style={{ display: 'inline-flex', width: 50, height: 50, background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', borderRadius: 12, alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.4rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
            <i className="fas fa-rocket"></i>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, marginTop: 15, color: '#1e293b' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>Shop Smart, Live Better</p>
        </div>

        {error && (
          <div style={{ padding: 10, background: '#fee2e2', borderLeft: '4px solid #ef4444', color: '#991b1b', fontSize: '0.85rem', borderRadius: 6, marginBottom: 15 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>Email Address</label>
            <input type="email" required placeholder="name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 11, border: '1.5px solid #cbd5e1', borderRadius: 8, outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>Password</label>
            <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 11, border: '1.5px solid #cbd5e1', borderRadius: 8, outline: 'none' }} />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '12px 0', borderRadius: 8, fontSize: '0.95rem', fontWeight: 700, marginTop: 10 }}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: '#64748b' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign Up</Link>
        </div>

      </div>
    </div>
  );
}
