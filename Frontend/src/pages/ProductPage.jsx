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
      <div className="absolute inset-0 bg-[#161711]/85 backdrop-blur-md" />
      <div
        className="relative z-10 w-full max-w-2xl bg-[#1e1f17] border border-[#45362C] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[#45362C]/60 text-[#A8977A] hover:bg-[#45362C]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-[#161711] flex flex-col">
            <div className="relative h-64 md:h-72 flex items-center justify-center overflow-hidden">
              {images.length > 0 ? (
                <img src={images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-[#45362C] opacity-30">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-[#161711]">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-[#A8977A]' : 'border-transparent opacity-50'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-6 flex flex-col gap-4 overflow-y-auto max-h-[400px]">
            {product.category?.name && (
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A8977A] border border-[#45362C] rounded-full px-3 py-1 w-fit">
                {product.category.name}
              </span>
            )}
            <h2 className="font-serif text-2xl font-semibold text-[#e8dcc8]">{product.name}</h2>
            <p className="text-[#A8977A] text-2xl font-light">
              ₹{Number(product.pricePerMeter).toLocaleString()}
              <span className="text-sm text-[#A8977A]/60 ml-1">/ meter</span>
            </p>
            {product.description && (
              <p className="text-[#9a8f7e] text-sm leading-relaxed border-t border-[#45362C]/40 pt-4">
                {product.description}
              </p>
            )}
            <button
              onClick={() => { onOrder(product); onClose() }}
              className="mt-auto py-2.5 bg-[#45362C] text-[#e8dcc8] rounded-lg font-mono text-xs uppercase tracking-widest hover:bg-[#A8977A] hover:text-[#161711] transition-all"
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
    <div className="bg-[#1a1b14] border border-[#45362C]/50 rounded-xl overflow-hidden group hover:border-[#A8977A]/60 hover:shadow-[0_8px_32px_rgba(168,151,122,0.1)] transition-all duration-300 flex flex-col">
      <div className="relative h-48 bg-[#161711] flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <svg className="w-10 h-10 text-[#45362C] opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        {product.category?.name && (
          <span className="absolute top-2 left-2 text-[9px] font-mono uppercase tracking-widest bg-[#161711]/80 text-[#A8977A] border border-[#45362C] rounded-full px-2 py-0.5 backdrop-blur-sm">
            {product.category.name}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-serif font-semibold text-[#e8dcc8] text-sm leading-snug line-clamp-2">{product.name}</h3>
          <p className="text-[#A8977A] text-base font-light mt-1">
            ₹{Number(product.pricePerMeter).toLocaleString()}
            <span className="text-xs text-[#A8977A]/60 ml-1">/m</span>
          </p>
        </div>
        <div className="flex gap-2 mt-auto">
          <button onClick={() => onShowDetails(product)}
            className="flex-1 py-2 text-[10px] font-mono uppercase tracking-wider border border-[#45362C] text-[#A8977A] rounded-lg hover:border-[#A8977A] hover:bg-[#45362C]/30 transition-all">
            Details
          </button>
          <button onClick={() => onOrder(product)}
            className="flex-1 py-2 text-[10px] font-mono uppercase tracking-wider bg-[#45362C] text-[#e8dcc8] rounded-lg hover:bg-[#A8977A] hover:text-[#161711] transition-all">
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

  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('')
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

  const fetchProducts = useCallback(() => {
    setLoading(true)
    const params = { page, limit: LIMIT }
    if (search.trim()) params.search = search.trim()
    if (category) params.category = category

    getProducts(params)
      .then(({ data }) => {
        setProducts(data.data ?? data.products ?? data ?? [])
        if (data.totalPages) setTotalPages(data.totalPages)
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
    <div className="min-h-screen bg-[#161711] text-[#e8dcc8] flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a1b14] border-r border-[#45362C]/50 flex flex-col z-30">
        <div className="px-6 py-5 border-b border-[#45362C]/40">
          <Link to="/" className="font-serif text-base font-semibold text-[#e8dcc8]">
            Larkings<span className="text-[#A8977A]">MensWear</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <Link to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider text-[#9a8f7e] hover:bg-[#45362C]/40 hover:text-[#A8977A] transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link to="/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider bg-[#45362C] text-[#e8dcc8] transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#A8977A] mb-1">Collection</p>
          <h1 className="font-serif text-3xl font-semibold text-[#e8dcc8]">Browse Fabrics</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#45362C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search fabrics…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#1a1b14] border border-[#45362C]/60 rounded-lg text-[#e8dcc8] text-sm placeholder-[#45362C] focus:outline-none focus:border-[#A8977A] transition-colors font-mono"
            />
          </div>
          <select
            value={category}
            onChange={(e) => handleCategory(e.target.value)}
            className="px-4 py-2.5 bg-[#1a1b14] border border-[#45362C]/60 rounded-lg text-sm text-[#9a8f7e] focus:outline-none focus:border-[#A8977A] transition-colors font-mono min-w-40 appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#45362C] border-t-[#A8977A] rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#45362C]">
            <svg className="w-12 h-12 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
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
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-[#45362C] text-[#9a8f7e] rounded-lg hover:border-[#A8977A] hover:text-[#A8977A] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <span className="font-mono text-xs text-[#A8977A] px-3">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-[#45362C] text-[#9a8f7e] rounded-lg hover:border-[#A8977A] hover:text-[#A8977A] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </main>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} onOrder={handleOrder} />
      )}
    </div>
  )
}
