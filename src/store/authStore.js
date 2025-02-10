import { create } from "zustand"
import { persist } from "zustand/middleware"
import { jwtDecode } from "jwt-decode"

const useAuthStore = create(
    persist(
        (set, get) => ({
            authTokens: null,
            userId: null,
            fullName: null,
            email: null,
            role: null,

            isAuthenticated: () => {
                const { authTokens } = get() // Usar el estado actual del store
                if (!authTokens) return false

                // Verificar si el token ha expirado
                try {
                    const decodedToken = jwtDecode(authTokens.accessToken)
                    const currentTime = Date.now() / 1000
                    if (decodedToken.exp < currentTime) {
                        // Token expirado
                        set({ authTokens: null })
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
                    console.error("Invalid token received in login:", tokens)
                    return
                }

                const formattedTokens = {
                    accessToken: tokens.token,
                    refreshToken: tokens.refreshToken,
                }

                const decodedToken = jwtDecode(tokens.token)
                set({
                    authTokens: formattedTokens,
                    userId: decodedToken?.userId || null,
                    fullName: decodedToken?.full_name || null,
                    email: decodedToken?.email || null,
                    role: decodedToken?.role || null,
                })
            },

            logout: () => {
                set({
                    authTokens: null,
                    userId: null,
                    fullName: null,
                    email: null,
                    role: null,
                })
                get()._clearStorage()
            },
        }),
        {
            name: "auth-storage",
            getStorage: () => localStorage,
        }
    )
)

export default useAuthStore
