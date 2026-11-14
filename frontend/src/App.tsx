import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { AdminLogin } from './pages/AdminLogin';
import { VendorDashboard } from './pages/VendorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

// Admin route handler: Shows AdminLogin if not logged in as ADMIN, otherwise renders AdminDashboard
const AdminRoute: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0b0f19]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-lg font-bold text-white">Loading Admin Console...</span>
        </div>
      </div>
    );
  }

  // If not logged in or not an ADMIN, show the dedicated Admin Login portal
  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return <AdminLogin />;
  }

  // Authenticated as Admin -> Render Admin Dashboard
  return <AdminDashboard />;
};

// Root dynamic redirect
const RootRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f2f4f7]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-lg font-bold text-slate-900">Loading CashPilot...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Vendor / Merchant Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Vendor Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['VENDOR']}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute allowedRoles={['VENDOR']}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Route: Automatically renders AdminLogin if unauthenticated, or AdminDashboard if authenticated */}
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="/admin/*" element={<AdminRoute />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Fallback */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
