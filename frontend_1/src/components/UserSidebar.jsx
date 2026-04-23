import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UserSidebar({ onLogout, loggingOut, onCollapsedChange }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase()
  const location = useLocation()
  const [profileOpen, setProfileOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const profileRef = useRef(null)

  // Notify parent when collapsed state changes
  useEffect(() => {
    if (onCollapsedChange) {
      onCollapsedChange(collapsed)
    }
  }, [collapsed, onCollapsedChange])

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [profileOpen])

  const isActive = (href) => location.pathname === href

  const links = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'products',
      label: isAdmin ? 'Manage Products' : 'Browse Products',
      href: isAdmin ? '/admin/products' : '/products',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: 'orders',
      label: isAdmin ? 'Manage Orders' : 'My Orders',
      href: isAdmin ? '/admin/orders' : '/orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    ...(!isAdmin ? [{
      id: 'wishlist',
      label: 'Wishlist',
      href: '/wishlist',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    }] : []),
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Icon Rail */}
      <div className="md:hidden fixed inset-y-0 left-0 z-30 w-16 bg-white border-r border-slate-100 flex flex-col items-center py-4 gap-2">
        {/* Hamburger */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all mb-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Rail nav icons */}
        <div className="flex-1 flex flex-col items-center gap-1 w-full px-2">
          {links.map((l) => {
            const active = isActive(l.href)
            return (
              <Link
                key={l.id}
                to={l.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  active ? 'bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                }`}
                title={l.label}
              >
                {l.icon}
              </Link>
            )
          })}
        </div>

        {/* Rail profile avatar */}
        <div className="relative mt-auto" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((p) => !p)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm hover:shadow-md transition-all"
          >
            {initial}
          </button>
          {profileOpen && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-lg">
                  {initial}
                </div>
                <p className="font-semibold text-slate-900 text-sm leading-tight">{user?.name || 'User'}</p>
                {user?.email && <p className="text-xs text-slate-500 break-all">{user.email}</p>}
                <span className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#C5A059]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  {user?.role || 'member'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Rail logout */}
        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all mt-1 disabled:opacity-50"
          title="Logout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar */}
      <aside className={`
        md:hidden fixed inset-y-0 left-0 z-[60] w-72 bg-white border-r border-slate-100 shadow-2xl flex flex-col 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Brand Header */}
        <div className="h-20 flex items-center px-8 border-b border-slate-50">
          <Link to="/" className="font-serif text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2 h-8 bg-[#C5A059] rounded-full"></span>
            Larkinse<span className="text-[#C5A059]">MensWear</span>
          </Link>
          <button className="md:hidden ml-auto text-slate-400 hover:text-slate-600" onClick={() => setIsSidebarOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden px-4">
          {links.map((l) => {
            const active = isActive(l.href)
            return (
              <Link
                key={l.id}
                to={l.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  group flex items-center rounded-xl text-sm font-medium transition-all duration-200
                  gap-3 px-4 py-3.5
                  ${active
                    ? 'bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}>
                  {l.icon}
                </span>
                {l.label}
                {active && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Profile Section */}
        <div className="p-4 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-base">
              {initial}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
            </div>
            <button
              onClick={onLogout}
              disabled={loggingOut}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`
        hidden md:flex flex-col h-screen bg-white border-r border-slate-100
        transition-all duration-300 ease-in-out flex-shrink-0 relative
        ${collapsed ? 'w-[68px]' : 'w-72'}
      `}>

        {/* Desktop Brand + Collapse Button */}
        <div className={`h-20 flex items-center border-b border-slate-50 flex-shrink-0 ${collapsed ? 'justify-center px-0' : 'px-4'}`}>
          {collapsed ? (
            <button onClick={() => setCollapsed(false)} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all" title="Expand sidebar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          ) : (
            <>
              <Link to="/" className="font-serif text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2 h-8 bg-[#C5A059] rounded-full"></span>
                Larkinse<span className="text-[#C5A059]">MensWear</span>
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
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden ${collapsed ? 'px-2' : 'px-4'}`}>
          {links.map((l) => {
            const active = isActive(l.href)
            return (
              <Link
                key={l.id}
                to={l.href}
                onClick={() => setIsSidebarOpen(false)}
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

        {/* Bottom: Profile Avatar + Logout */}
        <div className={`p-4 border-t border-slate-50 ${collapsed ? 'flex flex-col items-center gap-2' : 'flex items-center gap-3'}`}>
          {/* Profile Avatar with Popover */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
              title="Profile"
            >
              {initial}
              {/* Online dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
            </button>

            {/* Profile Popover */}
            {profileOpen && (
              <div className="absolute bottom-14 left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-50 animate-in">
                {/* Arrow */}
                <div className="absolute -bottom-2 left-5 w-4 h-4 bg-white border-b border-r border-slate-100 rotate-45 rounded-sm" />

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-lg flex-shrink-0">
                    {initial}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-slate-900 text-sm truncate">{user?.name || 'User'}</p>
                    {user?.email && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-50">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#C5A059]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                    {user?.role || 'member'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          {collapsed ? (
            <button
              onClick={onLogout}
              disabled={loggingOut}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onLogout}
              disabled={loggingOut}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {loggingOut ? 'Signing out...' : 'Logout'}
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
