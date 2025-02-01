// src/components/auth/AuthContext.jsx

import { jwtDecode } from "jwt-decode"
import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    const savedTokens = localStorage.getItem("authTokens")
    return savedTokens ? JSON.parse(savedTokens) : null
  })

  const [userId, setUserId] = useState(null)
  const [fullName, setFullName] = useState(null)
  const [email, setEmail] = useState(null)
  const [role, setRole] = useState(null)

  // Decodificar el token solo cuando cambie `authTokens`
  useEffect(() => {
    if (authTokens) {
      try {
        const decodedToken = jwtDecode(authTokens.accessToken)
        setUserId(decodedToken?.userId || null)
        setFullName(decodedToken?.full_name || null)
        setEmail(decodedToken?.email || null)
        setRole(decodedToken?.role || null)
      } catch (error) {
        console.error("Error decoding token:", error)
        setUserId(null)
        setFullName(null)
        setEmail(null)
        setRole(null)
      }
    } else {
      setUserId(null)
      setFullName(null)
      setEmail(null)
      setRole(null)
    }
  }, [authTokens])

  const isAuthenticated = !!authTokens

  const login = (tokens) => {
    if (!tokens?.token) {
      console.error("Token inválido recibido en login:", tokens)
      return
    }

    const formattedTokens = {
      accessToken: tokens.token,
      refreshToken: tokens.refreshToken,
    }

    setAuthTokens(formattedTokens)
    localStorage.setItem("authTokens", JSON.stringify(formattedTokens))
  }

  const logout = () => {
    setAuthTokens(null)
    setUserId(null)
    setFullName(null)
    setEmail(null)
    setRole(null)
    localStorage.removeItem("authTokens")
  }

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        isAuthenticated,
        userId,
        fullName,
        email,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
