import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { getProducts } from '../api/api'
import toast from 'react-hot-toast'
import WishlistButton from '../components/WishlistButton'

// ─── Styles for Custom Animations ─────────────────────────────────────────────
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-up {
    animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  
  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }

  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #F8F9FA; }
  ::-webkit-scrollbar-thumb { background: #C5A059; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #0F172A; }
`;
document.head.appendChild(styleSheet);

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
      <div className="absolute inset-0 bg-[#0F172A]/20 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-4xl bg-[#FFFFFF] border border-[#C5A059]/60 rounded-2xl overflow-hidden shadow-2xl animate-fade-up flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-[#C5A059]/20 text-[#C5A059] hover:bg-[#C5A059] transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Images Section */}
        <div className="md:w-3/5 bg-[#F8F9FA]/10 flex flex-col relative group">
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
            {images.length > 0 ? (
              <img
                src={images[imgIdx]?.url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-[#64748B]/40">
                <svg className="w-20 h-20 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#F8F9FA]/10 to-transparent flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === imgIdx ? 'border-[#C5A059]' : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-center bg-[#FFFFFF]">
          {product.category?.name && (
            <span className="inline-block text-[10px] font-mono uppercase tracking-[0.2em] text-[#0F172A] border border-[#0F172A] rounded-full px-3 py-1 w-fit mb-6">
              {product.category.name}
            </span>
          )}
          {/* <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#0F172A] leading-tight mb-2">
            {product.name}
          </h2> */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#0F172A] leading-tight">
              {product.name}
            </h2>
            <WishlistButton productId={product._id} className="flex-shrink-0 mt-1" />
          </div>
          <div className="w-12 h-1 bg-[#C5A059]/30 mb-6 rounded-full" />
          
          <p className="text-[#0F172A] text-3xl font-light mb-8">
            ₹{Number(product.pricePerMeter).toLocaleString()}
            {/* <span className="text-sm font-normal text-[#64748B]/60 ml-2"></span> */}
          </p>
          
          {product.description && (
            <div className="prose prose-invert prose-sm">
              <p className="text-[#64748B]/70 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          <div className="mt-auto pt-8">
            <button 
              className="w-full py-4 bg-[#0F172A] text-[#FFFFFF] font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-[#C5A059] hover:text-[#FFFFFF] transition-all duration-300 shadow-lg shadow-[#0F172A]/20"
              onClick={() => onClose()} 
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onShowDetails, onOrder }) {
  const image = product.images?.[0]?.url
  const { isInWishlist } = useWishlist()
  const wishlisted = isInWishlist(product._id)

  return (
    <div className="group relative bg-gradient-to-br from-white via-[#FAFAFA] to-[#F8F9FA] border border-[#E2E8F]/20 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_25px_50px_-15px_rgba(197,165,2,0.15)] hover:-translate-y-1 hover:border-[#C5A059]/30">
      
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-xl">
        {image ? (
          <div className="relative w-full h-full">
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#F1F5F]/10 via-[#E5E7EB]/5 to-[#F8F9FA]/20">
            <svg className="w-20 h-20 opacity-30" fill="none" stroke="#E5E7EB" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {product.category?.name && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-[0.15em] bg-gradient-to-r from-[#C5A059] to-[#0F172A] text-white rounded-full px-3 py-1.5 shadow-lg shadow-[#C5A059]/25 backdrop-blur-sm">
              {product.category.name}
            </span>
          </div>
        )}

        {/* <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onShowDetails(product)}
            className="px-6 py-2.5 bg-[#FFFFFF] text-[#0F172A] text-xs font-mono uppercase tracking-widest rounded-lg hover:bg-[#0F172A] hover:text-[#FFFFFF] transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
          >
            View
          </button>
          <button
            onClick={() => onOrder(product)}
            className="px-6 py-2.5 border border-[#C5A059] text-[#C5A059] text-xs font-mono uppercase tracking-widest rounded-lg hover:bg-[#C5A059] hover:text-[#FFFFFF] transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-100"
          >
            Order
          </button>
        </div> */}
        <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 px-3">
          <button
            onClick={() => {
              const wishlistBtn = document.querySelector(`[data-wishlist-btn="${product._id}"] button`)
              wishlistBtn?.click()
            }}
            className={`px-3 py-2 border text-xs font-mono uppercase tracking-widest rounded-lg transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-[50ms] flex items-center justify-center ${
              wishlisted 
                ? 'border-[#C5A059] bg-[#C5A059] text-white hover:bg-[#b08d47]' 
                : 'border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#FFFFFF]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <div data-wishlist-btn={product._id} className="hidden">
            <WishlistButton productId={product._id} />
          </div>
          <button
            onClick={() => onShowDetails(product)}
            className="px-3 py-2 bg-[#FFFFFF] text-[#0F172A] text-xs font-mono uppercase tracking-widest rounded-lg hover:bg-[#0F172A] hover:text-[#FFFFFF] transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
          >
            <span className="hidden xs:inline">View</span>
            <span className="xs:hidden">V</span>
          </button>
          <button
            onClick={() => onOrder(product)}
            className="px-3 py-2 border border-[#C5A059] text-[#C5A059] text-xs font-mono uppercase tracking-widest rounded-lg hover:bg-[#C5A059] hover:text-[#FFFFFF] transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-100"
          >
            <span className="hidden xs:inline">Order</span>
            <span className="xs:hidden">O</span>
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 relative bg-gradient-to-b from-white to-[#FAFAFA]/50 border-t border-[#CBD5E1]/20 z-10">
        <div className="mb-auto">
          <h3 className="font-serif font-semibold text-[#0F172A] text-lg leading-tight mb-3 line-clamp-2 group-hover:text-[#C5A059] transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[#C5A059] text-2xl font-semibold">
                ₹{Number(product.pricePerMeter).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-[#CBD5E1]/20 via-[#C5A059]/30 to-transparent group-hover:from-[#C5A059]/60 group-hover:via-[#C5A059]/40 transition-all duration-500" />
      </div>
    </div>
  )
}

// ─── Dropdown Menu Component ───────────────────────────────────────────────────

function UserMenu({ isAuthenticated, navigate, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const handleLogout = async () => {
    try {
      await onLogout()
      toast.success('Signed out successfully')
      setIsOpen(false)
      navigate('/')
    } catch (error) {
      toast.error('Failed to sign out. Please try again.')
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 text-sm font-mono uppercase tracking-widest text-[#64748B]/70 hover:text-[#0F172A] border border-[#CBD5E1] rounded-lg hover:border-[#C5A059] hover:bg-[#F8F9FA] transition-all duration-300"
      >
        <span>Client Area</span>
        <svg 
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl shadow-2xl overflow-hidden animate-fade-up z-50">
          {isAuthenticated ? (
            <div className="py-1">
              <button
                onClick={() => { navigate('/dashboard'); setIsOpen(false) }}
                className="block w-full text-left px-5 py-3 text-sm font-mono text-[#333333] hover:bg-[#F2F2F2] hover:text-[#333333] transition-colors border-b border-[#E5E5E5]"
              >
                Dashboard
              </button>
              {/* <button
                onClick={() => { navigate('/profile'); setIsOpen(false) }}
                className="block w-full text-left px-5 py-3 text-sm font-mono text-[#666666]/70 hover:bg-[#F2F2F2] hover:text-[#666666] transition-colors"
              >
                My Profile
              </button> */}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-5 py-3 text-sm font-mono text-[#EF4444]/80 hover:bg-[#F8F9FA] hover:text-[#EF4444] transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="py-1">
              <button
                onClick={() => { navigate('/login'); setIsOpen(false) }}
                className="block w-full text-left px-5 py-3 text-sm font-mono text-[#333333] hover:bg-[#F2F2F2] hover:text-[#333333] transition-colors border-b border-[#E5E5E5]"
              >
                Sign In
              </button>
              <button
                onClick={() => { navigate('/register'); setIsOpen(false) }}
                className="block w-full text-left px-5 py-3 text-sm font-mono text-[#333333] hover:bg-[#F8F9FA] hover:text-[#0F172A] transition-colors font-semibold"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main HomePage Component ────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home', id: 'hero' },
  { label: 'About Us', id: 'about' },
  { label: 'Products', id: 'products' },
]

export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  // Check if user is admin
  const isAdmin = isAuthenticated && user?.role === 'admin'

  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const productsRef = useRef(null)
  const sectionRefs = { hero: heroRef, about: aboutRef, products: productsRef }

  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [scrolled, setScrolled] = useState(false)

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

  const handleLogout = async () => {
    if (!isAuthenticated) {
      navigate('/login')
    } else {
      try {
        await logout()
        toast.success('Signed out successfully')
        navigate('/')
      } catch (error) {
        toast.error('Failed to sign out. Please try again.')
        console.error('Logout error:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#333333] font-sans">

      {/* ── Navbar ── */}
      <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#F8F9FA]/80 backdrop-blur-md shadow-[0_1px_0_rgba(15,23,42,0.05)] border-b border-[#CBD5E1]/20' : 'bg-transparent'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-6">

          {/* Brand */}
          <span className="font-serif text-xl font-semibold text-[#0F172A] tracking-tight whitespace-nowrap flex-shrink-0 cursor-pointer" onClick={() => scrollTo('hero')}>
            Larkings<span className="text-[#C5A059]">MensWear</span>
          </span>

          {/* Center links */}
          {/* <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="px-5 py-2 text-xs font-mono uppercase tracking-widest text-[#64748B]/70 hover:text-[#0F172A] transition-colors rounded-lg hover:bg-[#F8F9FA]/50"
              >
                {l.label}
              </button>
            ))}
          </div> */}

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="px-5 py-2 text-xs font-mono uppercase tracking-widest text-[#64748B]/70 hover:text-[#0F172A] transition-colors rounded-lg hover:bg-[#F8F9FA]/50"
              >
                {l.label}
              </button>
            ))}
            {isAuthenticated && !isAdmin && (
              <>
                <button
                  onClick={() => navigate('/wishlist')}
                  className="px-5 py-2 text-xs font-mono uppercase tracking-widest text-[#64748B]/70 hover:text-[#0F172A] transition-colors rounded-lg hover:bg-[#F8F9FA]/50"
                >
                  Wishlist
                </button>
                <button
                  onClick={() => navigate('/orders')}
                  className="px-5 py-2 text-xs font-mono uppercase tracking-widest text-[#64748B]/70 hover:text-[#0F172A] transition-colors rounded-lg hover:bg-[#F8F9FA]/50"
                >
                  My Orders
                </button>
              </>
            )}
          </div>

          {/* Right CTAs */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <UserMenu isAuthenticated={isAuthenticated} navigate={navigate} onLogout={logout} />
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20"
      >
        {/* Background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#C5A05911_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#6B5F5008_0%,_transparent_50%)]" />

        {/* Decorative lines */}
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#C5A059]/20 to-transparent ml-16 hidden xl:block" />
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#C5A059]/20 to-transparent mr-16 hidden xl:block" />

        <div className="relative text-center max-w-4xl mx-auto pt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#C5A059] mb-6 opacity-80">
            Est. Since Excellence
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.02] tracking-tight text-[#0F172A] mb-6">
            Premium
            <span className="block text-[#C5A059] italic font-normal">Tailoring &</span>
            Fabrics
          </h1>
          <p className="text-[#64748B]/70 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Handcrafted menswear using finest fabrics sourced from around world. Every stitch tells a story of tradition and precision.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('products')}
              className="px-8 py-3.5 bg-[#C5A059] text-[#FFFFFF] font-mono text-sm uppercase tracking-widest rounded-lg hover:bg-[#0F172A] transition-all duration-300 font-semibold shadow-lg shadow-[#C5A059]/20"
            >
              Explore Fabrics
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="px-8 py-3.5 border border-[#CBD5E1] text-[#0F172A] font-mono text-sm uppercase tracking-widest rounded-lg hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300"
            >
              Our Story
            </button>
          </div>

          {/* Scroll cue */}
          <div className="mt-20 flex flex-col items-center gap-2 opacity-40">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#0F172A]">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-[#0F172A] to-transparent" />
          </div>
        </div>
      </section>

      {/* ── About Us ── */}
      <section ref={aboutRef} id="about" className="py-24 px-6 bg-[#FFFFFF] border-t border-[#CBD5E1] -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#64748B] mb-4">The Story</p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#0F172A] leading-tight">
                Crafting Excellence<br />
                <span className="text-[#C5A059] italic font-normal text-2xl md:text-3xl">Since Generations</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-[#64748B] text-sm leading-relaxed font-light border-l-2 border-[#CBD5E1] pl-6">
              <p>
                Larkings MensWear stands as a testament to the timeless art of bespoke tailoring. We don't just sell fabric; we provide a canvas for your personal expression.
              </p>
              <p>
                Our curated selection ranges from the lush mills of Biella, Italy to the historic weavers of Yorkshire. Each meter is inspected for weight, drape, and character.
              </p>
              <p>
                We believe that true luxury lies in the details—the touch of fine wool, the sheen of silk, and the perfect fit that only comes from quality materials.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#64748B] mb-2">Client Testimonials</p>
            
            {[
              { name: 'Aditya K.', review: 'The texture of the Italian wool is unmatched. Larkings is the only place I trust for my suits.', stars: 5 },
              { name: 'Rahul M.', review: 'Professional, exquisite taste, and fabrics that speak for themselves. Highly recommended.', stars: 5 },
              { name: 'Vikram P.', review: 'From ordering to delivery, the experience was seamless. The linen collection is a must-see.', stars: 5 },
            ].map((r, i) => (
              <div key={i} className="bg-[#F8F9FA] p-6 rounded-xl border border-[#CBD5E1]/20 hover:border-[#C5A059]/30 transition-colors duration-300">
                <div className="flex items-center gap-1 mb-3 text-[#C5A059]">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#64748B] text-sm leading-relaxed mb-4 font-serif italic">"{r.review}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#CBD5E1]/50" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50]">{r.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section ref={productsRef} id="products" className="py-28 px-6 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#64748B] mb-4">Curated Fabrics</p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#0F172A] leading-tight">
                The Collection
              </h2>
            </div>
            <div className="hidden md:block w-32 h-[1px] bg-[#CBD5E1] mb-2" />
          </div>

          {loadingProducts ? (
            <div className="flex items-center justify-center py-32">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-2 border-[#CBD5E1]/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-t-[#C5A059] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32 border border-dashed border-[#CBD5E1]/30 rounded-2xl">
              <p className="font-mono text-sm uppercase tracking-widest text-[#64748B]">Collection coming soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((p, i) => (
                <div 
                  key={p._id} 
                  className="animate-fade-up opacity-0" 
                  style={{animationDelay: `${i * 100}ms`, animationFillMode: 'forwards'}}
                >
                  <ProductCard
                    product={p}
                    onShowDetails={setSelectedProduct}
                    onOrder={handleOrder}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            {!isAuthenticated && products.length > 0 && (
              <div className="p-8 bg-[#FFFFFF] rounded-2xl border border-[#CBD5E1]/20 inline-block">
                <p className="text-[#64748B] mb-4 font-mono text-xs uppercase tracking-widest">Want to see more?</p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 bg-[#0F172A] text-[#FFFFFF] font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-[#C5A059] hover:text-[#FFFFFF] transition-all duration-300"
                >
                  Sign In to View Catalogue
                </button>
              </div>
            )}
            {isAuthenticated && (
              <button
                onClick={() => navigate('/products')}
                className="group inline-flex items-center gap-3 px-8 py-4 border border-[#CBD5E1] text-[#333333] font-mono text-xs uppercase tracking-widest rounded-full hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300"
              >
                View Full Catalogue
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer (Compact) ── */}
      <footer className="py-10 px-6 border-t border-[#CBD5E1] bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="block font-serif text-lg text-[#0F172A] mb-1">
              Larkings<span className="text-[#C5A059]">MensWear</span>
            </span>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#64748B]">
              Premium Fabrics & Bespoke Tailoring
            </p>
          </div>
          
          <div className="flex gap-6">
            {['Instagram', 'Facebook', 'Twitter'].map(social => (
              <a key={social} href="#" className="text-[10px] font-mono uppercase tracking-widest text-[#64748B] hover:text-[#C5A059] transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center border-t border-[#CBD5E1] pt-6">
           <p className="text-[10px] text-[#64748B]/50 font-mono"> 2024 Larkings MensWear. All rights reserved.</p>
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