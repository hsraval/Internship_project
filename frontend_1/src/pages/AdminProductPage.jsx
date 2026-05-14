import { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllProductsAdmin, deleteProduct, restoreProduct, getCategories } from '../api/api'
import ProductForm from './ProductForm'
import toast from 'react-hot-toast'
import LayoutWrapper from '../components/LayoutWrapper'

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ onLogout, loggingOut, user, collapsed, setCollapsed }) {
  const isAdmin = user?.role === 'admin'
  const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase()
  const location = useLocation()
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (href) => location.pathname === href

  const links = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'products',
      label: isAdmin ? 'Manage Products' : 'Browse Products',
      href: isAdmin ? '/admin/products' : '/products',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: 'orders',
      label: isAdmin ? 'Manage Orders' : 'My Orders',
      href: isAdmin ? '/admin/orders' : '/orders',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ]

  const LogoutIcon = (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )

  const ProfilePopup = ({ positionClasses, arrowClasses }) => (
    <div className={`absolute ${positionClasses} w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-50`}>
      <div className={`absolute w-4 h-4 bg-white border-slate-100 rotate-45 rounded-sm ${arrowClasses}`} />
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-lg flex-shrink-0">
          {initial}
        </div>
        <div className="overflow-hidden">
          <p className="font-semibold text-slate-900 text-sm truncate">{user?.name || 'User'}</p>
          {user?.email && <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>}
        </div>
      </div>
      <div className="pt-3 border-t border-slate-50">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#C5A059]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
          {user?.role || 'member'}
        </span>
      </div>
    </div>
  )

  return (
    <>
      {/* ── MOBILE: Backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE: Floating hamburger trigger ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm hover:bg-slate-50 transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ══════════════════════════════════════════════════════
          DESKTOP SIDEBAR
      ══════════════════════════════════════════════════════ */}
      <aside
        className={`
          hidden md:flex flex-col h-screen bg-white border-r border-slate-100
          transition-all duration-300 ease-in-out flex-shrink-0
          ${collapsed ? 'w-[68px]' : 'w-72'}
        `}
      >
        {/* Brand + Collapse Button */}
        <div className={`h-20 flex items-center border-b border-slate-50 flex-shrink-0 ${collapsed ? 'justify-center px-0' : 'px-4'}`}>
          {collapsed ? (
            <button onClick={() => setCollapsed(false)} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all" title="Expand sidebar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Link to="/" className="font-serif text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2 h-8 bg-[#C5A059] rounded-full flex-shrink-0" />
                Larkings<span className="text-[#C5A059]">MensWear</span>
              </Link>
              <button 
                onClick={() => setCollapsed(true)} 
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all flex-shrink-0"
                title="Collapse sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className={`flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden ${collapsed ? 'px-2' : 'px-4'}`}>
          {links.map((l) => {
            const active = isActive(l.href)
            return (
              <Link
                key={l.id}
                to={l.href}
                title={collapsed ? l.label : undefined}
                className={`
                  group flex items-center rounded-xl text-sm font-medium transition-all duration-200
                  ${collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-4 py-3.5'}
                  ${active
                    ? 'bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}>
                  {l.icon}
                </span>
                {!collapsed && (
                  <>
                    {l.label}
                    {active && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className={`border-t border-slate-50 py-4 flex flex-col gap-2 ${collapsed ? 'px-2 items-center' : 'px-4'}`}>
          {!collapsed && (
            <div className="px-2 mb-2">
              <p className="font-semibold text-slate-900 text-sm truncate">{user?.name || 'User'}</p>
              {user?.email && <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>}
            </div>
          )}

          {collapsed && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((p) => !p)}
                title="Profile"
                className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
              >
                {initial}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
              </button>

              {profileOpen && (
                <ProfilePopup 
                  positionClasses="left-12 bottom-0" 
                  arrowClasses="top-3 -left-2 border-l border-b border-slate-100"
                />
              )}
            </div>
          )}

          <button
            onClick={onLogout}
            disabled={loggingOut}
            title="Logout"
            className={`
              flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              ${collapsed ? 'w-10 h-10' : 'gap-2 px-4 py-2.5 w-full text-sm font-medium text-slate-500'}
            `}
          >
            {LogoutIcon}
            {!collapsed && (loggingOut ? 'Signing out...' : 'Logout')}
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════════════════════ */}
      <aside className={`
        md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 shadow-2xl flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-20 flex items-center px-4 border-b border-slate-50 flex-shrink-0">
          <Link to="/" className="font-serif text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2 h-8 bg-[#C5A059] rounded-full" />
            Larkings<span className="text-[#C5A059]">MensWear</span>
          </Link>
          <button className="ml-auto text-slate-400 hover:text-slate-600" onClick={() => setMobileOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {links.map((l) => {
            const active = isActive(l.href)
            return (
              <Link
                key={l.id}
                to={l.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? 'bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}>{l.icon}</span>
                {l.label}
                {active && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-50 flex flex-col gap-2">
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm hover:shadow-md transition-all"
              title="Profile"
            >
              {initial}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
            </button>
            {profileOpen && (
              <ProfilePopup 
                positionClasses="bottom-14 left-0" 
                arrowClasses="-bottom-2 left-5 border-b border-r border-slate-100"
              />
            )}
          </div>
          <button
            onClick={onLogout}
            disabled={loggingOut}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {LogoutIcon}
            {loggingOut ? 'Signing out...' : 'Logout'}
          </button>
        </div>
      </aside>
    </>
  )
}

// ─── Confirm Dialog ───────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-[#1e2a3a]/60 backdrop-blur-sm transition-opacity" />
      <div className="relative z-10 bg-white border border-[#b0d3e6] rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100" onClick={(e) => e.stopPropagation()}>
        <p className="text-[#1e2a3a] font-sans text-base mb-6 leading-relaxed font-medium">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-6 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider border border-[#b0d3e6] text-[#16537e]/70 rounded-lg hover:border-[#16537e] hover:bg-[#16537e] hover:text-white transition-all duration-300">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-6 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────
function StatusBadge({ deleted }) {
  return deleted ? (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA] rounded-full px-3 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
      Deleted
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] rounded-full px-3 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
      Active
    </span>
  )
}

// ─── Main Component ─────────────────────────────────────────────
export default function AdminProductPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  
  // Switched to collapsed state to match Dashboard
  const [collapsed, setCollapsed] = useState(false)

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('')
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // Modal & Dialog states
  const [showForm, setShowForm]       = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const LIMIT = 8

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data.data ?? []))
      .catch(() => {})
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCategoryOpen && !event.target.closest('.category-dropdown')) {
        setIsCategoryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isCategoryOpen])

  const fetchProducts = useCallback(() => {
    setLoading(true)
    const params = { page, limit: LIMIT }
    if (search.trim()) params.search = search.trim()
    if (category) params.category = category

    getAllProductsAdmin(params)
      .then(({ data }) => {
        setProducts(data.data ?? data.products ?? data ?? [])
        if (data.pagination?.totalPages) setTotalPages(data.pagination.totalPages)
        else if (data.total) setTotalPages(Math.ceil(data.total / LIMIT))
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [page, search, category])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleSearch = (val) => { setSearch(val); setPage(1) }
  const handleCategory = (val) => { setCategory(val); setPage(1) }

  const handleDelete = async (product) => {
    try {
      await deleteProduct(product._id)
      toast.success(`"${product.name}" deleted`)
      fetchProducts()
    } catch (err) {
      toast.error(err.userMessage || 'Delete failed')
    }
    setConfirm(null)
  }

  const handleRestore = async (product) => {
    try {
      await restoreProduct(product._id)
      toast.success(`"${product.name}" restored`)
      fetchProducts()
    } catch (err) {
      toast.error(err.userMessage || 'Restore failed')
    }
    setConfirm(null)
  }

  const openCreate = () => { setEditProduct(null); setShowForm(true) }
  const openEdit   = (p)  => { setEditProduct(p);    setShowForm(true) }
  const closeForm  = ()   => { setShowForm(false); setEditProduct(null) }
  const onSaved    = ()   => { closeForm(); fetchProducts() }

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
    }
  }

  return (
    <LayoutWrapper>
      {/* Header */}
      <div className="px-4 md:px-8 py-4 md:py-6 flex-shrink-0 bg-[#d7e9f2]/20 border-b border-[#b0d3e6]/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-[#16537e]/60 font-semibold mb-1">Admin Panel</p>
              <h1 className="font-sans text-2xl md:text-3xl font-bold text-[#1e2a3a]">Manage Products</h1>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="group relative inline-flex items-center justify-center w-12 h-12 overflow-hidden rounded-full bg-[#16537e] text-white shadow-lg transition-all hover:bg-[#124470] hover:shadow-[#16537e]/40 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#16537e] focus:ring-offset-2"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <svg className="w-6 h-6 relative transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="px-4 md:px-8 py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        <div className="md:col-span-8 relative group">
          <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[#80b3ba] group-focus-within:text-[#16537e] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name, SKU or category..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-[#b0d3e6]/50 rounded-xl leading-5 bg-white placeholder-[#80b3ba] focus:outline-none focus:ring-2 focus:ring-[#16537e]/20 focus:border-[#16537e] sm:text-sm transition-all shadow-sm font-sans"
            />
          </div>

          <div className="md:col-span-4 relative category-dropdown">
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="relative w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 sm:py-3 text-left bg-white border border-[#b0d3e6]/50 rounded-xl shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#16537e]/20 focus:border-[#16537e] sm:text-sm transition-all hover:border-[#16537e]/30 font-sans"
            >
              <span className="block truncate text-[#1e2a3a]">
                {category ? categories.find(c => c._id === category)?.name || 'All Categories' : 'All Categories'}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
                <svg className="h-4 w-4 text-[#80b3ba]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {isCategoryOpen && (
              <div className="absolute z-10 mt-2 w-full rounded-xl bg-white shadow-xl border border-[#b0d3e6]/50 max-h-60 overflow-auto">
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => { handleCategory(''); setIsCategoryOpen(false) }}
                    className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-[#1e2a3a] hover:bg-[#f4f9fb] hover:text-[#16537e] transition-colors font-sans"
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => { handleCategory(c._id); setIsCategoryOpen(false) }}
                      className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-sm transition-colors font-sans ${category === c._id ? 'bg-[#16537e]/10 text-[#16537e] font-medium' : 'text-[#1e2a3a] hover:bg-[#f4f9fb]'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid/Table */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 sm:py-24">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-[#d7e9f2] border-t-[#16537e] rounded-full animate-spin" />
              <p className="mt-3 sm:mt-4 text-sm text-[#16537e]/70 font-sans font-medium animate-pulse">Loading inventory...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 sm:py-24 bg-white rounded-2xl border border-dashed border-[#b0d3e6]">
              <div className="p-3 sm:p-4 bg-[#f4f9fb] rounded-full mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#80b3ba]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <p className="font-medium text-[#1e2a3a] text-sm sm:text-base font-sans">No products found</p>
              <p className="text-xs text-[#16537e]/60 mt-1 font-sans">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#b0d3e6]/50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#16537e] border-b-2 border-[#124470] hidden lg:table-header-group shadow-lg">
                    <tr>
                      <th className="px-4 sm:px-6 py-4 sm:py-5 text-xs font-sans font-semibold text-white uppercase tracking-widest border-r border-white/10">Product Details</th>
                      <th className="px-4 sm:px-6 py-4 sm:py-5 text-xs font-sans font-semibold text-white uppercase tracking-widest border-r border-white/10">Category</th>
                      <th className="px-4 sm:px-6 py-4 sm:py-5 text-xs font-sans font-semibold text-white uppercase tracking-widest border-r border-white/10">Price / Meter</th>
                      <th className="px-4 sm:px-6 py-4 sm:py-5 text-xs font-sans font-semibold text-white uppercase tracking-widest border-r border-white/10">Status</th>
                      <th className="px-4 sm:px-6 py-4 sm:py-5 text-right text-xs font-sans font-semibold text-white uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#b0d3e6]/30 bg-white">
                    {products.map((p) => (
                      <tr key={p._id} className="group hover:bg-[#f4f9fb] transition-all duration-200 border-b border-[#b0d3e6]/30">
                        
                        {/* Mobile Stacked Layout */}
                        <td className="p-3 sm:p-4 lg:table-cell block lg:py-5 lg:px-6 align-top bg-gradient-to-b from-white to-[#f4f9fb] lg:bg-transparent">
                          <div className="flex gap-3 sm:gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#d7e9f2]/30 border border-[#b0d3e6]/50 overflow-hidden">
                                {p.images?.[0] ? (
                                  <img src={p.images[0]?.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#80b3ba]">
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between bg-[#f4f9fb] lg:bg-transparent p-3 lg:p-0 rounded-lg -m-3 lg:m-0 mb-2">
                                <h3 className="text-sm sm:text-base font-bold text-[#1e2a3a] font-sans truncate pr-2">{p.name}</h3>
                                <div className="lg:hidden">
                                  <StatusBadge deleted={p.isDeleted || p.deletedAt} />
                                </div>
                              </div>
                              
                              <div className="mt-3 space-y-3 lg:hidden font-sans">
                                <div className="flex justify-between items-center py-1">
                                  <span className="text-xs uppercase text-[#16537e]/60 font-semibold tracking-wider">Category</span>
                                  <span className="text-sm font-semibold text-[#1e2a3a]">
                                    {p.category?.name ?? '—'}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                  <span className="text-xs uppercase text-[#16537e]/60 font-semibold tracking-wider">Price</span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-base font-bold text-[#16537e]">₹</span>
                                    <span className="text-sm font-semibold text-[#1e2a3a]">
                                      {Number(p.pricePerMeter).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {p.description && (
                                <p className="hidden lg:block mt-1 text-xs text-[#16537e]/70 font-sans line-clamp-2 max-w-md">{p.description}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="hidden lg:table-cell px-4 sm:px-6 py-4 sm:py-6 align-middle font-sans">
                          <span className="text-sm font-semibold text-[#1e2a3a]">
                            {p.category?.name ?? '—'}
                          </span>
                        </td>

                        <td className="hidden lg:table-cell px-4 sm:px-6 py-4 sm:py-6 align-middle font-sans">
                          <div className="flex items-center gap-1">
                            <span className="text-base font-bold text-[#16537e]">₹</span>
                            <span className="text-sm font-semibold text-[#1e2a3a]">
                              {Number(p.pricePerMeter).toLocaleString()}
                            </span>
                          </div>
                        </td>

                        <td className="hidden lg:table-cell px-4 sm:px-6 py-4 sm:py-6 align-middle">
                          <div className="flex items-center">
                            <StatusBadge deleted={p.isDeleted || p.deletedAt} />
                          </div>
                        </td>

                        <td className="p-3 sm:p-4 lg:table-cell lg:py-6 lg:px-6 align-middle text-right bg-gradient-to-l from-[#f4f9fb] to-transparent lg:bg-none">
                          <div className="flex items-center gap-2 sm:gap-3 lg:justify-end justify-start mt-3 lg:mt-0">
                            
                            <button
                              onClick={() => openEdit(p)}
                              disabled={p.isDeleted || p.deletedAt}
                              title="Edit Product"
                              className={`group relative p-2 sm:p-2.5 rounded-lg transition-all duration-300
                                ${!(p.isDeleted || p.deletedAt) 
                                  ? 'bg-[#d7e9f2]/50 text-[#16537e] hover:bg-[#16537e] hover:text-white hover:shadow-lg hover:shadow-[#16537e]/30 hover:-translate-y-0.5' 
                                  : 'opacity-50 cursor-not-allowed bg-[#d7e9f2]/30 text-[#80b3ba]'}
                              `}
                            >
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>

                            {p.isDeleted || p.deletedAt ? (
                              <button
                                onClick={() => setConfirm({ type: 'restore', product: p })}
                                title="Restore Product"
                                className="group relative p-2 sm:p-2.5 rounded-lg bg-[#ECFDF5] text-[#059669] hover:bg-[#059669] hover:text-white hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-300"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => setConfirm({ type: 'delete', product: p })}
                                title="Delete Product"
                                className="group relative p-2 sm:p-2.5 rounded-lg bg-[#FEF2F2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-300"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 sm:mt-8 pb-4 font-sans">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-[#b0d3e6]/50 bg-white text-[#16537e]/60 hover:border-[#16537e] hover:text-[#16537e] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm font-semibold transition-all ${
                      page === i + 1
                        ? 'bg-[#16537e] text-white shadow-md'
                        : 'bg-white text-[#16537e]/60 hover:bg-[#d7e9f2]/40 border border-[#b0d3e6]/50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-[#b0d3e6]/50 bg-white text-[#16537e]/60 hover:border-[#16537e] hover:text-[#16537e] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}
        </div>

      {/* Modals */}
      {showForm && (
        <ProductForm
          product={editProduct}
          categories={categories}
          onClose={closeForm}
          onSaved={onSaved}
        />
      )}
      {confirm && (
        <ConfirmDialog
          message={
            confirm.type === 'delete'
              ? `Are you sure you want to delete "${confirm.product.name}"?`
              : `Restore "${confirm.product.name}" to active inventory?`
          }
          onConfirm={() =>
            confirm.type === 'delete'
              ? handleDelete(confirm.product)
              : handleRestore(confirm.product)
          }
          onCancel={() => setConfirm(null)}
        />
      )}
    </LayoutWrapper>
  )
}