
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { getProducts, getFabricProducts } from '../api/api'    // ← added getFabricProducts
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

  /* Hide scrollbar for fabric carousel */
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-[#C5A059]/20 text-[#C5A059] hover:bg-[#C5A059] transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="md:w-3/5 bg-[#F8F9FA]/10 flex flex-col relative group">
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
            {images.length > 0 ? (
              <img src={images[imgIdx]?.url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
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
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-[#C5A059]' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-center bg-[#FFFFFF]">
          {product.category?.name && (
            <span className="inline-block text-[10px] font-mono uppercase tracking-[0.2em] text-[#0F172A] border border-[#0F172A] rounded-full px-3 py-1 w-fit mb-6">
              {product.category.name}
            </span>
          )}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#0F172A] leading-tight">
              {product.name}
            </h2>
            <WishlistButton productId={product._id} className="flex-shrink-0 mt-1" />
          </div>
          <div className="w-12 h-1 bg-[#C5A059]/30 mb-6 rounded-full" />
          <p className="text-[#0F172A] text-3xl font-light mb-8">
            ₹{Number(product.pricePerMeter).toLocaleString()}
          </p>
          {product.description && (
            <div className="prose prose-invert prose-sm">
              <p className="text-[#64748B]/70 leading-relaxed">{product.description}</p>
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
    <div className="group relative bg-gradient-to-br from-white via-[#FAFAFA] to-[#F8F9FA] border border-[#E2E8F0]/20 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_25px_50px_-15px_rgba(197,165,2,0.15)] hover:-translate-y-1 hover:border-[#C5A059]/30">
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-xl">
        {image ? (
          <div className="relative w-full h-full">
            <img src={image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#F1F5F9]/10 via-[#E5E7EB]/5 to-[#F8F9FA]/20">
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
          <button onClick={() => onShowDetails(product)}
            className="px-3 py-2 bg-[#FFFFFF] text-[#0F172A] text-xs font-mono uppercase tracking-widest rounded-lg hover:bg-[#0F172A] hover:text-[#FFFFFF] transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
            View
          </button>
          <button onClick={() => onOrder(product)}
            className="px-3 py-2 border border-[#C5A059] text-[#C5A059] text-xs font-mono uppercase tracking-widest rounded-lg hover:bg-[#C5A059] hover:text-[#FFFFFF] transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-100">
            Order
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 relative bg-gradient-to-b from-white to-[#FAFAFA]/50 border-t border-[#CBD5E1]/20 z-10">
        <div className="mb-auto">
          <h3 className="font-serif font-semibold text-[#0F172A] text-lg leading-tight mb-3 line-clamp-2 group-hover:text-[#C5A059] transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[#C5A059] text-2xl font-semibold">
              ₹{Number(product.pricePerMeter).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-[#CBD5E1]/20 via-[#C5A059]/30 to-transparent group-hover:from-[#C5A059]/60 group-hover:via-[#C5A059]/40 transition-all duration-500" />
      </div>
    </div>
  )
}

// ─── Infinite Carousel Component ───────────────────────────────────────────────────

function InfiniteCarousel({ fabrics, onOrder }) {
  const carouselRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel || fabrics.length === 0) return

    let scrollPosition = 0
    let animationId

    const scroll = () => {
      if (!isPaused) {
        scrollPosition += 1.5 // Increased speed for faster scrolling
        
        // Get total width of one set of items
        const firstItem = carousel.querySelector('.carousel-item')
        if (firstItem) {
          const itemWidth = firstItem.offsetWidth + 20 // Include gap
          const totalWidth = itemWidth * fabrics.length
          
          // Reset position when we've scrolled past one complete set
          if (scrollPosition >= totalWidth) {
            scrollPosition = 0
          }
          
          carousel.style.transform = `translateX(-${scrollPosition}px)`
        }
      }
      
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [fabrics, isPaused])

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        ref={carouselRef}
        className="flex gap-5 transition-none"
        style={{ width: 'max-content' }}
      >
        {/* Render fabrics twice for seamless loop */}
        {[...fabrics, ...fabrics].map((fabric, index) => {
          const image = fabric.images?.[0]?.url
          return (
            <div
              key={`${fabric._id}-${index}`}
              className="carousel-item group flex-shrink-0 w-64 bg-[#FFFFFF] border border-[#CBD5E1]/30 rounded-2xl overflow-hidden hover:border-[#C5A059] hover:shadow-[0_8px_32px_rgba(197,165,2,0.1)] transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt={fabric.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-[#F8F9FA] text-[#CBD5E1]">
                    <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {fabric.category?.name && (
                  <span className="absolute top-3 left-3 text-[9px] font-mono uppercase tracking-[0.2em] bg-gradient-to-r from-[#C5A059] to-[#0F172A] text-white rounded-full px-2.5 py-1">
                    {fabric.category.name}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-serif font-semibold text-[#0F172A] text-sm leading-snug line-clamp-1 mb-1 group-hover:text-[#C5A059] transition-colors">
                  {fabric.name}
                </h3>
                <p className="text-[#C5A059] text-base font-light mb-3">
                  ₹{Number(fabric.pricePerMeter).toLocaleString()}
                </p>
                <button
                  onClick={() => onOrder(fabric)}
                  className="w-full py-2 bg-[#0F172A] text-[#FFFFFF] font-mono text-[10px] uppercase tracking-widest rounded-lg hover:bg-[#C5A059] transition-all duration-300"
                >
                  Order
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
function StatsStrip() {
  const stats = [
    { value: '500+', label: 'Premium Fabrics' },
    { value: '15+', label: 'Years of Legacy' },
    { value: '100%', label: 'Quality Guaranteed' },
    { value: '2,000+', label: 'Happy Clients' },
  ]

  return (
    <div className="py-16 px-6 bg-[#0F172A] border-y border-[#1E293B] relative overflow-hidden">
      {/* Subtle background gradient decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#C5A05908_0%,_transparent_70%)]" />
      
      <div className="relative max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="text-center group">
            <p className="font-serif text-4xl md:text-5xl font-semibold text-[#C5A059] mb-2 group-hover:scale-105 transition-transform duration-300 inline-block">
              {stat.value}
            </p>
            <div className="w-8 h-[1px] bg-[#C5A059]/30 mx-auto mb-3 group-hover:w-12 transition-all duration-300" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#64748B]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Profile Icon Menu Component ──────────────────────────────────────────────
// CHANGED: Replaced "Client Area" text button + dropdown with a profile icon button.
// - When logged in: shows a circle with the user's initials (gold background).
// - When logged out: shows a plain person SVG icon (outlined circle).
// - Clicking either opens the same dropdown options as before.

function UserMenu({ isAuthenticated, navigate, onLogout, user }) {
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
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Derive initials from user's name or email
  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return '?'
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* ── Profile Icon Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Account menu"
        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 ${
          isAuthenticated
            ? 'bg-[#C5A059] text-white hover:bg-[#b08d47] shadow-md shadow-[#C5A059]/30'
            : 'bg-transparent border border-[#CBD5E1] text-[#64748B] hover:border-[#C5A059] hover:text-[#C5A059]'
        } ${isOpen ? 'ring-2 ring-[#C5A059]/40' : ''}`}
      >
        {isAuthenticated ? (
          <span className="font-mono text-xs font-semibold tracking-wider leading-none">
            {getInitials()}
          </span>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}

        {/* Online indicator dot when logged in */}
        {isAuthenticated && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
        )}
      </button>

      {/* ── Dropdown ── */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-56 bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl shadow-2xl overflow-hidden animate-fade-up z-50">
          {isAuthenticated && (
            <div className="px-5 py-3 border-b border-[#E5E5E5] bg-[#F8F9FA]">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]">Signed in as</p>
              <p className="text-sm font-semibold text-[#0F172A] truncate mt-0.5">
                {user?.name || user?.email || 'User'}
              </p>
            </div>
          )}

          {isAuthenticated ? (
            <div className="py-1">
              <button
                onClick={() => { navigate('/dashboard'); setIsOpen(false) }}
                className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm font-mono text-[#333333] hover:bg-[#F2F2F2] transition-colors border-b border-[#E5E5E5]"
              >
                <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm font-mono text-[#EF4444]/80 hover:bg-[#F8F9FA] hover:text-[#EF4444] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          ) : (
            <div className="py-1">
              <button
                onClick={() => { navigate('/login'); setIsOpen(false) }}
                className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm font-mono text-[#333333] hover:bg-[#F2F2F2] transition-colors border-b border-[#E5E5E5]"
              >
                <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </button>
              <button
                onClick={() => { navigate('/register'); setIsOpen(false) }}
                className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm font-mono text-[#333333] hover:bg-[#F8F9FA] hover:text-[#0F172A] transition-colors font-semibold"
              >
                <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
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
  { label: 'fabrics', id: 'fabrics' },
  { label: 'Products', id: 'products' },
]

export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = isAuthenticated && user?.role === 'admin'

  const heroRef     = useRef(null)
  const aboutRef    = useRef(null)
  const productsRef = useRef(null)
  const fabricsRef = useRef(null)
  const sectionRefs = { hero: heroRef, about: aboutRef, products: productsRef ,fabrics: fabricsRef}

  const [products,        setProducts]        = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [fabrics,         setFabrics]         = useState([])   // ← NEW
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [scrolled,        setScrolled]        = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Fetch homepage products
  useEffect(() => {
    getProducts({ limit: 8,productType:"product" })
      .then(({ data }) => setProducts(data.data ?? data.products ?? data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false))
  }, [])

  // ── NEW: Fetch fabric highlights ──
  useEffect(() => {
    getFabricProducts()
      .then(({ data }) => setFabrics(data.data ?? []))
      .catch(() => {})
  }, [])

  const scrollTo = (id) => sectionRefs[id]?.current?.scrollIntoView({ behavior: 'smooth' })

  const handleOrder = (product) => {
    if (!isAuthenticated) {
      navigate('/login')
    } else {
      navigate(`/order?product=${product._id}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#333333] font-sans">

      {/* ── Navbar ── */}
      <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#F8F9FA]/80 backdrop-blur-md shadow-[0_1px_0_rgba(15,23,42,0.05)] border-b border-[#CBD5E1]/20' : 'bg-transparent'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-6">
          <span className="font-serif text-xl font-semibold text-[#0F172A] tracking-tight whitespace-nowrap flex-shrink-0 cursor-pointer" onClick={() => scrollTo('hero')}>
            Larkinse<span className="text-[#C5A059]">MensWear</span>
          </span>
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                className="px-5 py-2 text-xs font-mono uppercase tracking-widest text-[#64748B]/70 hover:text-[#0F172A] transition-colors rounded-lg hover:bg-[#F8F9FA]/50">
                {l.label}
              </button>
            ))}
            {isAuthenticated && !isAdmin && (
              <>
                <button onClick={() => navigate('/wishlist')}
                  className="px-5 py-2 text-xs font-mono uppercase tracking-widest text-[#64748B]/70 hover:text-[#0F172A] transition-colors rounded-lg hover:bg-[#F8F9FA]/50">
                  Wishlist
                </button>
                <button onClick={() => navigate('/orders')}
                  className="px-5 py-2 text-xs font-mono uppercase tracking-widest text-[#64748B]/70 hover:text-[#0F172A] transition-colors rounded-lg hover:bg-[#F8F9FA]/50">
                  My Orders
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* CHANGED: pass `user` prop so UserMenu can show initials */}
            <UserMenu isAuthenticated={isAuthenticated} navigate={navigate} onLogout={logout} user={user} />
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#C5A05911_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#6B5F5008_0%,_transparent_50%)]" />
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#C5A059]/20 to-transparent ml-16 hidden xl:block" />
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#C5A059]/20 to-transparent mr-16 hidden xl:block" />
        <div className="relative text-center max-w-4xl mx-auto pt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#C5A059] mb-6 opacity-80">Est. Since Excellence</p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.02] tracking-tight text-[#0F172A] mb-6">
            Premium
            <span className="block text-[#C5A059] italic font-normal">Tailoring &</span>
            Fabrics
          </h1>
          <p className="text-[#64748B]/70 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Handcrafted menswear using finest fabrics sourced from around world. Every stitch tells a story of tradition and precision.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => scrollTo('products')}
              className="px-8 py-3.5 bg-[#C5A059] text-[#FFFFFF] font-mono text-sm uppercase tracking-widest rounded-lg hover:bg-[#0F172A] transition-all duration-300 font-semibold shadow-lg shadow-[#C5A059]/20">
              Explore Fabrics
            </button>
            <button onClick={() => scrollTo('about')}
              className="px-8 py-3.5 border border-[#CBD5E1] text-[#0F172A] font-mono text-sm uppercase tracking-widest rounded-lg hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300">
              Our Story
            </button>
          </div>
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
              <p>Larkings MensWear stands as a testament to the timeless art of bespoke tailoring. We don't just sell fabric; we provide a canvas for your personal expression.</p>
              <p>Our curated selection ranges from the lush mills of Biella, Italy to the historic weavers of Yorkshire. Each meter is inspected for weight, drape, and character.</p>
              <p>We believe that true luxury lies in the details—the touch of fine wool, the sheen of silk, and the perfect fit that only comes from quality materials.</p>
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
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
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

      {/* ── NEW: Fabric Highlights ── */}
      {fabrics.length > 0 && (
        <section ref={fabricsRef} id="fabrics"  className="py-20 px-6 bg-[#F8F9FA] border-t border-[#CBD5E1]">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#64748B] mb-3">Featured</p>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#0F172A] leading-tight">
                  Premium Fabrics
                </h2>
              </div>
              {isAuthenticated && (
                <button
                  onClick={() => navigate('/products')}
                  className="self-start sm:self-auto text-xs font-mono uppercase tracking-widest text-[#64748B] hover:text-[#C5A059] transition-colors flex items-center gap-2 mb-1"
                >
                  View All
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              )}
            </div>

            {/* Infinite carousel */}
            <InfiniteCarousel fabrics={fabrics} onOrder={handleOrder} />
          </div>
        </section>
      )}
      
        <StatsStrip />

      {/* ── Products ── */}
      <section ref={productsRef} id="products" className="py-28 px-6 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#64748B] mb-4">Curated Fabrics</p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#0F172A] leading-tight">The Collection</h2>
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
                <div key={p._id} className="animate-fade-up opacity-0" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}>
                  <ProductCard product={p} onShowDetails={setSelectedProduct} onOrder={handleOrder} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            {!isAuthenticated && products.length > 0 && (
              <div className="p-8 bg-[#FFFFFF] rounded-2xl border border-[#CBD5E1]/20 inline-block">
                <p className="text-[#64748B] mb-4 font-mono text-xs uppercase tracking-widest">Want to see more?</p>
                <button onClick={() => navigate('/login')}
                  className="px-8 py-3 bg-[#0F172A] text-[#FFFFFF] font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-[#C5A059] hover:text-[#FFFFFF] transition-all duration-300">
                  Sign In to View Catalogue
                </button>
              </div>
            )}
            {isAuthenticated && (
              <button onClick={() => navigate('/products')}
                className="group inline-flex items-center gap-3 px-8 py-4 border border-[#CBD5E1] text-[#333333] font-mono text-xs uppercase tracking-widest rounded-full hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300">
                View Full Catalogue
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      {/* <footer className="py-10 px-6 border-t border-[#CBD5E1] bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="block font-serif text-lg text-[#0F172A] mb-1">Larkings<span className="text-[#C5A059]">MensWear</span></span>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#64748B]">Premium Fabrics & Bespoke Tailoring</p>
          </div>
          <div className="flex gap-6">
            {['Instagram', 'Facebook', 'Twitter'].map(social => (
              <a key={social} href="#" className="text-[10px] font-mono uppercase tracking-widest text-[#64748B] hover:text-[#C5A059] transition-colors">{social}</a>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center border-t border-[#CBD5E1] pt-6">
          <p className="text-[10px] text-[#64748B]/50 font-mono">2024 Larkings MensWear. All rights reserved.</p>
        </div>
      </footer> */}
      
      {/* ── Footer ── */}
      <footer className="bg-[#0F172A] text-[#94A3B8] border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            {/* Column 1: Brand & Description */}
            <div className="md:col-span-1">
              <span className="block font-serif text-xl font-semibold text-[#FFFFFF] tracking-tight mb-4">
                Larkinse<span className="text-[#C5A059]">MensWear</span>
              </span>
              <p className="text-sm leading-relaxed font-light text-[#64748B] mb-6">
                Premium fabrics and bespoke tailoring. Crafting excellence since generations.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C5A059] mb-5">Quick Links</h4>
              <ul className="space-y-3">
                <li><button onClick={() => scrollTo('hero')} className="text-sm hover:text-[#FFFFFF] transition-colors">Home</button></li>
                <li><button onClick={() => scrollTo('about')} className="text-sm hover:text-[#FFFFFF] transition-colors">About Us</button></li>
                <li><button onClick={() => scrollTo('fabrics')} className="text-sm hover:text-[#FFFFFF] transition-colors">Fabrics</button></li>
                <li><button onClick={() => scrollTo('products')} className="text-sm hover:text-[#FFFFFF] transition-colors">Products</button></li>
                {isAuthenticated && (
                  <li><button onClick={() => navigate('/orders')} className="text-sm hover:text-[#FFFFFF] transition-colors">My Orders</button></li>
                )}
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C5A059] mb-5">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <div>
                    <p className="text-xs text-[#64748B] mb-0.5">Phone</p>
                    <a href="tel:+919979508581" className="text-sm text-[#FFFFFF] hover:text-[#C5A059] transition-colors">
                      9979508581
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <div>
                    <p className="text-xs text-[#64748B] mb-0.5">Email</p>
                    <a href="mailto:hello@larkingsmenswear.com" className="text-sm text-[#FFFFFF] hover:text-[#C5A059] transition-colors">
                      kashyapgaliya762@gmail.com
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 4: Visit Us (Address) */}
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C5A059] mb-5">Visit Us</h4>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <div>
                  <p className="text-xs text-[#64748B] mb-1">Store Address</p>
                  <p className="text-sm text-[#FFFFFF] leading-relaxed">
                    Shop No.1, Shivnidhi Appartment,<br />
                    Opp. ICICI Bank, Ghodasar, Ahmedabad
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar / Copyright */}
          <div className="border-t border-[#1E293B] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-[#475569] font-mono">
              © {new Date().getFullYear()} Larkings MensWear. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-[10px] font-mono uppercase tracking-widest text-[#475569] hover:text-[#C5A059] transition-colors">Privacy Policy</a>
              <a href="#" className="text-[10px] font-mono uppercase tracking-widest text-[#475569] hover:text-[#C5A059] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  )
}