import { useNavigate } from "react-router-dom"

import { useAuth } from "./AuthContext"

const LogoutButton = () => {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout() // Llama a la función logout del contexto
        navigate("/login") // Redirige al usuario a la página de login
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
