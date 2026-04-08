import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import Navbar from './components/Navbar'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import ProductPage from './pages/ProductPage'
import AdminProductPage from './pages/AdminProductPage'
import OrderPage        from "./pages/OrderPage";
import MyOrdersPage     from "./pages/MyOrdersPage";
import AdminOrdersPage  from "./pages/AdminOrdersPage";
import OrderDetailPage  from "./pages/OrderDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: '13px',
                background: '#E8E0D0',
                color: '#6B5F50',
                border: '1px solid #6B5F50',
                borderRadius: '10px',
                padding: '12px 16px',
                boxShadow: '0 8px 32px rgba(107,95,80,0.2)',
              },
              success: {
                iconTheme: { primary: '#6B5F50', secondary: '#E8E0D0' },
              },
              error: {
                iconTheme: { primary: '#6B5F50', secondary: '#E8E0D0' },
              },
            }}
          />

          {/* <Navbar /> */}

          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />

            {/* Guest-only (redirects logged-in users to /dashboard) */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <RegisterPage />
                </GuestRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <GuestRoute>
                  <ForgotPasswordPage />
                </GuestRoute>
              }
            />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />

            {/* Protected (redirects guests to /login) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/products" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute><AdminProductPage /></ProtectedRoute>} />
            
            <Route path="/order"      element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
            <Route path="/orders"     element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin/orders"     element={<ProtectedRoute><AdminOrdersPage /></ProtectedRoute>} />
            <Route path="/admin/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
