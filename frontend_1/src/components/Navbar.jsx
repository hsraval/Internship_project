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
    <header className="fixed top-0 inset-x-0 z-40 bg-[#16537e] border-b border-[#124470] shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-xl font-semibold text-white tracking-tight hover:text-[#80b3ba] transition-colors"
        >
          Luminary
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-body transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Dashboard
              </Link>

              <div className="w-px h-5 bg-white/20 mx-2" />

              <div className="flex items-center gap-3">
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-mono text-white/50 uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-body font-medium text-white leading-none mt-0.5">
                    {user?.name || user?.email || 'User'}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#80b3ba] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#16537e] text-xs font-mono font-semibold uppercase">
                    {(user?.name || user?.email || 'U').charAt(0)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="ml-2 px-4 py-2 text-xs font-body text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-all duration-200 hover:bg-white/10 disabled:opacity-50"
              >
                {loggingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-body text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                Sign in
              </Link>
              <Link to="/register" className="btn-primary !py-2 !px-5 text-sm !bg-white !text-[#16537e] hover:!bg-[#d7e9f2]">
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
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
        <div className="md:hidden bg-[#16537e] border-t border-white/10 px-4 pb-4 pt-2 animate-fade-in">
          {isAuthenticated ? (
            <div className="flex flex-col gap-1">
              <div className="px-3 py-2 mb-1">
                <p className="text-xs font-mono text-white/50 uppercase tracking-widest">Signed in as</p>
                <p className="text-sm font-body font-medium text-white">
                  {user?.name || user?.email || 'User'}
                </p>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white font-body"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-3 py-2.5 rounded-lg text-sm text-left text-white/80 hover:bg-white/10 hover:text-white font-body disabled:opacity-50"
              >
                {loggingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white font-body"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="mt-2 px-3 py-2.5 rounded-lg text-sm text-center bg-white text-[#16537e] font-medium hover:bg-[#d7e9f2] transition-colors"
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
