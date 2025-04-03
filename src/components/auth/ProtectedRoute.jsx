// /src/components/auth/ProtectedRoute.jsx

import { Navigate } from "react-router-dom"
import useAuthStore from "../../store/modules/authStore"

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
    const role = useAuthStore((state) => state.role)

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (adminOnly && role !== "admin") {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute
