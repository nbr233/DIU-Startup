import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth, RequireRole } from './components/ProtectedRoute';

// ── Customer pages (lazy loaded)
const HomePage = lazy(() => import('./pages/customer/HomePage'));
const ProductPage = lazy(() => import('./pages/customer/ProductPage'));
const CartPage = lazy(() => import('./pages/customer/CartPage'));
const CheckoutPage = lazy(() => import('./pages/customer/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const AccountPage = lazy(() => import('./pages/customer/AccountPage'));

// ── Seller Dashboard pages
const ShopLayout = lazy(() => import('./pages/shop/ShopLayout'));
const BecomeSellerPage = lazy(() => import('./pages/shop/BecomeSellerPage'));

// ── Super Admin pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));

function Loading() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'4px solid #e2e8f0', borderTopColor:'#6366f1', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* ── Customer Routes ── */}
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
            <Route path="/account" element={<RequireAuth><AccountPage /></RequireAuth>} />

            {/* ── Auth Routes ── */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/become-seller" element={<BecomeSellerPage />} />

            {/* ── Seller Dashboard Routes ── */}
            <Route path="/shop/*" element={
              <RequireRole roles={['seller', 'admin', 'superadmin']}>
                <ShopLayout />
              </RequireRole>
            } />

            {/* ── Super Admin Routes ── */}
            <Route path="/admin/*" element={
              <RequireRole roles={['admin', 'superadmin']}>
                <AdminLayout />
              </RequireRole>
            } />

            {/* ── 404 ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
