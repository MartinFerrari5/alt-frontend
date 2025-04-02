// /src/components/auth/LogoutButton.jsx

import { useNavigate } from "react-router-dom"

import { Children } from "react"
import useAuthStore from "../../store/modules/authStore"

const LogoutButton = () => {
    const logout = useAuthStore((state) => state.logout)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <button
            onClick={handleLogout}
            className="nav-item group w-full text-left hover:bg-red-500/20"
            aria-label="Cerrar sesión"
        >
            {Children}
        </button>
    )
}

export default LogoutButton
