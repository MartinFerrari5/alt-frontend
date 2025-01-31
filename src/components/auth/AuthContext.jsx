// AuthContext.jsx

import { jwtDecode } from "jwt-decode"
import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    const savedTokens = localStorage.getItem("authTokens")
    console.log("savedTokens: ", savedTokens)
    return savedTokens ? JSON.parse(savedTokens) : null
  })

  const [userId, setUserId] = useState(() => {
    if (authTokens) {
      try {
        const decodedToken = jwtDecode(authTokens.accessToken)
        console.log("decodedToken: ", decodedToken)
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
    setAuthTokens(tokens)
    localStorage.setItem("authTokens", JSON.stringify(tokens))
    try {
      const decodedToken = jwtDecode(tokens.accessToken)
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
