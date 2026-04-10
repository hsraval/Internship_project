import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { getProducts, getFabrics } from '../api'

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
  const [products, setProducts] = useState([])
  const [fabrics, setFabrics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, fabricsRes] = await Promise.all([
          getProducts({ productType: 'product', limit: 6 }),
          getProducts({ productType: 'fabric', limit: 8 })
        ])
        setProducts(productsRes.data.data || [])
        setFabrics(fabricsRes.data.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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

      {/* Products Section */}
      <section id="products-section" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink-900 mb-4">
              Our Products
            </h2>
            <p className="font-body text-ink-500 max-w-2xl mx-auto">
              Discover our premium collection of high-quality products crafted with attention to detail.
            </p>
          </div>
          
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-48 bg-ink-100 rounded-lg mb-4"></div>
                  <div className="h-4 bg-ink-100 rounded mb-2"></div>
                  <div className="h-4 bg-ink-100 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group">
                  {product.images && product.images.length > 0 && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={product.images[0].url} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-display font-semibold text-ink-900 mb-2">{product.name}</h3>
                    <p className="font-body text-ink-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-body font-semibold text-gold-600">
                        ${product.pricePerMeter}/meter
                      </span>
                      {product.category && (
                        <span className="text-xs font-mono text-ink-400 bg-ink-100 px-2 py-1 rounded">
                          {product.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center">
            <button className="btn-primary">
              Browse More Products →
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="border-t border-ink-100" />
      </div>

      {/* Fabrics Section with Carousel */}
      <section id="fabrics-section" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink-900 mb-4">
              Premium Fabrics
            </h2>
            <p className="font-body text-ink-500 max-w-2xl mx-auto">
              Explore our exquisite range of fabrics, perfect for all your creative projects.
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                  <div className="h-32 bg-ink-100 rounded-lg mb-3"></div>
                  <div className="h-3 bg-ink-100 rounded mb-1"></div>
                  <div className="h-3 bg-ink-100 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative mb-8">
              <div className="overflow-hidden">
                <div className="flex gap-4 animate-scroll">
                  {/* Double the fabrics array for seamless loop */}
                  {[...fabrics, ...fabrics].map((fabric, index) => (
                    <div key={`${fabric._id}-${index}`} className="flex-none w-64 lg:w-72">
                      <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group">
                        {fabric.images && fabric.images.length > 0 && (
                          <div className="h-40 overflow-hidden">
                            <img 
                              src={fabric.images[0].url} 
                              alt={fabric.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-display font-semibold text-ink-900 mb-1 text-sm">{fabric.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="font-body font-semibold text-gold-600 text-sm">
                              ${fabric.pricePerMeter}/m
                            </span>
                            {fabric.category && (
                              <span className="text-xs font-mono text-ink-400 bg-ink-100 px-2 py-1 rounded">
                                {fabric.category.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <button className="btn-primary">
              Browse More Fabrics →
            </button>
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
