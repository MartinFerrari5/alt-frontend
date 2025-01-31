// // src/lib/axios.js
import axios from "axios"

// Crear instancia de Axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Agregar un interceptor para incluir el token en los encabezados
api.interceptors.request.use(
  (config) => {
    const authTokens = JSON.parse(localStorage.getItem("authTokens")) // Recuperar token desde localStorage
    if (authTokens?.accessToken) {
      config.headers.Authorization = `Bearer ${authTokens.accessToken}` // Agregar token al header
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
