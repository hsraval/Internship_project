import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllProductsAdmin, deleteProduct, restoreProduct, getCategories } from '../api/api'
import ProductForm from './ProductForm'
import toast from 'react-hot-toast'

// ─── Confirm Dialog ───────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm transition-opacity" />
      <div className="relative z-10 bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100" onClick={(e) => e.stopPropagation()}>
        <p className="text-[#333333] font-serif text-base mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-6 py-2.5 text-xs font-mono uppercase tracking-wider border border-[#CBD5E1] text-[#64748B] rounded-lg hover:border-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-all duration-300">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-6 py-2.5 text-xs font-mono uppercase tracking-wider bg-[#EF4444] text-[#FFFFFF] rounded-lg hover:bg-[#DC2626] hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────
function StatusBadge({ deleted }) {
  return deleted ? (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA] rounded-full px-3 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
      Deleted
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] rounded-full px-3 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
      Active
    </span>
  )
}

// ─── Main Component ─────────────────────────────────────────────
export default function AdminProductPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('')
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // Modal & Dialog states
  const [showForm, setShowForm]       = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const LIMIT = 8 // Increased limit slightly for better grid feel

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

    getAllProductsAdmin(params)
      .then(({ data }) => {
        setProducts(data.data ?? data.products ?? data ?? [])
        if (data.pagination?.totalPages) setTotalPages(data.pagination.totalPages)
        else if (data.total) setTotalPages(Math.ceil(data.total / LIMIT))
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [page, search, category])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleSearch = (val) => { setSearch(val); setPage(1) }
  const handleCategory = (val) => { setCategory(val); setPage(1) }

  const handleDelete = async (product) => {
    try {
      await deleteProduct(product._id)
      toast.success(`"${product.name}" deleted`)
      fetchProducts()
    } catch (err) {
      toast.error(err.userMessage || 'Delete failed')
    }
    setConfirm(null)
  }

  const handleRestore = async (product) => {
    try {
      await restoreProduct(product._id)
      toast.success(`"${product.name}" restored`)
      fetchProducts()
    } catch (err) {
      toast.error(err.userMessage || 'Restore failed')
    }
    setConfirm(null)
  }

  const openCreate = () => { setEditProduct(null); setShowForm(true); setIsSidebarOpen(false) }
  const openEdit   = (p)  => { setEditProduct(p);    setShowForm(true); setIsSidebarOpen(false) }
  const closeForm  = ()   => { setShowForm(false); setEditProduct(null) }
  const onSaved    = ()   => { closeForm(); fetchProducts() }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#334155] flex font-sans selection:bg-[#C5A059] selection:text-white">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 lg:w-72 bg-[#FFFFFF] border-r border-[#E2E8F0] flex flex-col shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto lg:shadow-none
      `}>
        <div className="px-6 sm:px-8 py-4 sm:py-6 border-b border-[#E2E8F0] flex justify-between items-center bg-white">
          <Link to="/" className="font-serif text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
            Larkings<span className="text-[#C5A059]">.</span>
          </Link>
          <button 
            className="lg:hidden p-2 text-[#64748B] hover:text-[#0F172A] transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 flex flex-col gap-1 sm:gap-2">
          <Link to="/dashboard"
            onClick={() => setIsSidebarOpen(false)}
            className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#94A3B8] group-hover:text-[#C5A059] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 011-1h2a1 1 0 011-1v-4a1 1 0 001-1h3m-6 0a1 1 0 001-1v-4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link to="/admin/products"
            onClick={() => setIsSidebarOpen(false)}
            className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm font-medium bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#F8FAFC]">
        
        {/* Header */}
        <header className="bg-white border-b border-[#E2E8F0] px-4 sm:px-6 py-3 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 text-[#64748B] bg-[#F1F5F9] rounded-lg hover:bg-[#E2E8F0] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-[#0F172A] font-serif">Manage Products</h1>
              <p className="text-xs text-[#64748B] font-mono mt-0.5 uppercase tracking-wider">Admin Inventory</p>
            </div>
          </div>

          <button
            onClick={openCreate}
            className="group relative inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full bg-[#0F172A] text-white shadow-lg transition-all hover:bg-[#C5A059] hover:shadow-[#C5A059]/40 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:ring-offset-2"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 relative transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {/* Tooltip on hover */}
            <span className="absolute right-full mr-2 sm:mr-3 px-2 py-1 text-xs text-white bg-[#0F172A] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Add Product
            </span>
          </button>
        </header>

        {/* Controls & Filter Bar */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-start bg-[#F8FAFC]">
          <div className="md:col-span-8 relative group">
            <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[#94A3B8] group-focus-within:text-[#C5A059] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name, SKU or category..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-[#E2E8F0] rounded-xl leading-5 bg-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] sm:text-sm transition-all shadow-sm"
            />
          </div>

          <div className="md:col-span-4 relative category-dropdown">
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="relative w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 sm:py-3 text-left bg-white border border-[#E2E8F0] rounded-xl shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] sm:text-sm transition-all hover:border-[#CBD5E1]"
            >
              <span className="block truncate text-[#334155]">
                {category ? categories.find(c => c._id === category)?.name || 'All Categories' : 'All Categories'}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
                <svg className="h-4 w-4 text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {isCategoryOpen && (
              <div className="absolute z-10 mt-2 w-full rounded-xl bg-white shadow-xl border border-[#E2E8F0] max-h-60 overflow-auto">
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => { handleCategory(''); setIsCategoryOpen(false) }}
                    className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-[#334155] hover:bg-[#F8FAFC] hover:text-[#C5A059] transition-colors"
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => { handleCategory(c._id); setIsCategoryOpen(false) }}
                      className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-sm transition-colors ${category === c._id ? 'bg-[#C5A059]/10 text-[#C5A059] font-medium' : 'text-[#334155] hover:bg-[#F8FAFC]'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid/Table */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6 scroll-smooth">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 sm:py-24">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-[#E2E8F0] border-t-[#C5A059] rounded-full animate-spin" />
              <p className="mt-3 sm:mt-4 text-sm text-[#64748B] font-mono animate-pulse">Loading inventory...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 sm:py-24 bg-white rounded-2xl border border-dashed border-[#E2E8F0]">
              <div className="p-3 sm:p-4 bg-[#F1F5F9] rounded-full mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <p className="font-medium text-[#64748B] text-sm sm:text-base">No products found</p>
              <p className="text-xs text-[#94A3B8] mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] hidden lg:table-header-group">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-mono font-semibold text-[#64748B] uppercase tracking-wider">Product Details</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-mono font-semibold text-[#64748B] uppercase tracking-wider">Category</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-mono font-semibold text-[#64748B] uppercase tracking-wider">Price / Meter</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-mono font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-mono font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {products.map((p) => (
                      <tr key={p._id} className="group hover:bg-[#F8FAFC] transition-colors">
                        
                        {/* Mobile Stacked Layout */}
                        <td className="p-3 sm:p-4 lg:table-cell block lg:py-5 lg:px-6 align-top">
                          <div className="flex gap-3 sm:gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] overflow-hidden">
                                {p.images?.[0] ? (
                                  <img src={p.images[0]?.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#CBD5E1]">
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h3 className="text-sm sm:text-base font-bold text-[#0F172A] font-serif truncate pr-2">{p.name}</h3>
                                {/* Mobile Status */}
                                <div className="lg:hidden">
                                  <StatusBadge deleted={p.isDeleted || p.deletedAt} />
                                </div>
                              </div>
                              
                              {/* Mobile Details Stack */}
                              <div className="mt-3 space-y-2 lg:hidden">
                                <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-2">
                                  <span className="text-[9px] sm:text-[10px] uppercase text-[#94A3B8] font-mono tracking-wider">Category</span>
                                  <span className="text-xs font-medium text-[#475569]">{p.category?.name ?? '—'}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-2">
                                  <span className="text-[9px] sm:text-[10px] uppercase text-[#94A3B8] font-mono tracking-wider">Price</span>
                                  <span className="text-sm font-mono text-[#0F172A]">₹{Number(p.pricePerMeter).toLocaleString()}</span>
                                </div>
                              </div>
                              
                              {p.description && (
                                <p className="hidden lg:block mt-1 text-xs text-[#64748B] line-clamp-2 max-w-md">{p.description}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Desktop Columns */}
                        <td className="hidden lg:table-cell px-4 sm:px-6 py-3 sm:py-5 align-middle">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#F1F5F9] text-[#475569]">
                            {p.category?.name ?? '—'}
                          </span>
                        </td>

                        <td className="hidden lg:table-cell px-4 sm:px-6 py-3 sm:py-5 align-middle">
                          <span className="text-sm font-mono text-[#0F172A]">₹{Number(p.pricePerMeter).toLocaleString()}</span>
                        </td>

                        <td className="hidden lg:table-cell px-4 sm:px-6 py-3 sm:py-5 align-middle">
                          <StatusBadge deleted={p.isDeleted || p.deletedAt} />
                        </td>

                        {/* Actions - Stacked on Mobile, Right on Desktop */}
                        <td className="p-3 sm:p-4 lg:table-cell lg:py-5 lg:px-6 align-middle text-right">
                          <div className="flex items-center gap-2 sm:gap-3 lg:justify-end justify-start mt-3 lg:mt-0">
                            
                            {/* Edit Button - Icon Only */}
                            <button
                              onClick={() => openEdit(p)}
                              disabled={p.isDeleted || p.deletedAt}
                              title="Edit Product"
                              className={`group relative p-2 sm:p-2.5 rounded-lg transition-all duration-300
                                ${!(p.isDeleted || p.deletedAt) 
                                  ? 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#C5A059] hover:text-white hover:shadow-lg hover:shadow-[#C5A059]/30 hover:-translate-y-0.5' 
                                  : 'opacity-50 cursor-not-allowed bg-[#F1F5F9] text-[#94A3B8]'}
                              `}
                            >
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>

                            {/* Delete/Restore Button - Icon Only */}
                            {p.isDeleted || p.deletedAt ? (
                              <button
                                onClick={() => setConfirm({ type: 'restore', product: p })}
                                title="Restore Product"
                                className="group relative p-2 sm:p-2.5 rounded-lg bg-[#ECFDF5] text-[#059669] hover:bg-[#059669] hover:text-white hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-300"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => setConfirm({ type: 'delete', product: p })}
                                title="Delete Product"
                                className="group relative p-2 sm:p-2.5 rounded-lg bg-[#FEF2F2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-300"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 sm:mt-8 pb-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#C5A059] hover:text-[#C5A059] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm font-medium transition-all ${
                      page === i + 1
                        ? 'bg-[#0F172A] text-white shadow-md'
                        : 'bg-white text-[#64748B] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#C5A059] hover:text-[#C5A059] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showForm && (
        <ProductForm
          product={editProduct}
          categories={categories}
          onClose={closeForm}
          onSaved={onSaved}
        />
      )}
      {confirm && (
        <ConfirmDialog
          message={
            confirm.type === 'delete'
              ? `Are you sure you want to delete "${confirm.product.name}"?`
              : `Restore "${confirm.product.name}" to active inventory?`
          }
          onConfirm={() =>
            confirm.type === 'delete'
              ? handleDelete(confirm.product)
              : handleRestore(confirm.product)
          }
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}


// import { useEffect, useState, useCallback } from 'react'

// import { Link, useNavigate } from 'react-router-dom'

// import { useAuth } from '../context/AuthContext'

// import { getAllProductsAdmin, deleteProduct, restoreProduct, getCategories } from '../api/api'

// import ProductForm from './ProductForm'

// import toast from 'react-hot-toast'



// // ─── Confirm Dialog ───────────────────────────────────────────



// function ConfirmDialog({ message, onConfirm, onCancel }) {

//   return (

//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>

//       <div className="absolute inset-0 bg-[#0F172A]/20 backdrop-blur-sm" />

//       <div className="relative z-10 bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>

//         <p className="text-[#333333] font-serif text-base mb-5">{message}</p>

//         <div className="flex gap-3 justify-end">

//           <button onClick={onCancel} className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-[#CBD5E1] text-[#64748B]/70 rounded-lg hover:border-[#0F172A] hover:bg-[#F8F9FA]/20 hover:text-[#333333] transition-all">

//             Cancel

//           </button>

//           <button onClick={onConfirm} className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#EF4444]/80 text-[#FFFFFF] rounded-lg hover:bg-[#EF4444] transition-all">

//             Confirm

//           </button>

//         </div>

//       </div>

//     </div>

//   )

// }



// // ─── Status Badge ─────────────────────────────────────────────



// function StatusBadge({ deleted }) {

//   return deleted ? (

//     <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 rounded-full px-2.5 py-0.5">

//       <span className="w-1 h-1 rounded-full bg-[#EF4444]" />

//       Deleted

//     </span>

//   ) : (

//     <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 rounded-full px-2.5 py-0.5">

//       <span className="w-1 h-1 rounded-full bg-[#10B981]" />

//       Active

//     </span>

//   )

// }



// // ─── Main ─────────────────────────────────────────────────────



// export default function AdminProductPage() {

//   const { user } = useAuth()

//   const navigate = useNavigate()



//   // Redirect non-admins

//   useEffect(() => {

//     if (user && user.role !== 'admin') navigate('/dashboard', { replace: true })

//   }, [user, navigate])



//   // Mobile Sidebar State

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)



//   const [products, setProducts]     = useState([])

//   const [categories, setCategories] = useState([])

//   const [loading, setLoading]       = useState(true)

//   const [search, setSearch]         = useState('')

//   const [category, setCategory]     = useState('')

//   const [isCategoryOpen, setIsCategoryOpen] = useState(false)

//   const [page, setPage]             = useState(1)

//   const [totalPages, setTotalPages] = useState(1)



//   // Form modal state

//   const [showForm, setShowForm]       = useState(false)

//   const [editProduct, setEditProduct] = useState(null)



//   // Confirm dialog state

//   const [confirm, setConfirm] = useState(null) // { type: 'delete'|'restore', product }



//   const LIMIT = 5



//   useEffect(() => {

//     getCategories()

//       .then(({ data }) => setCategories(data.data ?? []))

//       .catch(() => {})

//   }, [])



//   // Close dropdown when clicking outside

//   useEffect(() => {

//     const handleClickOutside = (event) => {

//       if (isCategoryOpen && !event.target.closest('.category-dropdown')) {

//         setIsCategoryOpen(false)

//       }

//     }



//     document.addEventListener('mousedown', handleClickOutside)

//     return () => document.removeEventListener('mousedown', handleClickOutside)

//   }, [isCategoryOpen])



//   const fetchProducts = useCallback(() => {

//     setLoading(true)

//     const params = { page, limit: LIMIT }

//     if (search.trim()) params.search = search.trim()

//     if (category) params.category = category



//     getAllProductsAdmin(params)

//       .then(({ data }) => {

//         setProducts(data.data ?? data.products ?? data ?? [])

//         if (data.pagination.totalPages) setTotalPages(data.pagination.totalPages)

//         else if (data.total) setTotalPages(Math.ceil(data.total / LIMIT))

//       })

//       .catch(() => toast.error('Failed to load products'))

//       .finally(() => setLoading(false))

//   }, [page, search, category])



//   useEffect(() => { fetchProducts() }, [fetchProducts])



//   const handleSearch = (val) => { setSearch(val); setPage(1) }

//   const handleCategory = (val) => { setCategory(val); setPage(1) }



//   const handleDelete = async (product) => {

//     try {

//       await deleteProduct(product._id)

//       toast.success(`"${product.name}" deleted`)

//       fetchProducts()

//     } catch (err) {

//       toast.error(err.userMessage || 'Delete failed')

//     }

//     setConfirm(null)

//   }



//   const handleRestore = async (product) => {

//     try {

//       await restoreProduct(product._id)

//       toast.success(`"${product.name}" restored`)

//       fetchProducts()

//     } catch (err) {

//       toast.error(err.userMessage || 'Restore failed')

//     }

//     setConfirm(null)

//   }



//   const openCreate = () => { setEditProduct(null); setShowForm(true); setIsSidebarOpen(false) }

//   const openEdit   = (p)  => { setEditProduct(p);    setShowForm(true); setIsSidebarOpen(false) }

//   const closeForm  = ()   => { setShowForm(false); setEditProduct(null) }

//   const onSaved    = ()   => { closeForm(); fetchProducts() }



//   return (

//     <div className="min-h-screen bg-[#F8F9FA] text-[#333333] flex">

      

//       {/* Mobile Overlay */}

//       {isSidebarOpen && (

//         <div 

//           className="fixed inset-0 bg-black/60 z-40 md:hidden"

//           onClick={() => setIsSidebarOpen(false)}

//         />

//       )}



//       {/* Sidebar */}

//       <aside className={`

//         fixed inset-y-0 left-0 z-50 w-64 bg-[#FFFFFF] border-r border-[#CBD5E1] flex flex-col 

//         transform transition-transform duration-300 ease-in-out

//         ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}

//         md:translate-x-0 md:static md:inset-auto 

//       `}>

//         <div className="px-6 py-5 border-b border-[#CBD5E1] flex justify-between items-center">

//           <Link to="/" className="font-serif text-base font-semibold text-[#333333]">

//             Larkings<span className="text-[#C5A059]">MensWear</span>

//           </Link>

//           <button 

//             className="md:hidden text-[#64748B]/70"

//             onClick={() => setIsSidebarOpen(false)}

//           >

//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>

//           </button>

//         </div>

//         <nav className="flex-1 px-3 py-4 flex flex-col gap-1">

//           <Link to="/dashboard"

//             onClick={() => setIsSidebarOpen(false)}

//             className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider text-[#64748B]/70 hover:bg-[#F8F9FA]/20 hover:text-[#333333] transition-all"

//           >

//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 011-1h2a1 1 0 001-1v-4a1 1 0 001-1h3m-6 0a1 1 0 001-1v-4a1 1 0 001 1m-6 0h6" />

//             </svg>

//             Dashboard

//           </Link>

//           <Link to="/admin/products"

//             onClick={() => setIsSidebarOpen(false)}

//             className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider bg-[#C5A059] text-[#FFFFFF] transition-all"

//           >

//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />

//             </svg>

//             Manage Products

//           </Link>

//         </nav>

//       </aside>



//       {/* Main Content Wrapper */}

//       <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        

//         {/* Scrollable Header Area */}

//         <div className="p-4 md:p-8 flex-shrink-0">

//           {/* Header */}

//           <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">

//             <div className="flex items-center gap-3">

//               <button 

//                 onClick={() => setIsSidebarOpen(true)}

//                 className="md:hidden p-1 text-[#64748B] border border-[#CBD5E1] rounded"

//               >

//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>

//               </button>

              

//               <div>

//                 <p className="font-mono text-[10px] uppercase tracking-widest text-[#64748B]/70 mb-1">Admin</p>

//                 <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#333333]">Manage Products</h1>

//               </div>

//             </div>



//             <button

//               onClick={openCreate}

//               className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C5A059] text-[#FFFFFF] rounded-lg font-mono text-xs uppercase tracking-wider hover:bg-[#0F172A] transition-all font-semibold w-full md:w-auto"

//             >

//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">

//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />

//               </svg>,

//               Add Product

//             </button>,

//           </div>



//           {/* Filters */}

//           {/* Added mb-12 to create space for mobile dropdowns */}

//           <div className="flex flex-col sm:flex-row gap-3 mb-12 relative z-20">

//             <div className="relative flex-1 min-w-0 w-full">

//               <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">

//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />

//               </svg>

//               <input

//                 type="text"

//                 placeholder="Search products…"

//                 value={search}

//                 onChange={(e) => handleSearch(e.target.value)}

//                 className="w-full pl-9 pr-4 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg text-[#333333] text-sm placeholder-[#94A3B8] focus:outline-none focus:border-[#C5A059] transition-colors font-mono"

//               />

//             </div>

//             <div className="relative w-full sm:w-auto">

//               <div className="relative category-dropdown">

//                 <button

//                   type="button"

//                   onClick={() => setIsCategoryOpen(!isCategoryOpen)}

//                   className="w-full px-4 pr-10 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg text-sm text-[#64748B]/70 focus:outline-none focus:border-[#C5A059] transition-colors font-mono appearance-none cursor-pointer text-left flex items-center justify-between"

//                 >

//                   <span className="truncate">{category ? categories.find(c => c._id === category)?.name || 'All Categories' : 'All Categories'}</span>

//                 </button>

//                 <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">

//                   <svg className="w-4 h-4 text-[#64748B]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>

//                 </div>

                

//                 {/* Dropdown Options */}

//                 {isCategoryOpen && (

//                   <div className="absolute z-50 w-full mt-1 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg shadow-lg max-h-60 overflow-y-auto">

//                     <div className="py-1">

//                       <button

//                         type="button"

//                         onClick={() => { handleCategory(''); setIsCategoryOpen(false) }}

//                         className={`w-full px-4 py-2 text-sm text-left font-mono hover:bg-[#F8F9FA]/20 transition-colors truncate ${!category ? 'text-[#333333]' : 'text-[#64748B]/70'}`}

//                       >

//                         All Categories

//                       </button>

//                       {categories.map((c) => (

//                         <button

//                           key={c._id}

//                           type="button"

//                           onClick={() => { handleCategory(c._id); setIsCategoryOpen(false) }}

//                           className={`w-full px-4 py-2 text-sm text-left font-mono hover:bg-[#F8F9FA]/20 transition-colors truncate ${category === c._id ? 'text-[#333333]' : 'text-[#64748B]/70'}`}

//                         >

//                           {c.name}

//                         </button>

//                       ))}

//                     </div>

//                   </div>

//                 )}

//               </div>

//             </div>

//           </div>

//         </div>



//         {/* Scrollable Table Area */}

//         <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-4">

//           {loading ? (

//             <div className="flex items-center justify-center py-24">

//               <div className="w-8 h-8 border-2 border-[#CBD5E1] border-t-[#CBD5E1] rounded-full animate-spin" />

//             </div>

//           ) : products.length === 0 ? (

//             <div className="flex flex-col items-center justify-center py-24 text-[#64748B]/50">

//               <p className="font-mono text-sm uppercase tracking-widest">No products found</p>

//             </div>

//           ) : (

//             <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl overflow-hidden">

//               <div className="overflow-x-auto">

//                 <table className="w-full text-sm min-w-[600px]">

//                   <thead className="bg-[#F8F9FA]/10 sticky top-0 z-10">

//                     <tr className="border-b border-[#CBD5E1]/50">

//                       <th className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-[#333333]">Product</th>

//                       <th className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-[#333333]">Category</th>

//                       <th className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-[#333333]">Price / m</th>

//                       <th className="text-right px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-[#333333]">Actions</th>

//                     </tr>

//                   </thead>

//                   <tbody>

//                     {products.map((p, i) => (

//                       <tr key={p._id} className={`border-b border-[#CBD5E1]/30 hover:bg-[#F8F9FA]/10 transition-colors ${i === products.length - 1 ? 'border-0' : ''}`}>

//                         {/* Mobile Layout: Stacked vertically */}

//                         <td className="md:table-cell p-4 border-b border-[#CBD5E1]/20 md:border-0 block">

//                           <div className="flex items-start gap-3">

//                             <div className="w-16 h-16 rounded-lg bg-[#F8F9FA]/10 overflow-hidden flex-shrink-0 flex items-center justify-center">

//                               {p.images?.[0] ? (

//                                 <img src={p.images[0]?.url} alt={p.name} className="w-full h-full object-cover" />

//                               ) : (

//                                 <svg className="w-6 h-6 text-[#64748B]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">

//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />

//                                 </svg>

//                               )}

//                             </div>

//                             <div className="flex-1">

//                               <p className="font-serif font-medium text-[#333333] text-base mb-1">{p.name}</p>

//                               {p.description && (

//                                 <p className="text-[#64748B]/70 text-xs line-clamp-2">{p.description}</p>

//                               )}

                              

//                               {/* Extra details for mobile only */}

//                               <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 md:hidden text-xs">

//                                 <div>

//                                   <span className="text-[#64748B]/50 uppercase tracking-wider font-mono block text-[9px]">Category</span>

//                                   <span className="text-[#64748B]/70">{p.category?.name ?? '—'}</span>

//                                 </div>

//                                 <div>

//                                   <span className="text-[#64748B]/50 uppercase tracking-wider font-mono block text-[9px]">Price</span>

//                                   <span className="text-[#333333] font-mono">₹{Number(p.pricePerMeter).toLocaleString()}</span>

//                                 </div>

//                                 <div>

//                                   <span className="text-[#64748B]/50 uppercase tracking-wider font-mono block text-[9px]">Status</span>

//                                   <div className="mt-1">

//                                     <StatusBadge deleted={p.isDeleted || p.deletedAt} />

//                                   </div>

//                                 </div>

//                               </div>

//                             </div>

//                           </div>

//                         </td>



//                         {/* Desktop Layout: Standard columns */}

//                         {/* Category Cell (Hidden on Mobile) */}

//                         <td className="hidden md:table-cell px-4 py-3 text-[#64748B]/70 text-xs font-mono">

//                           {p.category?.name ?? '—'}

//                         </td>



//                         {/* Price Cell (Hidden on Mobile) */}

//                         <td className="hidden md:table-cell px-4 py-3 text-[#333333] font-mono text-sm">

//                           ₹{Number(p.pricePerMeter).toLocaleString()}

//                         </td>



//                         {/* Status Cell (Hidden on Mobile) */}

//                         <td className="hidden md:table-cell px-4 py-3">

//                           <StatusBadge deleted={p.isDeleted || p.deletedAt} />

//                         </td>



//                         {/* Actions: Full width on mobile, right aligned on desktop */}

//                         <td className="px-4 py-3 block md:table-cell text-left md:text-right">

//                           <div className="flex flex-row md:flex-row-reverse items-center justify-start md:justify-end gap-2 w-full md:w-auto pt-2 md:pt-0 border-t border-[#CBD5E1]/20 md:border-0 mt-2 md:mt-0">

                            

//                             {/* Edit */}

//                             {!(p.isDeleted || p.deletedAt) && (

//                               <button

//                                 onClick={() => openEdit(p)}

//                                 className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 text-[10px] font-mono uppercase tracking-wider border border-[#CBD5E1] text-[#64748B]/70 rounded-lg hover:border-[#0F172A] hover:text-[#333333] transition-all min-w-[80px]"

//                               >

//                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">

//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11A2 2 0 002-2v-5m-1.414-9.414A2 2 0 112.828 2.828L11.828 15H9v-2.828L8.586-8.586z" />

//                                 </svg>

//                                 Edit

//                               </button>

//                             )}



//                             {/* Delete / Restore */}

//                             {p.isDeleted || p.deletedAt ? (

//                               <button

//                                 onClick={() => setConfirm({ type: 'restore', product: p })}

//                                 className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 text-[10px] font-mono uppercase tracking-wider bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 rounded-lg hover:bg-[#10B981]/30 transition-all min-w-[80px]"

//                               >

//                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">

//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />

//                                 </svg>

//                                 Restore

//                               </button>

//                             ) : (

//                               <button

//                                 onClick={() => setConfirm({ type: 'delete', product: p })}

//                                 className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 text-[10px] font-mono uppercase tracking-wider bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 rounded-lg hover:bg-[#EF4444]/30 transition-all min-w-[80px]"

//                               >

//                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">

//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />

//                                 </svg>

//                                 Delete

//                               </button>

//                             )}

//                           </div>

//                         </td>

//                       </tr>

//                     ))}

//                   </tbody>

//                 </table>

//               </div>

//             </div>

//           )}



//           {/* Clean Modern Pagination */}

//           {totalPages > 1 && (

//             <div className="flex items-center justify-center gap-1 mt-6 mb-4">

//               {/* Previous Button */}

//               <button

//                 onClick={() => setPage((p) => Math.max(1, p - 1))}

//                 disabled={page === 1}

//                 className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-200 ${

//                   page === 1 

//                     ? 'bg-[#F8F9FA] text-[#CBD5E1]/30 cursor-not-allowed' 

//                     : 'bg-[#C5A059] text-white hover:bg-[#0F172A] active:scale-95'

//                 }`}

//               >

//                 ←

//               </button>



//               {/* Page Numbers */}

//               <div className="flex items-center gap-1">

//                 {Array.from({ length: totalPages }, (_, i) => (

//                   <button

//                     key={i}

//                     onClick={() => setPage(i + 1)}

//                     className={`w-10 h-10 rounded-lg font-mono text-sm transition-all duration-200 ${

//                       page === i + 1

//                         ? 'bg-[#0F172A] text-white font-semibold'

//                         : 'bg-[#FFFFFF] text-[#64748B] hover:bg-[#C5A059] hover:text-white'

//                     }`}

//                   >

//                     {i + 1}

//                   </button>

//                 ))}

//               </div>



//               {/* Next Button */}

//               <button

//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}

//                 disabled={page === totalPages}

//                 className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-200 ${

//                   page === totalPages 

//                     ? 'bg-[#F8F9FA] text-[#CBD5E1]/30 cursor-not-allowed' 

//                     : 'bg-[#C5A059] text-white hover:bg-[#0F172A] active:scale-95'

//                 }`}

//               >

//                 →

//               </button>

//             </div>

//           )}

//         </div>

//       </main>



//       {/* Product Form Modal */}

//       {showForm && (

//         <ProductForm

//           product={editProduct}

//           categories={categories}

//           onClose={closeForm}

//           onSaved={onSaved}

//         />

//       )}



//       {/* Confirm Dialog */}

//       {confirm && (

//         <ConfirmDialog

//           message={

//             confirm.type === 'delete'

//               ? `Delete "${confirm.product.name}"? This can be restored later.`

//               : `Restore "${confirm.product.name}"?`

//           }

//           onConfirm={() =>

//             confirm.type === 'delete'

//               ? handleDelete(confirm.product)

//               : handleRestore(confirm.product)

//           }

//           onCancel={() => setConfirm(null)}

//         />

//       )}

//     </div>

//   )

// }

