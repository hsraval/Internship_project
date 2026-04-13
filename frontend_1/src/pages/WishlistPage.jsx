// src/pages/WishlistPage.jsx
import { useEffect, useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getWishlist, removeFromWishlist } from '../api/api'
import toast from 'react-hot-toast'
import LayoutWrapper from '../components/LayoutWrapper'

const LIMIT = 8

export default function WishlistPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [loggingOut, setLoggingOut] = useState(false)
  const [items,    setItems]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [page,     setPage]     = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      toast.success('Signed out successfully')
      navigate('/')
    } catch {
      toast.error('Failed to sign out')
    } finally {
      setLoggingOut(false)
    }
  }

  const fetchWishlist = useCallback(async (p = 1) => {
    setLoading(true)
    setError('')
    try {
      const res = await getWishlist({ page: p, limit: LIMIT })
      // Response: { success, data: [...], totalPages } — adjust keys if backend differs
      const data = res.data
      setItems(data?.data || data?.wishlist || data?.items || [])
      setTotalPages(data?.totalPages || data?.totalPage || 1)
    } catch {
      setError('Failed to load wishlist.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWishlist(page)
  }, [page, fetchWishlist])

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId)
      toast.success('Removed from wishlist')
      fetchWishlist(page)
    } catch {
      toast.error('Failed to remove item.')
    }
  }

  const handleOrder = (productId) => {
    if (!user) {
      navigate('/login')
    } else {
      navigate(`/order?product=${productId}`)
    }
  }

  return (
    <LayoutWrapper>
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">User Dashboard</p>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">Wishlist</h1>
          </div>
          {items.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059]/10 text-[#C5A059] text-xs font-bold rounded-full border border-[#C5A059]/20">
              {items.length} items
            </span>
          )}
        </header>

        {/* Content */}
        <div className="mt-6">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20 sm:py-32">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <div className="absolute inset-0 border-2 border-[#CBD5E1]/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-t-[#C5A059] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl font-mono text-center">
              {error}
            </div>
          )}

        {/* Empty state */}
        {!loading && !error && items.length === 0 && (
          <div className="text-center py-16 sm:py-24 lg:py-32 border border-dashed border-[#CBD5E1] rounded-2xl bg-[#FFFFFF] mx-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-[#F8F9FA] border border-[#CBD5E1] flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#CBD5E1]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#64748B] mb-2 px-4">No items in wishlist</p>
            <p className="text-[#64748B]/60 text-xs sm:text-sm mb-4 sm:mb-6 px-4 max-w-md mx-auto">Save fabrics you love to find them easily later.</p>
            <Link
              to="/products"
              className="inline-block px-4 sm:px-6 py-2 sm:py-2.5 bg-[#0F172A] text-[#FFFFFF] font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-[#C5A059] transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && items.length > 0 && (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {items.map((item) => {
                // backend may return { product: {...} } or the product directly
                const product = item?.product || item
                const image   = product?.images?.[0]?.url

                return (
                  <div
                    key={product._id}
                    className="group bg-[#FFFFFF] border border-[#CBD5E1]/30 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_-10px_rgba(197,160,89,0.2)] hover:-translate-y-0.5"
                  >
                    {/* Image */}
                    <div className="relative h-52 sm:h-60 lg:h-72 overflow-hidden bg-[#F8F9FA]">
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-[#CBD5E1]">
                          <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}

                      {/* Category badge */}
                      {product.category?.name && (
                        <span className="absolute top-2 sm:top-3 left-2 sm:left-3 text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] bg-[#0F172A]/70 text-white rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1">
                          {product.category.name}
                        </span>
                      )}

                      {/* Remove from wishlist */}
                      <button
                        onClick={() => handleRemove(product._id)}
                        title="Remove from wishlist"
                        className="absolute top-2 sm:top-3 right-2 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C5A059] text-white flex items-center justify-center hover:bg-[#b08d47] transition-colors shadow"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <h3 className="font-serif font-semibold text-[#0F172A] text-sm sm:text-base leading-snug mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-[#C5A059] text-base sm:text-lg font-light mb-3 sm:mb-4">
                        ₹{Number(product.pricePerMeter).toLocaleString()}
                        <span className="text-xs text-[#64748B] ml-1 font-normal">/ meter</span>
                      </p>

                      <div className="mt-auto">
                        <button
                          onClick={() => handleOrder(product._id)}
                          className="w-full py-2 sm:py-2.5 bg-[#0F172A] text-[#FFFFFF] font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-[#C5A059] transition-all duration-300"
                        >
                          Order
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2 border border-[#CBD5E1] text-[#64748B] font-mono text-xs uppercase tracking-widest rounded-lg hover:border-[#C5A059] hover:text-[#C5A059] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>
                <span className="font-mono text-xs text-[#64748B] uppercase tracking-widest px-2">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2 border border-[#CBD5E1] text-[#64748B] font-mono text-xs uppercase tracking-widest rounded-lg hover:border-[#C5A059] hover:text-[#C5A059] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
        </div>
      </main>
    </LayoutWrapper>
  )
}
