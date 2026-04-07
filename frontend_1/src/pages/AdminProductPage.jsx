import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllProductsAdmin, deleteProduct, restoreProduct, getCategories } from '../api/api'
import ProductForm from './ProductForm'
import toast from 'react-hot-toast'

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-[#161711]/80 backdrop-blur-sm" />
      <div className="relative z-10 bg-[#1a1b14] border border-[#45362C] rounded-xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[#e8dcc8] font-serif text-base mb-5">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-[#45362C] text-[#9a8f7e] rounded-lg hover:border-[#A8977A] transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-red-800/80 text-red-200 rounded-lg hover:bg-red-700 transition-all">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ deleted }) {
  return deleted ? (
    <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider bg-red-900/30 text-red-400 border border-red-800/50 rounded-full px-2.5 py-0.5">
      <span className="w-1 h-1 rounded-full bg-red-400" />
      Deleted
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider bg-green-900/30 text-green-400 border border-green-800/50 rounded-full px-2.5 py-0.5">
      <span className="w-1 h-1 rounded-full bg-green-400" />
      Active
    </span>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminProductPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('')
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Form modal state
  const [showForm, setShowForm]       = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  // Confirm dialog state
  const [confirm, setConfirm] = useState(null) // { type: 'delete'|'restore', product }

  const LIMIT = 12

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

    getAllProductsAdmin(params)
      .then(({ data }) => {
        setProducts(data.data ?? data.products ?? data ?? [])
        if (data.pagination.totalPages) setTotalPages(data.pagination.totalPages)
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

  const openCreate = () => { setEditProduct(null); setShowForm(true) }
  const openEdit   = (p)  => { setEditProduct(p);    setShowForm(true) }
  const closeForm  = ()   => { setShowForm(false); setEditProduct(null) }
  const onSaved    = ()   => { closeForm(); fetchProducts() }

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
          <Link to="/admin/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider bg-[#45362C] text-[#e8dcc8] transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Manage Products
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#A8977A] mb-1">Admin</p>
            <h1 className="font-serif text-3xl font-semibold text-[#e8dcc8]">Manage Products</h1>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#A8977A] text-[#161711] rounded-lg font-mono text-xs uppercase tracking-widest hover:bg-[#e8dcc8] transition-all font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#45362C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products…"
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

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#45362C] border-t-[#A8977A] rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#45362C]">
            <p className="font-mono text-sm uppercase tracking-widest">No products found</p>
          </div>
        ) : (
          <div className="bg-[#1a1b14] border border-[#45362C]/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#45362C]/50">
                    <th className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-[#A8977A]">Product</th>
                    <th className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-[#A8977A]">Category</th>
                    <th className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-[#A8977A]">Price / m</th>
                    <th className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-[#A8977A]">Status</th>
                    <th className="text-right px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-[#A8977A]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p._id} className={`border-b border-[#45362C]/30 hover:bg-[#161711]/50 transition-colors ${i === products.length - 1 ? 'border-0' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#161711] overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <svg className="w-4 h-4 text-[#45362C] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-serif font-medium text-[#e8dcc8] text-sm">{p.name}</p>
                            {p.description && (
                              <p className="text-[#9a8f7e] text-xs line-clamp-1 max-w-48">{p.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#9a8f7e] text-xs font-mono">
                        {p.category?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-[#A8977A] font-mono text-sm">
                        ₹{Number(p.pricePerMeter).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge deleted={p.isDeleted || p.deletedAt} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit */}
                          {!(p.isDeleted || p.deletedAt) && (
                            <button
                              onClick={() => openEdit(p)}
                              className="flex items-center gap-1 px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider border border-[#45362C] text-[#9a8f7e] rounded-lg hover:border-[#A8977A] hover:text-[#A8977A] transition-all"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                          )}

                          {/* Delete / Restore */}
                          {p.isDeleted || p.deletedAt ? (
                            <button
                              onClick={() => setConfirm({ type: 'restore', product: p })}
                              className="flex items-center gap-1 px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider bg-green-900/30 text-green-400 border border-green-800/50 rounded-lg hover:bg-green-900/50 transition-all"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Restore
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirm({ type: 'delete', product: p })}
                              className="flex items-center gap-1 px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider bg-red-900/20 text-red-400 border border-red-800/30 rounded-lg hover:bg-red-900/40 transition-all"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
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
          <div className="flex items-center justify-center gap-2 mt-8">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-[#45362C] text-[#9a8f7e] rounded-lg hover:border-[#A8977A] hover:text-[#A8977A] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              ← Prev
            </button>
            <span className="font-mono text-xs text-[#A8977A] px-3">{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-[#45362C] text-[#9a8f7e] rounded-lg hover:border-[#A8977A] hover:text-[#A8977A] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              Next →
            </button>
          </div>
        )}
      </main>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editProduct}
          categories={categories}
          onClose={closeForm}
          onSaved={onSaved}
        />
      )}

      {/* Confirm Dialog */}
      {confirm && (
        <ConfirmDialog
          message={
            confirm.type === 'delete'
              ? `Delete "${confirm.product.name}"? This can be restored later.`
              : `Restore "${confirm.product.name}"?`
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
