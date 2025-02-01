// // src/lib/axios.js
import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Función para obtener nuevos tokens usando el refreshToken
const refreshAccessToken = async () => {
  const storedTokens = localStorage.getItem("authTokens")
  if (!storedTokens) return null

  const authTokens = JSON.parse(storedTokens)

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/refresh`,
      { refreshToken: authTokens.refreshToken }
    )

    const newTokens = response.data
    localStorage.setItem("authTokens", JSON.stringify(newTokens))

    // 🛠️ Asegurar que todas las nuevas peticiones usen el nuevo token
    axios.defaults.headers.common["Authorization"] = `${newTokens.accessToken}`

    return newTokens.accessToken
  } catch (error) {
    console.error("🔴 Error al refrescar el token:", error)
    return null
  }
}

// Interceptor para incluir el token en cada request
api.interceptors.request.use(
  (config) => {
    const storedTokens = localStorage.getItem("authTokens")
    if (storedTokens) {
      const authTokens = JSON.parse(storedTokens)
      if (authTokens?.accessToken) {
        config.headers.Authorization = `${authTokens.accessToken}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para manejar errores y refrescar el token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const newAccessToken = await refreshAccessToken()

      if (newAccessToken) {
        originalRequest.headers.Authorization = `${newAccessToken}`
        return api(originalRequest) // Reintentar la petición original
      }
    }

    return Promise.reject(error)
  }
)
