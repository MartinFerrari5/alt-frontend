// src/store/authStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { jwtDecode } from "jwt-decode"

const useAuthStore = create(
    persist(
        (set, get) => ({
            authTokens: null,
            user: null,

            isAuthenticated: () => {
                const { authTokens } = get()
                if (!authTokens) return false

                try {
                    const decodedToken = jwtDecode(authTokens.accessToken)
                    const currentTime = Date.now() / 1000
                    if (decodedToken.exp < currentTime) {
                        get().logout()
                        return false
                    }
                    return true
                } catch (error) {
                    console.error("Error decoding token:", error)
                    return false
                }
            },

            login: (tokens) => {
                if (!tokens?.token) {
                    console.error("Token inválido en login:", tokens)
                    return
                }

                const accessToken = tokens.token
                const refreshToken = tokens.refreshToken

                const decoded = jwtDecode(accessToken)

                const user = {
                    id: decoded?.userId || null,
                    full_name: decoded?.full_name || null,
                    email: decoded?.email || null,
                    role: decoded?.role || null,
                    created_at: decoded?.created_at || null,
                }

                set({
                    authTokens: { accessToken, refreshToken },
                    user,
                })
            },

            logout: () => {
                set({
                    authTokens: null,
                    user: null,
                })
                localStorage.removeItem("auth-storage")
                localStorage.removeItem("status-storage")
            },
        }),
        {
            name: "auth-storage",
            getStorage: () => localStorage,
        }
    )
)

export default useAuthStore
