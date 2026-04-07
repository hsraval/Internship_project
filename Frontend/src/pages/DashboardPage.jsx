import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ active, onNavigate, onLogout, loggingOut, user }) {
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
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a1b14] border-r border-[#45362C]/50 flex flex-col z-30">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-[#45362C]/40">
        <Link to="/" className="font-serif text-base font-semibold text-[#e8dcc8] tracking-tight">
          Larkings<span className="text-[#A8977A]">MensWear</span>
        </Link>
      </div>

      {/* User chip */}
      <div className="px-4 py-4 border-b border-[#45362C]/40">
        <div className="flex items-center gap-3 bg-[#161711] rounded-xl px-3 py-3">
          <div className="w-9 h-9 rounded-xl bg-[#45362C] flex items-center justify-center flex-shrink-0">
            <span className="font-serif text-base font-semibold text-[#A8977A]">{initial}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-[#e8dcc8] text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-[#A8977A] text-[10px] font-mono uppercase tracking-widest">
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider transition-all duration-150 ${
                active === l.id
                  ? 'bg-[#45362C] text-[#e8dcc8]'
                  : 'text-[#9a8f7e] hover:bg-[#45362C]/40 hover:text-[#A8977A]'
              }`}
            >
              {l.icon}
              {l.label}
            </Link>
          ) : (
            <button
              key={l.id}
              onClick={() => onNavigate(l.id)}
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
      <div className="px-3 py-4 border-t border-[#45362C]/40">
        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider text-[#9a8f7e] hover:bg-red-900/20 hover:text-red-400 transition-all duration-150 disabled:opacity-50"
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
  ]

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#A8977A] mb-2">Admin Panel</p>
        <h1 className="font-serif text-3xl font-semibold text-[#e8dcc8]">
          Welcome back, {user?.name || 'Admin'}
        </h1>
        <p className="text-[#9a8f7e] text-sm mt-1">
          You have full access to manage the store.
        </p>
      </div>

      {/* Role badge */}
      <div className="inline-flex items-center gap-2 bg-[#45362C]/30 border border-[#45362C] rounded-full px-4 py-1.5 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A8977A]" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#A8977A]">Administrator</span>
      </div>

      {/* Quick action cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.href}
            className="block bg-[#1a1b14] border border-[#45362C]/50 rounded-xl p-6 hover:border-[#A8977A]/60 hover:shadow-[0_4px_24px_rgba(168,151,122,0.1)] transition-all duration-300 group"
          >
            <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">
              {c.icon}
            </div>
            <h3 className="font-serif font-semibold text-[#e8dcc8] mb-1">{c.label}</h3>
            <p className="text-[#9a8f7e] text-xs leading-relaxed">{c.desc}</p>
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
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#A8977A] mb-2">
          {getGreeting()}
        </p>
        <h1 className="font-serif text-3xl font-semibold text-[#e8dcc8]">
          {user?.name || user?.email || 'Welcome'}
        </h1>
        <p className="text-[#9a8f7e] text-sm mt-1">
          Explore our collection of premium fabrics.
        </p>
      </div>

      <div className="inline-flex items-center gap-2 bg-[#161711] border border-[#45362C]/50 rounded-full px-4 py-1.5 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#A8977A]">Active Session</span>
      </div>

      {/* Browse card */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          to="/products"
          className="block bg-[#1a1b14] border border-[#45362C]/50 rounded-xl p-6 hover:border-[#A8977A]/60 hover:shadow-[0_4px_24px_rgba(168,151,122,0.1)] transition-all duration-300 group"
        >
          <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">◎</div>
          <h3 className="font-serif font-semibold text-[#e8dcc8] mb-1">Browse Products</h3>
          <p className="text-[#9a8f7e] text-xs leading-relaxed">
            Explore our full catalogue of fabrics with search and category filters.
          </p>
        </Link>

        <div className="bg-[#1a1b14] border border-[#45362C]/50 rounded-xl p-6">
          <div className="text-2xl mb-3 opacity-40">⬡</div>
          <h3 className="font-serif font-semibold text-[#e8dcc8] mb-1">Orders</h3>
          <p className="text-[#9a8f7e] text-xs leading-relaxed">
            Order history and tracking — <span className="text-[#A8977A]">coming soon</span>.
          </p>
        </div>
      </div>

      {/* Account details */}
      <div className="mt-6 bg-[#1a1b14] border border-[#45362C]/50 rounded-xl p-6">
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#A8977A] mb-4">Account Details</h3>
        <div className="flex flex-col gap-3 divide-y divide-[#45362C]/30">
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
    <div className="flex justify-between items-center pt-3 first:pt-0">
      <span className="font-mono text-[10px] uppercase tracking-widest text-[#45362C]">{label}</span>
      <span className={`text-sm ${mono ? 'font-mono text-[#A8977A]/70' : 'text-[#9a8f7e]'}`}>{value}</span>
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
    <div className="min-h-screen bg-[#161711] text-[#e8dcc8] flex">
      <Sidebar
        active={active}
        onNavigate={setActive}
        onLogout={handleLogout}
        loggingOut={loggingOut}
        user={user}
      />

      {/* Main content — offset by sidebar width */}
      <main className="flex-1 ml-64 p-8 overflow-auto min-h-screen">
        {isAdmin ? (
          <AdminDashboard user={user} onNavigate={setActive} />
        ) : (
          <UserDashboard user={user} />
        )}
      </main>
    </div>
  )
}
