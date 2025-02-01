// AuthContext.jsx

import { jwtDecode } from "jwt-decode"
import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    const savedTokens = localStorage.getItem("authTokens")
    return savedTokens ? JSON.parse(savedTokens) : null
  })

  const [userId, setUserId] = useState(() => {
    if (authTokens) {
      try {
        const decodedToken = jwtDecode(authTokens.accessToken)
        return decodedToken?.userId || null
      } catch (error) {
        console.error("Error decoding token:", error)
        return null
      }
    }
    return null
  })

  const isAuthenticated = !!authTokens

  const login = (tokens) => {
    if (!tokens?.token) {
      console.error("Token inválido recibido en login:", tokens)
      return
    }
    const formattedTokens = {
      accessToken: tokens.token, // Asegura que se almacena correctamente
      refreshToken: tokens.refreshToken,
    }
    setAuthTokens(formattedTokens)
    localStorage.setItem("authTokens", JSON.stringify(formattedTokens))
    try {
      const decodedToken = jwtDecode(formattedTokens.accessToken)
      setUserId(decodedToken?.userId || null)
    } catch (error) {
      console.error("Error decoding token:", error)
      setUserId(null)
    }
  }

  const logout = () => {
    setAuthTokens(null)
    setUserId(null)
    localStorage.removeItem("authTokens")
  }

  return (
    <AuthContext.Provider
      value={{ authTokens, isAuthenticated, userId, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext } // 🔥 SOLUCIÓN: Exportar AuthContext
