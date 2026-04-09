import axios from 'axios'

// ─── Axios Instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ─── Request Interceptor ──────────────────────────────────────────────────────

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong'
    error.userMessage = message
    return Promise.reject(error)
  }
)

// ─── Auth Endpoints ───────────────────────────────────────────────────────────

export const registerUser = (data) =>
  api.post('/auth/register', {
    name: data.name,
    email: data.email,
    passwordHash: data.password,
  })

export const loginUser = (data) =>
  api.post('/auth/login', { email: data.email, password: data.password })

export const logoutUser = () => api.post('/auth/logout')

export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email })

export const resetPassword = (token, password) =>
  api.post(`/auth/reset-password/${token}`, { password })

export const getMe = () => api.get('/auth/me')

// ─── Category Endpoints ───────────────────────────────────────────────────────

/**
 * GET /api/category
 * Response: { data: [{ _id, name }] }
 */
export const getCategories = () => api.get('/category')

// ─── Product Endpoints ────────────────────────────────────────────────────────

/**
 * GET /api/products
 * params: { page, limit, search, category }
 */
export const getProducts = (params = {}) => api.get('/product', { params })

/**
 * GET /api/products/:id
 */
export const getProductById = (id) => api.get(`/product/${id}`)

/**
 * POST /api/products
 * formData: FormData (name, description, pricePerMeter, category, images[])
 */
export const createProduct = (formData) =>
  api.post('/product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  })

/**
 * PATCH /api/products/:id
 * formData: FormData (same fields, all optional)
 */
export const updateProduct = (id, formData) =>
  api.patch(`/product/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  })

/**
 * DELETE /api/products/:id
 */
export const deleteProduct = (id) => api.delete(`/product/${id}`)

/**
 * PATCH /api/products/:id/restore
 */
export const restoreProduct = (id) => api.patch(`/product/${id}/restore`)

/**
 * GET /api/products/admin
 * Returns all products including deleted ones (admin only)
 * params: { page, limit, search, category }
 */
export const getAllProductsAdmin = (params = {}) =>
  api.get('/product/admin', { params })

// ─── ORDER (new) ──────────────────────────────────────────────────────────────
export const createOrder      = (data)         => api.post("/order", data);
export const getMyOrders      = ()             => api.get("/order/user");
export const getAllOrders      = ()             => api.get("/order");
export const getOrderById     = (id)           => api.get(`/order/${id}`);
export const updateOrderStatus = (id, status)  => api.patch(`/order/${id}/status`, { status });
export const cancelOrder      = (id)           => api.post(`/order/${id}`);
 
// ─── BILL (new) ───────────────────────────────────────────────────────────────
export const getBillById   = (id) => api.get(`/bill/${id}`);
export const downloadBill  = (id) => api.get(`/bill/${id}/download`, { responseType: "blob" });

export const addToWishlist      = (productId)      => api.post('/wishlist', { productId })
export const removeFromWishlist = (productId)      => api.delete(`/wishlist/${productId}`)
export const getWishlist        = (params = {})    => api.get('/wishlist', { params })
 
export default api
