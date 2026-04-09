// src/components/WishlistButton.jsx
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { addToWishlist, removeFromWishlist } from '../api/api'

export default function WishlistButton({ productId, initialWishlisted = false, className = '' }) {
  const { isAuthenticated } = useAuth()
  const { isInWishlist, addToWishlist: addToGlobalWishlist, removeFromWishlist: removeFromGlobalWishlist, loadWishlist } = useWishlist()
  const [loading, setLoading] = useState(false)
  
  // Use global state to determine if product is wishlisted
  const wishlisted = isInWishlist(productId)

  // Load wishlist when component mounts if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist()
    }
  }, [isAuthenticated, loadWishlist])

  const handleToggle = async (e) => {
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error('Please login to use wishlist')
      return
    }

    setLoading(true)
    try {
      if (wishlisted) {
        await removeFromWishlist(productId)
        removeFromGlobalWishlist(productId)
        toast.success('Removed from wishlist')
      } else {
        await addToWishlist(productId)
        addToGlobalWishlist(productId)
        toast.success('Added to wishlist')
      }
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`
        w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center
        border transition-all duration-200 disabled:opacity-50
        ${wishlisted
          ? 'bg-[#C5A059] border-[#C5A059] text-white hover:bg-[#b08d47]'
          : 'bg-white/80 border-[#CBD5E1] text-[#64748B] hover:border-[#C5A059] hover:text-[#C5A059]'
        }
        ${className}
      `}
    >
      <svg
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5"
        fill={wishlisted ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}