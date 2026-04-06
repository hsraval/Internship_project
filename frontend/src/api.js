import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// AUTH APIs

export const registerUser = (data) =>
  api.post('/auth/register', {
    name: data.name,
    email: data.email,
    passwordHash: data.password, // ✅ MATCH BACKEND
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

export const getMe = () => api.get('/user/profile') // ✅ FIXED