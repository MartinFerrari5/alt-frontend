// src/store/authStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { jwtDecode } from "jwt-decode"

const useAuthStore = create(
    persist(
        (set) => ({
            authTokens: null,
            userId: null,
            fullName: null,
            email: null,
            role: null,

            isAuthenticated: () => {
                const tokens = JSON.parse(localStorage.getItem("authTokens"))
                if (!tokens) return false

                // Check if the token is expired
                try {
                    const decodedToken = jwtDecode(tokens.accessToken)
                    const currentTime = Date.now() / 1000
                    if (decodedToken.exp < currentTime) {
                        // Token is expired
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
            },
        }),
        {
            name: "auth-storage",
            getStorage: () => localStorage,
        }
    )
)

export default useAuthStore
