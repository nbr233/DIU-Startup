import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/style.css';

export default function AdminLoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in as admin, redirect straight to dashboard
  useEffect(() => {
    if (user && (user.role === 'superadmin' || user.role === 'admin')) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const loggedIn = await login(email, password);
      if (loggedIn.role === 'superadmin' || loggedIn.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Access denied. This portal is for administrators only.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute', top: -120, right: -120,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: -80,
        width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        position: 'relative',
        zIndex: 1
      }}>

        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            width: 60, height: 60,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.6rem',
            boxShadow: '0 8px 24px rgba(99,102,241,0.5)',
            marginBottom: 16
          }}>
            <i className="fas fa-shield-alt"></i>
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 800,
            color: '#f1f5f9',
            margin: '0 0 6px'
          }}>Admin Portal</h1>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
            DIU Startup — Authorized Personnel Only
          </p>
        </div>

        {/* Restricted access badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 8,
          padding: '8px 12px',
          marginBottom: 24,
          fontSize: '0.78rem',
          color: '#fca5a5'
        }}>
          <i className="fas fa-lock" style={{ fontSize: '0.75rem' }}></i>
          <span>Restricted access. Unauthorized attempts are logged.</span>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5',
            fontSize: '0.85rem',
            borderRadius: 8,
            marginBottom: 18
          }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: 8 }}></i>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#94a3b8',
              marginBottom: 6,
              letterSpacing: '0.02em'
            }}>Admin Email</label>
            <input
              type="email"
              id="admin-email"
              required
              placeholder="admin@diustartup.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
                outline: 'none',
                color: '#f1f5f9',
                fontSize: '0.92rem',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#94a3b8',
              marginBottom: 6,
              letterSpacing: '0.02em'
            }}>Password</label>
            <input
              type="password"
              id="admin-password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
                outline: 'none',
                color: '#f1f5f9',
                fontSize: '0.92rem',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
          </div>

          <button
            type="submit"
            id="admin-login-btn"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 0',
              borderRadius: 10,
              fontSize: '0.95rem',
              fontWeight: 700,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading
                ? 'rgba(99,102,241,0.5)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              marginTop: 6,
              boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transition: 'opacity 0.2s'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  animation: 'spin 0.6s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                Authenticating...
              </>
            ) : (
              <><i className="fas fa-sign-in-alt"></i> Sign In to Admin</>
            )}
          </button>
        </form>

        {/* Footer note */}
        <div style={{
          marginTop: 28,
          paddingTop: 20,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
          fontSize: '0.76rem',
          color: '#475569'
        }}>
          <i className="fas fa-info-circle" style={{ marginRight: 6 }}></i>
          Access is restricted to Super Admins only.
          <br />
          <a href="/" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600, marginTop: 6, display: 'inline-block' }}>
            ← Return to Store
          </a>
        </div>
      </div>
    </div>
  );
}
