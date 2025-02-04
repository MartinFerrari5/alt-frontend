// /src/components/auth/ProtectedRoute.jsx

import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, role } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (adminOnly && role !== "admin") {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute
