// src/lib/axios.js
import axios from "axios"
import useAuthStore from "../store/modules/authStore"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // timeout: 5_000, // rechaza peticiones que tarden más de 5s
})

// ——— Función de login centralizada ———
/**
 * Hace POST a /login, guarda tokens en el store y configura el header.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string }>}
 */
export const loginApi = async (credentials) => {
    const response = await api.post("/login", credentials)
    const { token } = response.data

    // Actualizo store con el token
    useAuthStore.getState().login({ token })

    // Configuro el Authorization header para todas las siguientes peticiones
    api.defaults.headers.common["Authorization"] = token

    return { token }
}

// ——— Refresh token ———
const refreshAccessToken = async () => {
    const { authTokens, login } = useAuthStore.getState()
    if (!authTokens?.refreshToken) return null

    try {
        const { data } = await api.post("/refresh", {
            refreshToken: authTokens.refreshToken,
        })
        const { accessToken, refreshToken } = data

        login({ accessToken, refreshToken })
        api.defaults.headers.common["Authorization"] = accessToken
        return accessToken
    } catch (error) {
        console.error("🔴 Error al refrescar token:", error)
        return null
    }
}

// ——— Interceptor de petición: añade accessToken ———
api.interceptors.request.use(
    (config) => {
        const { authTokens } = useAuthStore.getState()
        if (authTokens?.accessToken) {
            config.headers.Authorization = authTokens.accessToken
        }
        return config
    },
    (error) => Promise.reject(error)
)

// ——— Interceptor de respuesta: refresco automático ———
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            const newToken = await refreshAccessToken()
            if (newToken) {
                originalRequest.headers.Authorization = newToken
                return api(originalRequest)
            }
        }
        return Promise.reject(error)
    }
)
export default api
