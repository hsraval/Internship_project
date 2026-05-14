import LayoutWrapper from '../components/LayoutWrapper'
import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { getProducts, getCategories } from '../api/api'
import toast from 'react-hot-toast'
import OrderForm from '../components/OrderForm'
import WishlistButton from '../components/WishlistButton'

// ─── Product Detail Modal ─────────────────────────────────────────────────────

function ProductModal({ product, onClose, onOrder }) {
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const images = product.images ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#16537e]/20 backdrop-blur-md" />
      <div
        className="relative z-10 w-full max-w-2xl bg-white border border-[#b0d3e6]/50 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[#16537e]/60 text-white hover:bg-[#124470] md:top-4 md:right-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Image Section */}
          <div className="md:w-1/2 bg-[#f4f9fb] flex flex-col min-h-0">
            <div className="relative h-48 sm:h-56 md:h-72 flex items-center justify-center overflow-hidden">
              {images.length > 0 ? (
                <img src={images[imgIdx]?.url ?? images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-[#80b3ba]">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-2 sm:p-3 overflow-x-auto bg-[#f4f9fb]">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-[#16537e]' : 'border-transparent opacity-50'}`}>
                    <img src={img?.url ?? img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Content Section */}
          <div className="md:w-1/2 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 overflow-y-auto flex-1">
            {product.category?.name && (
              <div className="inline-flex items-center">
                <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.15em] bg-[#16537e] text-white rounded-full px-3 sm:px-4 py-1 sm:py-1.5 shadow-sm font-bold">
                  {product.category.name}
                </span>
              </div>
            )}
            <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#1e2a3a] leading-tight">{product.name}</h2>
            <p className="text-[#16537e] text-xl sm:text-2xl font-bold">
              ₹{Number(product.pricePerMeter).toLocaleString()}
            </p>
            {product.description && (
              <p className="text-[#1e2a3a]/80 text-sm leading-relaxed border-t border-[#b0d3e6]/50 pt-3 sm:pt-4 font-sans">
                {product.description}
              </p>
            )}
            <button
              onClick={() => { onOrder(product); onClose() }}
              className="mt-auto py-2.5 sm:py-3 bg-[#16537e] text-white rounded-xl font-sans text-xs sm:text-sm uppercase tracking-widest hover:bg-[#124470] transition-all font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Order
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
    <div className="bg-white border border-[#b0d3e6]/50 rounded-2xl overflow-hidden group hover:border-[#80b3ba] hover:shadow-lg hover:shadow-[#16537e]/10 transition-all duration-300 flex flex-col hover:-translate-y-1">
      <div className="relative h-48 bg-[#f4f9fb] flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <svg className="w-10 h-10 text-[#80b3ba]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        {product.category?.name && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center text-[10px] font-sans uppercase tracking-[0.15em] bg-[#16537e] text-white rounded-full px-3 py-1.5 shadow-sm font-bold">
              {product.category.name}
            </span>
          </div>
        )}
        {/* productType badge */}
        {product.productType === 'fabric' && (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-[9px] font-sans uppercase tracking-widest bg-[#d7e9f2] text-[#16537e] rounded-full px-2 py-1 font-bold">
              Fabric
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-sans font-bold text-[#1e2a3a] text-sm leading-snug line-clamp-2">{product.name}</h3>
          <p className="text-[#16537e] text-base font-bold mt-1">
            ₹{Number(product.pricePerMeter).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => {
              const wishlistBtn = document.querySelector(`[data-product-wishlist="${product._id}"] button`)
              wishlistBtn?.click()
            }}
            className={`px-3 py-2 border text-[10px] font-sans uppercase tracking-wider rounded-xl transition-all flex items-center justify-center font-bold ${
              wishlisted 
                ? 'border-[#16537e] bg-[#16537e] text-white hover:bg-[#124470]' 
                : 'border-[#b0d3e6] text-[#16537e] hover:bg-[#f4f9fb] hover:border-[#16537e]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <div data-product-wishlist={product._id} className="hidden">
            <WishlistButton productId={product._id} />
          </div>
          <button onClick={() => onShowDetails(product)}
            className="flex-1 py-2 text-[10px] font-sans font-bold uppercase tracking-wider border border-[#b0d3e6] text-[#16537e] bg-white rounded-xl hover:border-[#16537e] hover:bg-[#f4f9fb] transition-all">
            Details
          </button>
          <button onClick={() => onOrder(product)}
            className="flex-1 py-2 text-[10px] font-sans font-bold uppercase tracking-wider bg-[#16537e] text-white rounded-xl hover:bg-[#124470] transition-all shadow-sm hover:shadow">
            Order
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('')
  const [productType, setProductType] = useState('')          // ← NEW
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isProductTypeOpen, setIsProductTypeOpen] = useState(false)  // ← NEW
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selected, setSelected]     = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const LIMIT = 8

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data.data ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCategoryOpen && !event.target.closest('.category-dropdown')) {
        setIsCategoryOpen(false)
      }
      if (isProductTypeOpen && !event.target.closest('.product-type-dropdown')) {
        setIsProductTypeOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isCategoryOpen, isProductTypeOpen])

  const fetchProducts = useCallback(() => {
    setLoading(true)
    const params = { page, limit: LIMIT }
    if (search.trim()) params.search = search.trim()
    if (category) params.category = category
    if (productType) params.productType = productType        // ← NEW

    getProducts(params)
      .then(({ data }) => {
        setProducts(data.data ?? data.products ?? data ?? [])
        if (data.pagination?.totalPages) setTotalPages(data.pagination.totalPages)
        else if (data.total) setTotalPages(Math.ceil(data.total / LIMIT))
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [page, search, category, productType])               // ← productType in deps

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleSearch      = (val) => { setSearch(val);      setPage(1) }
  const handleCategory    = (val) => { setCategory(val);    setPage(1) }
  const handleProductType = (val) => { setProductType(val); setPage(1) } // ← NEW

  const handlePageChange = (newPage) => {
    if (newPage === page) return
    setIsTransitioning(true)
    setTimeout(() => {
      setPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setIsTransitioning(false), 150)
    }, 200)
  }

  const handleOrder = (product) => {
    if (!isAuthenticated) { navigate('/login'); return }
    navigate(`/order?product=${product._id}`)
  }

  return (
    <>
      <LayoutWrapper>
        
        <div className="p-4 md:p-8 flex-shrink-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <p className="font-sans text-[10px] uppercase tracking-widest text-[#80b3ba] font-bold mb-1">Collection</p>
              <h1 className="font-sans text-2xl md:text-3xl font-bold text-[#1e2a3a]">Browse Fabrics</h1>
            </div>
          </div>

          {/* Filters — search + category + productType */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">

            {/* Search */}
            <div className="relative flex-1 min-w-0 w-full">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#80b3ba]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search fabrics…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#f4f9fb] border border-[#b0d3e6]/50 rounded-xl text-[#1e2a3a] text-sm placeholder-[#80b3ba] focus:outline-none focus:bg-white focus:border-[#16537e] focus:ring-2 focus:ring-[#16537e]/20 transition-all font-sans font-medium shadow-sm hover:border-[#80b3ba]"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full sm:w-auto">
              <div className="relative category-dropdown">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full px-4 pr-10 py-2.5 bg-[#f4f9fb] border border-[#b0d3e6]/50 rounded-xl text-sm text-[#1e2a3a] focus:outline-none focus:bg-white focus:border-[#16537e] focus:ring-2 focus:ring-[#16537e]/20 transition-all font-sans font-medium appearance-none cursor-pointer text-left flex items-center justify-between shadow-sm hover:border-[#80b3ba]"
                >
                  <span className="truncate">{category ? categories.find(c => c._id === category)?.name || 'All Categories' : 'All Categories'}</span>
                </button>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-[#80b3ba]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                {isCategoryOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-[#b0d3e6]/50 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    <div className="py-1">
                      <button type="button" onClick={() => { handleCategory(''); setIsCategoryOpen(false) }}
                        className={`w-full px-4 py-2 text-sm text-left font-sans hover:bg-[#f4f9fb] transition-colors truncate ${!category ? 'text-[#16537e] font-bold' : 'text-[#1e2a3a]'}`}>
                        All Categories
                      </button>
                      {categories.map((c) => (
                        <button key={c._id} type="button" onClick={() => { handleCategory(c._id); setIsCategoryOpen(false) }}
                          className={`w-full px-4 py-2 text-sm text-left font-sans hover:bg-[#f4f9fb] transition-colors truncate ${category === c._id ? 'text-[#16537e] font-bold' : 'text-[#1e2a3a]'}`}>
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── NEW: Product Type Filter ── */}
            <div className="relative w-full sm:w-auto">
              <div className="relative product-type-dropdown">
                <button
                  type="button"
                  onClick={() => setIsProductTypeOpen(!isProductTypeOpen)}
                  className="w-full px-4 pr-10 py-2.5 bg-[#f4f9fb] border border-[#b0d3e6]/50 rounded-xl text-sm text-[#1e2a3a] focus:outline-none focus:bg-white focus:border-[#16537e] focus:ring-2 focus:ring-[#16537e]/20 transition-all font-sans font-medium appearance-none cursor-pointer text-left flex items-center justify-between shadow-sm hover:border-[#80b3ba]"
                >
                  <span className="truncate">{productType === 'product' ? 'Products' : productType === 'fabric' ? 'Fabrics' : 'All Types'}</span>
                </button>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-[#80b3ba]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                
                {/* Dropdown Options */}
                {isProductTypeOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-[#b0d3e6]/50 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => { handleProductType(''); setIsProductTypeOpen(false) }}
                        className={`w-full px-4 py-2 text-sm text-left font-sans hover:bg-[#f4f9fb] transition-colors truncate ${!productType ? 'text-[#16537e] font-bold' : 'text-[#1e2a3a]'}`}
                      >
                        All Types
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleProductType('product'); setIsProductTypeOpen(false) }}
                        className={`w-full px-4 py-2 text-sm text-left font-sans hover:bg-[#f4f9fb] transition-colors truncate ${productType === 'product' ? 'text-[#16537e] font-bold' : 'text-[#1e2a3a]'}`}
                      >
                        Products
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleProductType('fabric'); setIsProductTypeOpen(false) }}
                        className={`w-full px-4 py-2 text-sm text-left font-sans hover:bg-[#f4f9fb] transition-colors truncate ${productType === 'fabric' ? 'text-[#16537e] font-bold' : 'text-[#1e2a3a]'}`}
                      >
                        Fabrics
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-4 relative">
          
          {isTransitioning && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#d7e9f2] border-t-[#16537e] rounded-full animate-spin" />
            </div>
          )}

          <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-[#d7e9f2] border-t-[#16537e] rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-[#80b3ba]">
                <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 002 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="font-sans text-sm uppercase tracking-widest text-[#80b3ba] font-bold">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} onShowDetails={setSelected} onOrder={handleOrder} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6 mb-4">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  page === 1 ? 'bg-[#f4f9fb] text-[#80b3ba]/50 cursor-not-allowed' : 'bg-[#16537e] text-white hover:bg-[#124470] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95'
                }`}
              >←</button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-xl font-sans font-bold text-sm transition-all duration-300 ${
                      page === i + 1 ? 'bg-[#16537e] text-white shadow-md' : 'bg-[#f4f9fb] text-[#16537e] hover:bg-[#d7e9f2]'
                    }`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  page === totalPages ? 'bg-[#f4f9fb] text-[#80b3ba]/50 cursor-not-allowed' : 'bg-[#16537e] text-white hover:bg-[#124470] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95'
                }`}
              >→</button>
            </div>
          )}
        </div>
      </LayoutWrapper>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} onOrder={handleOrder} />
      )}
    </>
  )
}