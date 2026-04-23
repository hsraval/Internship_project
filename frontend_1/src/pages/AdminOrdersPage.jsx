import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllOrders } from '../api/api'
import OrderTable from '../components/OrderTable'
import toast from 'react-hot-toast'
import LayoutWrapper from '../components/LayoutWrapper'

const STATUS_STYLES = {
  pending:   'bg-amber-50 text-amber-700 border-amber-100',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
  stitching: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  ready:     'bg-purple-50 text-purple-700 border-purple-100',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
}

const STATUSES = ['all', 'pending', 'confirmed', 'stitching', 'ready', 'delivered', 'cancelled']

// ─── Main Component ───────────────────────────────────────────
export default function AdminOrdersPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const params = { page, limit: 10 }
    getAllOrders(params)
      .then((r) => {
        console.log('API Response:', r) // Debug log
        const list = r.data?.data || r.data || []
        setOrders(list)
        
        // Calculate totalPages based on actual response structure
        if (r.pagination?.totalPages) {
          setTotalPages(r.pagination.totalPages)
        } else if (r.total) {
          setTotalPages(Math.ceil(r.total / 10))
        } else if (r.data?.total) {
          setTotalPages(Math.ceil(r.data.total / 10))
        } else {
          // If no pagination info from backend, calculate based on returned data
          setTotalPages(Math.ceil(list.length / 10))
        }
      })
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false))
  }, [page])

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <LayoutWrapper>
      {/* Header */}
      <div className="px-4 md:px-8 py-4 md:py-6 flex-shrink-0 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">Admin Dashboard</p>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">All Orders</h1>
          </div>
          {orders.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059]/10 text-[#C5A059] text-xs font-bold rounded-full border border-[#C5A059]/20">
              {orders.length} orders
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 md:px-8 py-4 border-b border-slate-100 bg-white">
        {/* Mobile Dropdown */}
        <div className="sm:hidden">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white font-mono text-sm font-semibold border-0 shadow appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s} className="bg-white text-slate-900">
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {/* Desktop Tabs */}
        <div className="hidden sm:flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs font-mono px-4 py-2 rounded-xl capitalize transition-all duration-200 border whitespace-nowrap ${
                filter === s
                  ? 'bg-[#C5A059] text-white border-transparent shadow-md shadow-[#C5A059]/20 font-bold'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-[#C5A059]/40 hover:text-[#C5A059] hover:bg-slate-50'
              }`}
            >
              {s === 'all' ? 'All Orders' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl font-medium flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="font-semibold text-slate-500">No orders found{filter !== 'all' ? ` for "${filter}"` : ''}</p>
          </div>
        )}

        {/* Mobile Card View */}
        {!loading && !error && filtered.length > 0 && (
          <div className="block sm:hidden space-y-4">
            {filtered.map((order) => {
              const status = order?.status || 'pending'
              const badgeClass = STATUS_STYLES[status] || STATUS_STYLES.pending
              const firstItem = order?.items?.[0]
              const itemCount = order?.items?.length ?? 0
              const total = order?.totalAmount ?? '—'
              const stitching = order?.stitching?.type ? 'Yes' : 'No'

              return (
                <div
                  key={order._id}
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                  className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-[#C5A059]/40 hover:shadow-lg hover:shadow-[#C5A059]/10 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Order ID</p>
                      <p className="text-slate-900 font-mono text-sm font-semibold">#{order._id?.slice(-8)}</p>
                    </div>
                    <span className={`text-[10px] font-mono font-semibold px-3 py-1.5 rounded-full border uppercase tracking-wide ${badgeClass} whitespace-nowrap`}>
                      {status}
                    </span>
                  </div>

                  <div className="h-px bg-slate-50 mb-4" />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="col-span-2">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Product</p>
                      <p className="font-semibold text-slate-800">
                        {firstItem?.name || '—'}
                        {itemCount > 1 && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-[#C5A059]/10 text-[#C5A059] text-xs rounded-full ml-2">+{itemCount - 1}</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Total</p>
                      <p className="font-bold text-[#C5A059] text-base">₹{total}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Stitching</p>
                      <p className={`font-semibold text-xs px-2 py-1 rounded-lg inline-block ${stitching === 'Yes' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>{stitching}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Date</p>
                      <p className="font-semibold text-slate-700">
                        {order?.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Desktop Table View */}
        {!loading && !error && filtered.length > 0 && (
          <div className="hidden sm:block">
            <OrderTable orders={filtered} />
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 pb-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-500 hover:border-[#C5A059] hover:text-[#C5A059] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                    page === i + 1
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-500 hover:border-[#C5A059] hover:text-[#C5A059] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </LayoutWrapper>
  )
}