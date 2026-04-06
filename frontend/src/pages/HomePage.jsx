import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  {
    icon: '⬡',
    title: 'Cookie-based sessions',
    desc: 'Secure HTTP-only cookies. No tokens exposed to JavaScript.',
  },
  {
    icon: '◈',
    title: 'Full auth lifecycle',
    desc: 'Register, login, logout, forgot & reset password — all handled.',
  },
  {
    icon: '◎',
    title: 'Protected routes',
    desc: 'Automatic redirect guards for authenticated and guest pages.',
  },
]

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <main className="min-h-screen bg-cream overflow-hidden">
      {/* Hero */}
      <section className="relative pt-36 pb-24 px-4 text-center">
        {/* Background decoration */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-[50%] bg-parchment blur-3xl opacity-70" />
          <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-gold-400/10 blur-3xl" />
          <div className="absolute top-10 right-1/4 w-96 h-96 rounded-full bg-ink-200/30 blur-3xl" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-ink-100 shadow-card text-xs font-mono text-ink-500 uppercase tracking-widest mb-8 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
          Secure auth module
        </div>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold text-ink-900 leading-[1.05] tracking-tight mb-6 animate-fade-up animation-delay-100 text-balance">
          Elegant access
          <br />
          <em className="font-display italic font-normal text-ink-500">for every user</em>
        </h1>

        <p className="max-w-xl mx-auto font-body text-ink-500 text-lg leading-relaxed mb-10 animate-fade-up animation-delay-200">
          A production-ready React authentication module with secure cookies,
          form validation, and thoughtful UX from first visit to logged-in state.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-up animation-delay-300">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary text-base px-8 py-4">
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-base px-8 py-4">
                Create account
              </Link>
              <Link to="/login" className="btn-ghost text-base px-8 py-4">
                Sign in
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="border-t border-ink-100" />
      </div>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center font-mono text-xs text-ink-400 uppercase tracking-widest mb-12">
            What's included
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="auth-card hover:shadow-card-hover transition-all duration-300 group"
                style={{ animationDelay: `${i * 100 + 400}ms` }}
              >
                <div className="text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-ink-900 mb-2">{f.title}</h3>
                <p className="font-body text-ink-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-ink-950 rounded-2xl p-12 relative overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 grain-overlay opacity-50 pointer-events-none"
              />
              <h2 className="font-display text-3xl font-semibold text-cream mb-4">
                Ready to begin?
              </h2>
              <p className="font-body text-ink-300 mb-8 text-sm">
                Sign up in seconds. No credit card required.
              </p>
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3 bg-cream text-ink-900 rounded-lg font-body font-medium text-sm hover:bg-parchment transition-colors">
                Get started free
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-ink-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-display text-ink-400 text-sm">Luminary</p>
          <p className="font-mono text-xs text-ink-300 uppercase tracking-widest">
            Auth Module · React + Vite
          </p>
        </div>
      </footer>
    </main>
  )
}
