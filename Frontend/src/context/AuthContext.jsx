import { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import { getMe, logoutUser } from '../api'

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext(null)

// ─── Reducer ─────────────────────────────────────────────────────────────────

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,   // true on first load while we check the cookie
}

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false }
    case 'CLEAR_USER':
      return { ...state, user: null, isAuthenticated: false, isLoading: false }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // On mount: try to fetch the authenticated user via the session cookie.
  // If the cookie is missing / expired the request returns 401 → we mark unauthenticated.
  useEffect(() => {
    let cancelled = false

    async function checkAuth() {
      try {
        const { data } = await getMe()
        if (!cancelled) dispatch({ type: 'SET_USER', payload: data.user ?? data })
      } catch {
        if (!cancelled) dispatch({ type: 'CLEAR_USER' })
      }
    }

    checkAuth()
    return () => { cancelled = true }
  }, [])

  const login = useCallback((user) => {
    dispatch({ type: 'SET_USER', payload: user })
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } catch {
      // Even if the request fails, clear local state
    } finally {
      dispatch({ type: 'CLEAR_USER' })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
