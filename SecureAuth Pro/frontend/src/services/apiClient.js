import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize error shape
    return Promise.reject(error)
  }
)

