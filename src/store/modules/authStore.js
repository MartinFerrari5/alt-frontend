// src/store/authStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { jwtDecode } from "jwt-decode"

const useAuthStore = create(
    persist(
        (set, get) => ({
            authTokens: { accessToken: null, refreshToken: null },
            user: null,

            isAuthenticated: () => {
                const token = get().authTokens.accessToken
                if (!token) return false
                try {
                    const { exp } = jwtDecode(token)
                    if (exp < Date.now() / 1000) {
                        get().logout()
                        return false
                    }
                    return true
                } catch {
                    return false
                }
            },

            login: ({ token }) => {
                try {
                    const decoded = jwtDecode(token)
                    const user = {
                        id: decoded.userId,
                        full_name: decoded.full_name,
                        email: decoded.email,
                        role: decoded.role,
                    }
                    set({
                        authTokens: { accessToken: token, refreshToken: null },
                        user,
                    })
                } catch (error) {
                    console.error("Error al decodificar JWT:", error)
                }
            },

            logout: () => {
                set({
                    authTokens: { accessToken: null, refreshToken: null },
                    user: null,
                })
                localStorage.removeItem("auth-storage")
            },
        }),
        {
            name: "auth-storage",
            getStorage: () => localStorage,
            throttle: 1_000,
        }
    )
)

export default useAuthStore
