import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/style.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '', password: '', password2: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(formData);
      showToast('Registration successful!', 'success');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.email?.[0] || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f1f4f9', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 35, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', width: '100%', maxWidth: 450, border: '1px solid #e2e8f0' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 25 }}>
          <div style={{ display: 'inline-flex', width: 50, height: 50, background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', borderRadius: 12, alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.4rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
            <i className="fas fa-rocket"></i>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, marginTop: 15, color: '#1e293b' }}>Create Account</h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>Join Bangladesh's Premier Startup Platform</p>
        </div>

        {error && (
          <div style={{ padding: 10, background: '#fee2e2', borderLeft: '4px solid #ef4444', color: '#991b1b', fontSize: '0.85rem', borderRadius: 6, marginBottom: 15 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>First Name</label>
              <input type="text" name="first_name" required placeholder="John" value={formData.first_name} onChange={handleInputChange} style={{ width: '100%', padding: 9, border: '1.5px solid #cbd5e1', borderRadius: 8, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>Last Name</label>
              <input type="text" name="last_name" required placeholder="Doe" value={formData.last_name} onChange={handleInputChange} style={{ width: '100%', padding: 9, border: '1.5px solid #cbd5e1', borderRadius: 8, outline: 'none' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>Email Address</label>
            <input type="email" name="email" required placeholder="name@domain.com" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: 9, border: '1.5px solid #cbd5e1', borderRadius: 8, outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>Phone Number</label>
            <input type="text" name="phone" required placeholder="01XXXXXXXXX" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', padding: 9, border: '1.5px solid #cbd5e1', borderRadius: 8, outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>Password</label>
            <input type="password" name="password" required placeholder="••••••••" value={formData.password} onChange={handleInputChange} style={{ width: '100%', padding: 9, border: '1.5px solid #cbd5e1', borderRadius: 8, outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: 5 }}>Confirm Password</label>
            <input type="password" name="password2" required placeholder="••••••••" value={formData.password2} onChange={handleInputChange} style={{ width: '100%', padding: 9, border: '1.5px solid #cbd5e1', borderRadius: 8, outline: 'none' }} />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '11px 0', borderRadius: 8, fontSize: '0.95rem', fontWeight: 700, marginTop: 10 }}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: '#64748b' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log In</Link>
        </div>

      </div>
    </div>
  );
}
