import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ active, onNavigate, onLogout, loggingOut, user, isSidebarOpen, setIsSidebarOpen }) {
  const isAdmin = user?.role === 'admin'
  const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase()

  const links = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'products',
      label: isAdmin ? 'Manage Products' : 'Browse Products',
      href: isAdmin ? '/admin/products' : '/products',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: 'orders',
      label: isAdmin ? 'Manage Orders' : 'My Orders',
      href: isAdmin ? '/admin/orders' : '/orders',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ]

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-[#E8E0D0] border-r border-[#6B5F50]/50 flex flex-col 
      transform transition-transform duration-300 ease-in-out
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0 md:static md:inset-auto
    `}>
      {/* Brand */}
      <div className="px-6 py-5 border-b border-[#6B5F50]/40 flex justify-between items-center">
        <Link to="/" className="font-serif text-base font-semibold text-[#6B5F50]">
          Larkings<span className="text-[#6B5F50]">MensWear</span>
        </Link>
        <button 
          className="md:hidden text-[#6B5F50]/70"
          onClick={() => setIsSidebarOpen(false)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* User chip */}
      <div className="px-4 py-4 border-b border-[#6B5F50]/40">
        <div className="flex items-center gap-3 bg-[#6B5F50]/10 rounded-xl px-3 py-3">
          <div className="w-9 h-9 rounded-xl bg-[#6B5F50]/30 flex items-center justify-center flex-shrink-0">
            <span className="font-serif text-base font-semibold text-[#6B5F50]">{initial}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-[#6B5F50] text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-[#6B5F50]/70 text-[10px] font-mono uppercase tracking-widest">
              {user?.role || 'user'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map((l) =>
          l.href ? (
            <Link
              key={l.id}
              to={l.href}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider transition-all duration-150 ${
                active === l.id
                  ? 'bg-[#6B5F50] text-[#E8E0D0]'
                  : 'text-[#6B5F50]/70 hover:bg-[#6B5F50]/20 hover:text-[#6B5F50]'
              }`}
            >
              {l.icon}
              {l.label}
            </Link>
          ) : (
            <button
              key={l.id}
              onClick={() => { onNavigate(l.id); setIsSidebarOpen(false) }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider transition-all duration-150 w-full text-left ${
                active === l.id
                  ? 'bg-[#45362C] text-[#e8dcc8]'
                  : 'text-[#9a8f7e] hover:bg-[#45362C]/40 hover:text-[#A8977A]'
              }`}
            >
              {l.icon}
              {l.label}
            </button>
          )
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#6B5F50]/40">
        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider text-[#6B5F50]/70 hover:bg-red-600/20 hover:text-red-600 transition-all duration-150 disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {loggingOut ? 'Signing out…' : 'Logout'}
        </button>
      </div>
    </aside>
  )
}

// ─── Admin Dashboard Content ──────────────────────────────────────────────────

function AdminDashboard({ user, onNavigate }) {
  const cards = [
    {
      label: 'Manage Products',
      desc: 'Add, edit, delete, and restore fabric listings.',
      icon: '◈',
      action: () => onNavigate('products'),
      href: '/admin/products',
    },
    {
      label: 'Manage Orders',
      desc: 'View all orders, update status, and download invoices.',
      icon: '◎',
      href: '/admin/orders',
    },
  ]

  return (
    <div>
      {/* Role badge */}
      <div className="inline-flex items-center gap-2 bg-[#6B5F50]/30 border border-[#6B5F50] rounded-full px-3 sm:px-4 py-1.5 mb-6 sm:mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-[#6B5F50]" />
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#6B5F50]">Administrator</span>
      </div>

      <p className="text-[#6B5F50]/70 text-sm mb-6 sm:mb-8">
        You have full access to manage the store.
      </p>

      {/* Quick action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.href}
            className="block bg-[#E8E0D0] border border-[#6B5F50]/50 rounded-xl p-4 sm:p-6 hover:border-[#6B5F50]/60 hover:shadow-[0_4px_24px_rgba(107,95,80,0.1)] transition-all duration-300 group"
          >
            <div className="text-xl sm:text-2xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">
              {c.icon}
            </div>
            <h3 className="font-serif font-semibold text-[#6B5F50] text-sm sm:text-base mb-1">{c.label}</h3>
            <p className="text-[#6B5F50]/70 text-xs leading-relaxed">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── User Dashboard Content ───────────────────────────────────────────────────

function UserDashboard({ user }) {
  return (
    <div>
      {/* Active session badge */}
      <div className="inline-flex items-center gap-2 bg-[#6B5F50]/10 border border-[#6B5F50]/50 rounded-full px-3 sm:px-4 py-1.5 mb-6 sm:mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#6B5F50]">Active Session</span>
      </div>

      <p className="text-[#6B5F50]/70 text-sm mb-6 sm:mb-8">
        Explore our collection of premium fabrics.
      </p>

      {/* Action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Link
          to="/products"
          className="block bg-[#E8E0D0] border border-[#6B5F50]/50 rounded-xl p-4 sm:p-6 hover:border-[#6B5F50]/60 hover:shadow-[0_4px_24px_rgba(107,95,80,0.1)] transition-all duration-300 group"
        >
          <div className="text-xl sm:text-2xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">◎</div>
          <h3 className="font-serif font-semibold text-[#6B5F50] text-sm sm:text-base mb-1">Browse Products</h3>
          <p className="text-[#6B5F50]/70 text-xs leading-relaxed">
            Explore our full catalogue of fabrics with search and category filters.
          </p>
        </Link>

        {/* <div className="bg-[#E8E0D0] border border-[#6B5F50]/50 rounded-xl p-4 sm:p-6">
          <div className="text-xl sm:text-2xl mb-3 opacity-40">⬡</div>
          <h3 className="font-serif font-semibold text-[#6B5F50] text-sm sm:text-base mb-1">Orders</h3>
          <p className="text-[#6B5F50]/70 text-xs leading-relaxed">
            Order history and tracking — <span className="text-[#6B5F50]">coming soon</span>.
          </p>
        </div> */}
        <Link
          to="/orders"
          className="block bg-[#E8E0D0] border border-[#6B5F50]/50 rounded-xl p-4 sm:p-6 hover:border-[#6B5F50]/60 hover:shadow-[0_4px_24px_rgba(107,95,80,0.1)] transition-all duration-300 group"
        >
          <div className="text-xl sm:text-2xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">⬡</div>
          <h3 className="font-serif font-semibold text-[#6B5F50] text-sm sm:text-base mb-1">My Orders</h3>
          <p className="text-[#6B5F50]/70 text-xs leading-relaxed">
            View your order history and download invoices.
          </p>
        </Link>
      </div>

      {/* Account details */}
      <div className="mt-6 sm:mt-8 bg-[#E8E0D0] border border-[#6B5F50]/50 rounded-xl p-4 sm:p-6">
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50] mb-4">Account Details</h3>
        <div className="flex flex-col gap-3 divide-y divide-[#6B5F50]/30">
          {user?.name && <Detail label="Name" value={user.name} />}
          {user?.email && <Detail label="Email" value={user.email} />}
          <Detail label="Auth" value="HTTP-only cookie · Secure" mono />
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value, mono }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 first:pt-0 gap-1 sm:gap-0">
      <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50]">{label}</span>
      <span className={`text-sm break-words ${mono ? 'font-mono text-[#6B5F50]/70' : 'text-[#6B5F50]/70'}`}>{value}</span>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')
  const [loggingOut, setLoggingOut] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const isAdmin = user?.role === 'admin'

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
    // Hides global Navbar — full-page layout with sidebar only
    <div className="min-h-screen bg-[#E8E0D0] text-[#6B5F50] flex">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar
        active={active}
        onNavigate={setActive}
        onLogout={handleLogout}
        loggingOut={loggingOut}
        user={user}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Scrollable Header Area */}
        <div className="p-4 md:p-8 flex-shrink-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-1 text-[#6B5F50] border border-[#6B5F50] rounded"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50]/70 mb-1">
                  {isAdmin ? 'Admin Panel' : getGreeting()}
                </p>
                <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#6B5F50]">
                  {isAdmin ? `Welcome back, ${user?.name || 'Admin'}` : (user?.name || user?.email || 'Welcome')}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-4">
          {isAdmin ? (
            <AdminDashboard user={user} onNavigate={setActive} />
          ) : (
            <UserDashboard user={user} />
          )}
        </div>
      </main>
    </div>
  )
}
