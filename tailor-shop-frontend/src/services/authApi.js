import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.response.catch(
//   (error) => Promise.reject(error)
// );

export const registerUser = (data) => api.post("/register", data);
export const loginUser = (data) => api.post("/login", data);
export const logoutUser = () => api.post("/logout");
export const forgotPassword = (data) => api.post("/forgot-password", data);
export const resetPassword = (token, data) => api.post(`/reset-password/${token}`, data);

export default api;