import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      error.response?.data?.error

    error.userMessage =
      serverMessage ||
      (error.code === 'ERR_NETWORK'
        ? 'Cannot connect to server. Make sure the backend is running on port 5000.'
        : 'Something went wrong')

    return Promise.reject(error)
  }
)

export const registerUser = (data) =>
  api.post('/auth/register', {
    name: data.name,
    email: data.email,
    password: data.password,
  })

export const loginUser = (data) =>
  api.post('/auth/login', {
    email: data.email,
    password: data.password,
  })

export const logoutUser = () => api.post('/auth/logout')

export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email })

export const resetPassword = (token, password) =>
  api.post(`/auth/reset-password/${token}`, { password })

export const getMe = () => api.get('/auth/me')

// Product API functions
export const getProducts = (params = {}) => 
  api.get('/products/active', { params })

export const getFabrics = (params = {}) => 
  api.get('/products/fabrics', { params })

export const getProductById = (id) => 
  api.get(`/products/${id}`)
