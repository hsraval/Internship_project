import { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import { getWishlist } from '../api/api'

// Context
const WishlistContext = createContext(null)

// Initial State
const initialState = {
  wishlistItems: [],
  isLoading: false,
  error: null
}

// Reducer
function wishlistReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_WISHLIST':
      return { ...state, wishlistItems: action.payload, isLoading: false, error: null }
    case 'ADD_TO_WISHLIST':
      return { ...state, wishlistItems: [...state.wishlistItems, action.payload] }
    case 'REMOVE_FROM_WISHLIST':
      return { 
        ...state, 
        wishlistItems: state.wishlistItems.filter(item => {
          const productId = item?.product?._id || item?._id || item
          return productId !== action.payload
        })
      }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'CLEAR_WISHLIST':
      return { ...state, wishlistItems: [], isLoading: false, error: null }
    default:
      return state
  }
}

// Provider
export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)

  // Load wishlist on mount
  const loadWishlist = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const { data } = await getWishlist()
      const items = data?.data || data?.wishlist || data?.items || []
      dispatch({ type: 'SET_WISHLIST', payload: items })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load wishlist' })
    }
  }, [])

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId) => {
    return state.wishlistItems.some(item => {
      const itemId = item?.product?._id || item?._id || item
      return itemId === productId
    })
  }, [state.wishlistItems])

  // Add to wishlist
  const addToWishlist = useCallback((product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product })
  }, [])

  // Remove from wishlist
  const removeFromWishlist = useCallback((productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId })
  }, [])

  // Clear wishlist (for logout)
  const clearWishlist = useCallback(() => {
    dispatch({ type: 'CLEAR_WISHLIST' })
  }, [])

  return (
    <WishlistContext.Provider value={{
      ...state,
      loadWishlist,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

// Hook
export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>')
  return ctx
}
