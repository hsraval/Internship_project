import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProducts, getCategories } from '../api/api'
import toast from 'react-hot-toast'

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
      <div className="absolute inset-0 bg-[#E8E0D0]/20 backdrop-blur-md" />
      <div
        className="relative z-10 w-full max-w-2xl bg-[#E8E0D0] border border-[#6B5F50] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[#6B5F50]/60 text-[#6B5F50] hover:bg-[#6B5F50] md:top-4 md:right-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Mobile: Stack vertically, Desktop: Side by side */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Image Section */}
          <div className="md:w-1/2 bg-[#6B5F50]/10 flex flex-col min-h-0">
            <div className="relative h-48 sm:h-56 md:h-72 flex items-center justify-center overflow-hidden">
              {images.length > 0 ? (
                <img src={images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-[#6B5F50]/40">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-2 sm:p-3 overflow-x-auto bg-[#6B5F50]/10">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-[#6B5F50]' : 'border-transparent opacity-50'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Content Section */}
          <div className="md:w-1/2 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 overflow-y-auto flex-1">
            {product.category?.name && (
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#6B5F50] border border-[#6B5F50] rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 w-fit">
                {product.category.name}
              </span>
            )}
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#6B5F50] leading-tight">{product.name}</h2>
            <p className="text-[#6B5F50] text-xl sm:text-2xl font-light">
              ${Number(product.pricePerMeter).toLocaleString()}
              <span className="text-xs sm:text-sm text-[#6B5F50]/60 ml-1">/ meter</span>
            </p>
            {product.description && (
              <p className="text-[#6B5F50]/70 text-sm leading-relaxed border-t border-[#6B5F50]/40 pt-3 sm:pt-4">
                {product.description}
              </p>
            )}
            <button
              onClick={() => { onOrder(product); onClose() }}
              className="mt-auto py-2.5 sm:py-3 bg-[#6B5F50] text-[#E8E0D0] rounded-lg font-mono text-xs sm:text-sm uppercase tracking-widest hover:bg-[#6B5F50] hover:text-[#E8E0D0] transition-all font-semibold"
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
  const image = product.images?.[0]
  return (
    <div className="bg-[#E8E0D0] border border-[#6B5F50]/50 rounded-xl overflow-hidden group hover:border-[#6B5F50]/60 hover:shadow-[0_8px_32px_rgba(107,95,80,0.1)] transition-all duration-300 flex flex-col">
      <div className="relative h-48 bg-[#6B5F50]/10 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <svg className="w-10 h-10 text-[#6B5F50]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        {product.category?.name && (
          <span className="absolute top-2 left-2 text-[9px] font-mono uppercase tracking-widest bg-[#6B5F50]/20 text-[#6B5F50] border border-[#6B5F50] rounded-full px-2 py-0.5 backdrop-blur-sm">
            {product.category.name}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-serif font-semibold text-[#6B5F50] text-sm leading-snug line-clamp-2">{product.name}</h3>
          <p className="text-[#6B5F50] text-base font-light mt-1">
            ${Number(product.pricePerMeter).toLocaleString()}
            <span className="text-xs text-[#6B5F50]/60 ml-1">/m</span>
          </p>
        </div>
        <div className="flex gap-2 mt-auto">
          <button onClick={() => onShowDetails(product)}
            className="flex-1 py-2 text-[10px] font-mono uppercase tracking-wider border border-[#6B5F50] text-[#6B5F50] rounded-lg hover:border-[#6B5F50] hover:bg-[#6B5F50]/30 transition-all">
            Details
          </button>
          <button onClick={() => onOrder(product)}
            className="flex-1 py-2 text-[10px] font-mono uppercase tracking-wider bg-[#6B5F50] text-[#E8E0D0] rounded-lg hover:bg-[#6B5F50] hover:text-[#E8E0D0] transition-all">
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

  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('')
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selected, setSelected]     = useState(null)
  const LIMIT = 12

  // Load categories once
  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data.data ?? []))
      .catch(() => {})
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCategoryOpen && !event.target.closest('.category-dropdown')) {
        setIsCategoryOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isCategoryOpen])

  const fetchProducts = useCallback(() => {
    setLoading(true)
    const params = { page, limit: LIMIT }
    if (search.trim()) params.search = search.trim()
    if (category) params.category = category

    getProducts(params)
      .then(({ data }) => {
        setProducts(data.data ?? data.products ?? data ?? [])
        if (data.pagination.totalPages) setTotalPages(data.pagination.totalPages)
        else if (data.total) setTotalPages(Math.ceil(data.total / LIMIT))
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [page, search, category])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Reset to page 1 on filter change
  const handleSearch = (val) => { setSearch(val); setPage(1) }
  const handleCategory = (val) => { setCategory(val); setPage(1) }

  const handleOrder = () => {
    if (!isAuthenticated) { navigate('/login'); return }
    alert('Coming soon')
  }

  return (
    <div className="min-h-screen bg-[#E8E0D0] text-[#6B5F50] flex">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#E8E0D0] border-r border-[#6B5F50]/50 flex flex-col 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:inset-auto
      `}>
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
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <Link to="/dashboard"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider text-[#6B5F50]/70 hover:bg-[#6B5F50]/20 hover:text-[#6B5F50] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link to="/products"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider bg-[#6B5F50] text-[#E8E0D0] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </Link>
        </nav>
      </aside>

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
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50]/70 mb-1">Collection</p>
                <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#6B5F50]">Browse Fabrics</h1>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1 min-w-0 w-full">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5F50]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search fabrics…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#E8E0D0] border border-[#6B5F50]/60 rounded-lg text-[#6B5F50] text-sm placeholder-[#6B5F50]/50 focus:outline-none focus:border-[#6B5F50] transition-colors font-mono"
              />
            </div>
            <div className="relative w-full sm:w-auto">
              {/* Custom Dropdown */}
              <div className="relative category-dropdown">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full px-4 pr-10 py-2.5 bg-[#E8E0D0] border border-[#6B5F50]/60 rounded-lg text-sm text-[#6B5F50]/70 focus:outline-none focus:border-[#6B5F50] transition-colors font-mono appearance-none cursor-pointer text-left flex items-center justify-between"
                >
                  <span className="truncate">{category ? categories.find(c => c._id === category)?.name || 'All Categories' : 'All Categories'}</span>
                </button>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-[#6B5F50]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                
                {/* Dropdown Options */}
                {isCategoryOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-[#E8E0D0] border border-[#6B5F50]/60 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => { handleCategory(''); setIsCategoryOpen(false) }}
                        className={`w-full px-4 py-2 text-sm text-left font-mono hover:bg-[#6B5F50]/20 transition-colors truncate ${!category ? 'text-[#6B5F50]' : 'text-[#6B5F50]/70'}`}
                      >
                        All Categories
                      </button>
                      {categories.map((c) => (
                        <button
                          key={c._id}
                          type="button"
                          onClick={() => { handleCategory(c._id); setIsCategoryOpen(false) }}
                          className={`w-full px-4 py-2 text-sm text-left font-mono hover:bg-[#6B5F50]/20 transition-colors truncate ${category === c._id ? 'text-[#6B5F50]' : 'text-[#6B5F50]/70'}`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-4">

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-[#6B5F50] border-t-[#6B5F50] rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#6B5F50]/50">
              <svg className="w-12 h-12 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414-2.414A1 1 0 00-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="font-mono text-sm uppercase tracking-widest">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} onShowDetails={setSelected} onOrder={handleOrder} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 mb-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-[#6B5F50] text-[#6B5F50]/70 rounded-lg hover:border-[#6B5F50] hover:text-[#6B5F50] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="font-mono text-xs text-[#6B5F50] px-3">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-[#6B5F50] text-[#6B5F50]/70 rounded-lg hover:border-[#6B5F50] hover:text-[#6B5F50] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </main>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} onOrder={handleOrder} />
      )}
    </div>
  )
}
