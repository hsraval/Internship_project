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
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4 px-2">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-widest text-[#80b3ba] font-bold mb-1">User Dashboard</p>
            <h1 className="font-sans text-2xl md:text-3xl font-bold text-[#1e2a3a]">My Wishlist</h1>
          </div>
          {items.length > 0 && (
            <span className="inline-flex items-center text-[10px] font-sans uppercase tracking-[0.15em] bg-[#16537e] text-white rounded-full px-4 py-2 shadow-sm font-bold w-fit">
              {items.length} items
            </span>
          )}
        </div>

        {/* Content */}
        <div className="mt-6">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20 sm:py-32">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <div className="absolute inset-0 border-2 border-[#b0d3e6]/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-t-[#16537e] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
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
          <div className="text-center py-16 sm:py-24 lg:py-32 border border-dashed border-[#b0d3e6] rounded-2xl bg-white mx-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-[#d7e9f2] border border-[#b0d3e6] flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#80b3ba]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#16537e]/60 mb-2 px-4">No items in wishlist</p>
            <p className="text-[#16537e]/50 text-xs sm:text-sm mb-4 sm:mb-6 px-4 max-w-md mx-auto">Save fabrics you love to find them easily later.</p>
            <Link
              to="/products"
              className="inline-block px-4 sm:px-6 py-2 sm:py-2.5 bg-[#16537e] text-white font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-[#124470] transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && items.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 px-2">
              {items.map((item) => {
                // backend may return { product: {...} } or the product directly
                const product = item?.product || item
                const image   = product?.images?.[0]?.url

                return (
                  <div
                    key={product._id}
                    className="bg-white border border-[#b0d3e6]/50 rounded-2xl overflow-hidden group hover:border-[#80b3ba] hover:shadow-xl hover:shadow-[#16537e]/15 transition-all duration-300 flex flex-col hover:-translate-y-1 relative"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#16537e] via-[#80b3ba] to-[#d7e9f2] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                    
                    {/* Image */}
                    <div className="relative h-32 sm:h-48 bg-[#f4f9fb] flex items-center justify-center overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#80b3ba]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}

                      {/* Category badge */}
                      {product.category?.name && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                          <span className="inline-flex items-center text-[8px] sm:text-[10px] font-sans uppercase tracking-[0.15em] bg-[#16537e]/95 text-white rounded-full px-2 py-1 sm:px-3 sm:py-1.5 shadow-sm font-bold backdrop-blur-sm">
                            {product.category.name}
                          </span>
                        </div>
                      )}

                      {/* Remove from wishlist */}
                      <button
                        onClick={() => handleRemove(product._id)}
                        title="Remove from wishlist"
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90 text-[#16537e] flex items-center justify-center hover:bg-[#16537e] hover:text-white transition-all shadow-sm backdrop-blur-sm group/btn"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div className="absolute inset-0 rounded-full border border-[#16537e] opacity-0 group-hover/btn:scale-110 group-hover/btn:opacity-100 transition-all duration-300" />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 flex-1 relative bg-white">
                      <div className="flex flex-col flex-1 h-full">
                        <h3 className="font-sans font-bold text-[#1e2a3a] text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-[#16537e] transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mt-2 mb-3">
                          <p className="text-[#16537e] text-sm sm:text-base font-bold">
                            ₹{Number(product.pricePerMeter).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex mt-auto">
                          <button
                            onClick={() => handleOrder(product._id)}
                            className="w-full py-1.5 sm:py-2 text-[10px] font-sans font-bold uppercase tracking-wider bg-[#16537e] text-white rounded-lg sm:rounded-xl hover:bg-[#124470] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                          >
                            Order
                          </button>
                        </div>
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
                  className="w-full sm:w-auto px-4 sm:px-5 py-2 border border-[#b0d3e6] text-[#16537e]/60 font-mono text-xs uppercase tracking-widest rounded-lg hover:border-[#16537e] hover:text-[#16537e] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>
                <span className="font-mono text-xs text-[#16537e]/60 uppercase tracking-widest px-2">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2 border border-[#b0d3e6] text-[#16537e]/60 font-mono text-xs uppercase tracking-widest rounded-lg hover:border-[#16537e] hover:text-[#16537e] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
