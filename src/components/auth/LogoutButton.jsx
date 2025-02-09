// /src/components/auth/LogoutButton.jsx

import { useNavigate } from "react-router-dom"
import useAuthStore from "../../store/authStore"

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
            className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
            Cerrar Sesión
        </button>
    )
}

export default LogoutButton
