import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
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
import WishlistPage from './pages/WishlistPage'

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <WishlistProvider>
          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2000,
              style: {
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: '13px',
                background: '#ffffff',
                color: '#1e2a3a',
                border: '1px solid #80b3ba',
                borderRadius: '10px',
                padding: '12px 16px',
                boxShadow: '0 8px 32px rgba(22,83,126,0.15)',
              },
              success: {
                iconTheme: { primary: '#16a34a', secondary: '#ffffff' },
              },
              error: {
                iconTheme: { primary: '#dc2626', secondary: '#ffffff' },
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

            <Route path="/wishlist" element={<WishlistPage />}/>

            {/* Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </WishlistProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
