// /src/components/auth/ProtectedRoute.jsx

import { Navigate } from "react-router-dom"
import useAuthStore from "../../store/modules/authStore"

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
    const user = useAuthStore((state) => state.user)

    if (!isAuthenticated) {
        return <Navigate to="/rraa/login" replace />
    }

    if (adminOnly && user.role !== "admin") {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute
