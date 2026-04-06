import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const stats = [
  { label: 'Session', value: 'Active', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
  { label: 'Auth method', value: 'Cookie', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { label: 'Token exposure', value: 'None', color: 'text-ink-700', bg: 'bg-ink-50', border: 'border-ink-100' },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Signed out successfully')
      navigate('/')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  const displayName = user?.name || user?.email || 'User'
  const initial = displayName.charAt(0).toUpperCase()
  const greeting = getGreeting()

  return (
    <main className="min-h-screen bg-cream pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Welcome hero */}
        <div className="animate-fade-up mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-mono text-xs text-ink-400 uppercase tracking-widest mb-2">
                {greeting}
              </p>
              <h1 className="font-display text-4xl font-semibold text-ink-900 leading-tight">
                {displayName}
              </h1>
            </div>

            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-ink-900 flex items-center justify-center flex-shrink-0 shadow-card">
              <span className="font-display text-2xl font-semibold text-cream">{initial}</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-up animation-delay-100">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`rounded-xl border ${s.border} ${s.bg} px-4 py-3`}
            >
              <p className="font-mono text-[10px] text-ink-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`font-body font-semibold text-sm ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Main card */}
        <div className="auth-card mb-6 animate-fade-up animation-delay-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-ink-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-ink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h2 className="font-display font-semibold text-ink-900">Account details</h2>
          </div>

          <div className="flex flex-col gap-4">
            {user?.name && (
              <DetailRow label="Name" value={user.name} />
            )}
            {user?.email && (
              <DetailRow label="Email" value={user.email} />
            )}
            <DetailRow label="Auth cookie" value="HTTP-only · Secure · SameSite" mono />
            <DetailRow label="Access token" value="Not exposed to JavaScript" />
          </div>
        </div>

        {/* Security note */}
        <div className="rounded-xl border border-ink-100 bg-white p-5 mb-6 animate-fade-up animation-delay-300">
          <div className="flex gap-3">
            <div className="w-5 h-5 mt-0.5 flex-shrink-0">
              <svg className="text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <p className="font-body font-medium text-ink-800 text-sm mb-1">Session secured with HTTP-only cookies</p>
              <p className="font-body text-ink-400 text-xs leading-relaxed">
                Your session token lives in an HTTP-only cookie — invisible to JavaScript and immune to XSS attacks. 
                Axios sends it automatically on every request via <code className="font-mono bg-ink-50 px-1 py-0.5 rounded text-ink-600">withCredentials: true</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 animate-fade-up animation-delay-400">
          <button
            onClick={handleLogout}
            className="btn-ghost"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </main>
  )
}

function DetailRow({ label, value, mono = false }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-ink-50 last:border-0">
      <p className="font-mono text-xs text-ink-400 uppercase tracking-widest pt-0.5 flex-shrink-0">{label}</p>
      <p className={`text-sm text-right ${mono ? 'font-mono text-ink-600' : 'font-body text-ink-800'}`}>{value}</p>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
