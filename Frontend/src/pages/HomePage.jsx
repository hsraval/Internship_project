import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProducts } from '../api/api'

// ─── Product Detail Modal ─────────────────────────────────────────────────────

function ProductModal({ product, onClose }) {
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!product) return null
  const images = product.images?.length ? product.images : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-[#161711]/80 backdrop-blur-md" />

      <div
        className="relative z-10 w-full max-w-2xl bg-[#1e1f17] border border-[#45362C] rounded-2xl overflow-hidden shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[#45362C]/60 text-[#A8977A] hover:bg-[#45362C] transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Images */}
          <div className="md:w-1/2 bg-[#161711] flex flex-col">
            <div className="relative h-64 md:h-full min-h-[240px] flex items-center justify-center overflow-hidden">
              {images.length > 0 ? (
                <img
                  src={images[imgIdx]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-[#45362C]">
                  <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-[#161711]">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === imgIdx ? 'border-[#A8977A]' : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-6 flex flex-col gap-4 overflow-y-auto max-h-[480px]">
            {product.category?.name && (
              <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-[#A8977A] border border-[#45362C] rounded-full px-3 py-1 w-fit">
                {product.category.name}
              </span>
            )}
            <h2 className="font-serif text-2xl font-semibold text-[#e8dcc8] leading-tight">
              {product.name}
            </h2>
            <p className="text-[#A8977A] text-2xl font-light">
              ₹{Number(product.pricePerMeter).toLocaleString()}
              <span className="text-sm font-normal text-[#A8977A]/60 ml-1">/ meter</span>
            </p>
            {product.description && (
              <p className="text-[#9a8f7e] text-sm leading-relaxed border-t border-[#45362C]/40 pt-4">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onShowDetails, onOrder }) {
  const image = product.images?.[0]

  return (
    <div className="bg-[#1a1b14] border border-[#45362C]/50 rounded-xl overflow-hidden group hover:border-[#A8977A]/60 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(168,151,122,0.12)] flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[#161711] flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-[#45362C]">
            <svg className="w-12 h-12 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.category?.name && (
          <span className="absolute top-3 left-3 text-[9px] font-mono uppercase tracking-widest bg-[#161711]/80 text-[#A8977A] border border-[#45362C] rounded-full px-2 py-0.5 backdrop-blur-sm">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-serif font-semibold text-[#e8dcc8] text-base leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[#A8977A] text-lg font-light mt-1">
            ₹{Number(product.pricePerMeter).toLocaleString()}
            <span className="text-xs text-[#A8977A]/60 ml-1">/m</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={() => onShowDetails(product)}
            className="flex-1 py-2 text-xs font-mono uppercase tracking-wider border border-[#45362C] text-[#A8977A] rounded-lg hover:border-[#A8977A] hover:bg-[#45362C]/30 transition-all duration-200"
          >
            Details
          </button>
          <button
            onClick={() => onOrder(product)}
            className="flex-1 py-2 text-xs font-mono uppercase tracking-wider bg-[#45362C] text-[#e8dcc8] rounded-lg hover:bg-[#A8977A] hover:text-[#161711] transition-all duration-200 font-medium"
          >
            Order
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main HomePage ────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home', id: 'hero' },
  { label: 'About Us', id: 'about' },
  { label: 'Products', id: 'products' },
]

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const heroRef    = useRef(null)
  const aboutRef   = useRef(null)
  const productsRef = useRef(null)
  const sectionRefs = { hero: heroRef, about: aboutRef, products: productsRef }

  const [products, setProducts]       = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [scrolled, setScrolled]       = useState(false)

  // Scroll shadow on navbar
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Fetch products for landing
  useEffect(() => {
    getProducts({ limit: 8 })
      .then(({ data }) => setProducts(data.data ?? data.products ?? data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false))
  }, [])

  const scrollTo = (id) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleOrder = (product) => {
    if (!isAuthenticated) {
      navigate('/login')
    } else {
      alert('Coming soon')
    }
  }

  return (
    <div className="min-h-screen bg-[#161711] text-[#e8dcc8] font-sans">

      {/* ── Navbar ── */}
      <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#161711]/95 backdrop-blur-md shadow-[0_1px_0_rgba(168,151,122,0.15)]' : 'bg-transparent'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-6">

          {/* Brand */}
          <span className="font-serif text-lg font-semibold text-[#e8dcc8] tracking-tight whitespace-nowrap flex-shrink-0">
            Larkings<span className="text-[#A8977A]">MensWear</span>
          </span>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="px-4 py-2 text-sm font-mono uppercase tracking-widest text-[#9a8f7e] hover:text-[#A8977A] transition-colors rounded-lg hover:bg-[#45362C]/20"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Right CTAs */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-sm font-mono uppercase tracking-wider bg-[#45362C] text-[#e8dcc8] rounded-lg hover:bg-[#A8977A] hover:text-[#161711] transition-all duration-200"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-mono uppercase tracking-wider text-[#9a8f7e] hover:text-[#A8977A] transition-colors rounded-lg border border-transparent hover:border-[#45362C]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 text-sm font-mono uppercase tracking-wider bg-[#45362C] text-[#e8dcc8] rounded-lg hover:bg-[#A8977A] hover:text-[#161711] transition-all duration-200"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
      >
        {/* Background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#45362C22_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#A8977A0a_0%,_transparent_50%)]" />

        {/* Decorative lines */}
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#45362C]/30 to-transparent ml-16 hidden xl:block" />
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#45362C]/30 to-transparent mr-16 hidden xl:block" />

        <div className="relative text-center max-w-4xl mx-auto pt-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#A8977A] mb-6 opacity-80">
            Est. Since Excellence
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.02] tracking-tight text-[#e8dcc8] mb-6">
            Premium
            <span className="block text-[#A8977A] italic font-normal">Tailoring &</span>
            Fabrics
          </h1>
          <p className="text-[#9a8f7e] text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Handcrafted menswear using the finest fabrics sourced from around the world. Every stitch tells a story of tradition and precision.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('products')}
              className="px-8 py-3.5 bg-[#A8977A] text-[#161711] font-mono text-sm uppercase tracking-widest rounded-lg hover:bg-[#e8dcc8] transition-all duration-200 font-semibold"
            >
              Explore Fabrics
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="px-8 py-3.5 border border-[#45362C] text-[#A8977A] font-mono text-sm uppercase tracking-widest rounded-lg hover:border-[#A8977A] hover:bg-[#45362C]/20 transition-all duration-200"
            >
              Our Story
            </button>
          </div>

          {/* Scroll cue */}
          <div className="mt-20 flex flex-col items-center gap-2 opacity-40">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#A8977A]">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-[#A8977A] to-transparent" />
          </div>
        </div>
      </section>

      {/* ── About Us ── */}
      <section ref={aboutRef} id="about" className="py-28 px-4 bg-[#1a1b14]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#A8977A] mb-4">Our Story</p>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#e8dcc8] mb-6 leading-tight">
                Crafting Excellence<br />
                <span className="text-[#A8977A] italic font-normal">Since Generations</span>
              </h2>
              <div className="space-y-4 text-[#9a8f7e] text-sm leading-relaxed">
                <p>
                  Larkings MensWear has been the cornerstone of bespoke tailoring for discerning gentlemen. We combine age-old techniques with contemporary sensibilities to produce garments that stand the test of time.
                </p>
                <p>
                  Our fabrics are sourced directly from the finest mills in Italy, England, and India — each selected for its weight, drape, and character. Whether you seek a sharp suiting cloth or a relaxed linen, our curated collection has something for every occasion.
                </p>
                <p>
                  Every yard sold from our shop carries our promise: uncompromising quality, honest pricing, and the kind of personal service that only a family-run establishment can provide.
                </p>
              </div>
            </div>

            {/* Reviews */}
            <div className="flex flex-col gap-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#A8977A] mb-2">What Our Clients Say</p>
              {[
                { name: 'Rohan M.', review: 'The fabric quality is unlike anything I\'ve found in the city. My tailor was amazed too — worth every rupee.', stars: 5 },
                { name: 'Arjun S.', review: 'Ordered 6 meters of their premium wool suiting. Arrived perfectly packaged. The color was exactly as shown.', stars: 5 },
                { name: 'Vikram P.', review: 'Knowledgeable staff, honest advice, and a huge variety. Larkings is my go-to for every occasion.', stars: 5 },
              ].map((r) => (
                <div key={r.name} className="bg-[#161711] border border-[#45362C]/50 rounded-xl p-5">
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-[#A8977A]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[#9a8f7e] text-sm leading-relaxed mb-3 italic">"{r.review}"</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#A8977A]">{r.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section ref={productsRef} id="products" className="py-28 px-4 bg-[#161711]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#A8977A] mb-4">Our Collection</p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#e8dcc8] leading-tight">
              Finest Fabrics
            </h2>
            <p className="text-[#9a8f7e] text-sm mt-3 max-w-md mx-auto">
              Select from our premium range of handpicked fabrics, priced per meter.
            </p>
          </div>

          {loadingProducts ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#45362C] border-t-[#A8977A] rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-[#45362C]">
              <p className="font-mono text-sm uppercase tracking-widest">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onShowDetails={setSelectedProduct}
                  onOrder={handleOrder}
                />
              ))}
            </div>
          )}

          {/* View all */}
          {!isAuthenticated && products.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 border border-[#45362C] text-[#A8977A] font-mono text-xs uppercase tracking-widest rounded-lg hover:border-[#A8977A] hover:bg-[#45362C]/20 transition-all"
              >
                Sign in to browse all products
              </button>
            </div>
          )}
          {isAuthenticated && (
            <div className="text-center mt-12">
              <button
                onClick={() => navigate('/products')}
                className="px-8 py-3 border border-[#45362C] text-[#A8977A] font-mono text-xs uppercase tracking-widest rounded-lg hover:border-[#A8977A] hover:bg-[#45362C]/20 transition-all"
              >
                View Full Catalogue →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-4 border-t border-[#45362C]/40 bg-[#1a1b14]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-serif text-base text-[#e8dcc8]">
            Larkings<span className="text-[#A8977A]">MensWear</span>
          </span>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#45362C]">
            Premium Tailoring · Est. Since Excellence
          </p>
        </div>
      </footer>

      {/* ── Product Detail Modal ── */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
