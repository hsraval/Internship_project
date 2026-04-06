import axios from 'axios'

// ─── Axios Instance ──────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,          // Always send / receive HTTP-only cookies
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ─── Request Interceptor ─────────────────────────────────────────────────────

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong'

    // Attach a clean message so callers don't have to dig
    error.userMessage = message
    return Promise.reject(error)
  }
)

// ─── Auth Endpoints ──────────────────────────────────────────────────────────

/**
 * Register a new user.
 * POST /api/auth/register
 * Body: { name, email, passwordHash }
 */
export const registerUser = (data) =>
  api.post('/auth/register', {
    name: data.name,
    email: data.email,
    passwordHash: data.password,   // Field name expected by the backend
  })

/**
 * Log in with email + password.
 * POST /api/auth/login
 * Body: { email, password }
 * Sets HTTP-only session cookie on success.
 */
export const loginUser = (data) =>
  api.post('/auth/login', {
    email: data.email,
    password: data.password,
  })

/**
 * Log out the current user.
 * POST /api/auth/logout
 * Clears the session cookie.
 */
export const logoutUser = () => api.post('/auth/logout')

/**
 * Request a password-reset email.
 * POST /api/auth/forgot-password
 * Body: { email }
 */
export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email })

/**
 * Reset password with the token from the email link.
 * POST /api/auth/reset-password/:token
 * Body: { password }
 */
export const resetPassword = (token, password) =>
  api.post(`/auth/reset-password/${token}`, { password })

/**
 * Fetch the currently-authenticated user (used to rehydrate auth state on reload).
 * GET /api/auth/me
 * Relies on the cookie being sent automatically.
 */
export const getMe = () => api.get('/auth/me')

export default api
