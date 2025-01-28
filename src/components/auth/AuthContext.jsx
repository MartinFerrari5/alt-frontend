// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

/* eslint-disable-next-line react-refresh/only-export-components */
export const useAuth = () => useContext(AuthContext) // Add this export

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    const savedTokens = localStorage.getItem("authTokens")
    return savedTokens ? JSON.parse(savedTokens) : null
  })

  const isAuthenticated = !!authTokens

  const login = (tokens) => {
    setAuthTokens(tokens)
    localStorage.setItem("authTokens", JSON.stringify(tokens))
  }

  const logout = () => {
    setAuthTokens(null)
    localStorage.removeItem("authTokens")
  }

  useEffect(() => {
    // Optionally handle token expiration here
  }, [authTokens])

  return (
    <AuthContext.Provider
      value={{ authTokens, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext } // Keep this export as well
