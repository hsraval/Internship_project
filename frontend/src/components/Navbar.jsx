import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      toast.success('Signed out successfully')
      navigate('/')
    } catch {
      toast.error('Failed to sign out')
    } finally {
      setLoggingOut(false)
      setMenuOpen(false)
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-cream/80 backdrop-blur-md border-b border-ink-100">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-xl font-semibold text-ink-900 tracking-tight hover:text-ink-600 transition-colors"
        >
          Luminary
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {/* Product and Fabric links - always visible */}
          <button
            onClick={() => {
              const element = document.getElementById('products-section')
              element?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-4 py-2 rounded-lg text-sm font-body text-ink-600 hover:text-ink-900 hover:bg-ink-50 transition-colors"
          >
            Products
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('fabrics-section')
              element?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-4 py-2 rounded-lg text-sm font-body text-ink-600 hover:text-ink-900 hover:bg-ink-50 transition-colors"
          >
            Fabrics
          </button>

          {isAuthenticated ? (
            <>
              <div className="w-px h-5 bg-ink-200 mx-2" />
              
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-body transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-ink-100 text-ink-900'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                }`}
              >
                Dashboard
              </Link>

              <div className="w-px h-5 bg-ink-200 mx-2" />

              <div className="flex items-center gap-3">
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-mono text-ink-400 uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-body font-medium text-ink-800 leading-none mt-0.5">
                    {user?.name || user?.email || 'User'}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-ink-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-cream text-xs font-mono font-medium uppercase">
                    {(user?.name || user?.email || 'U').charAt(0)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="btn-ghost ml-2 !py-2 !px-4 text-xs"
              >
                {loggingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-body text-ink-600 hover:text-ink-900 transition-colors rounded-lg hover:bg-ink-50"
              >
                Sign in
              </Link>
              <Link to="/register" className="btn-primary !py-2 !px-5 text-sm">
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 text-ink-600 hover:text-ink-900 rounded-lg hover:bg-ink-50 transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-ink-100 px-4 pb-4 pt-2 animate-fade-in">
          {/* Product and Fabric links - always visible */}
          <button
            onClick={() => {
              const element = document.getElementById('products-section')
              element?.scrollIntoView({ behavior: 'smooth' })
              setMenuOpen(false)
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-ink-700 hover:bg-ink-50 font-body"
          >
            Products
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('fabrics-section')
              element?.scrollIntoView({ behavior: 'smooth' })
              setMenuOpen(false)
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-ink-700 hover:bg-ink-50 font-body"
          >
            Fabrics
          </button>

          {isAuthenticated ? (
            <div className="flex flex-col gap-1 mt-2">
              <div className="px-3 py-2 mb-1 border-t border-ink-100 pt-3">
                <p className="text-xs font-mono text-ink-400 uppercase tracking-widest">Signed in as</p>
                <p className="text-sm font-body font-medium text-ink-800">
                  {user?.name || user?.email || 'User'}
                </p>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm text-ink-700 hover:bg-ink-50 font-body"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-3 py-2.5 rounded-lg text-sm text-left text-ink-700 hover:bg-ink-50 font-body disabled:opacity-50"
              >
                {loggingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1 mt-2">
              <div className="px-3 py-2 mb-1 border-t border-ink-100 pt-3">
                <p className="text-xs font-mono text-ink-400 uppercase tracking-widest">Account</p>
              </div>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm text-ink-700 hover:bg-ink-50 font-body"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="btn-primary w-full justify-center mt-2"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
