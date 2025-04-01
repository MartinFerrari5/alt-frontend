// /src/pages/user/UserProfile.jsx
import { useState } from "react"
import Button from "../../components/Button"
import { useUpdateUser } from "../../hooks/data/users/useUserHooks"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../../store/authStore"
import Sidebar from "../../components/layout/Sidebar"

const UserProfilePage = () => {
    const navigate = useNavigate()

    // Datos del usuario desde el store de autenticación
    const authFullName = useAuthStore((state) => state.fullName)
    const userId = useAuthStore((state) => state.userId)
    const email = useAuthStore((state) => state.email)
    const role = useAuthStore((state) => state.role)

    // Estados locales para el nombre
    const [fullName, setFullName] = useState(authFullName || "")
    const [originalFullName, setOriginalFullName] = useState(authFullName || "")
    const [isEditingName, setIsEditingName] = useState(false)

    const updateUserMutation = useUpdateUser(userId)

    const handleSave = () => {
        // Se usa el valor original si el input queda vacío
        const newFullName = fullName.trim() === "" ? originalFullName : fullName

        if (newFullName === originalFullName) {
            setIsEditingName(false)
            return
        }

        const payload = { full_name: newFullName }

        updateUserMutation.mutate(payload, {
            onSuccess: () => {
                useAuthStore.setState({ fullName: newFullName })
                setOriginalFullName(newFullName)
                setIsEditingName(false)
            },
            onError: () => {
                // Manejo de error (ej: mostrar una notificación)
            },
        })
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-100 lg:flex-row">
            <div className="hidden lg:block lg:w-72">
                <Sidebar />
            </div>
            <div className="flex-1 overflow-auto px-4 py-6 sm:px-8">
                <div className="mb-4 flex items-center justify-between">
                    <Button
                        onClick={() => navigate(-1)}
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                        Volver
                    </Button>
                    <Button
                        onClick={() => navigate("/user/password")}
                        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    >
                        Cambiar Contraseña
                    </Button>
                </div>
                <div className="rounded bg-white p-6 shadow">
                    <h1 className="mb-6 text-3xl font-extrabold text-gray-800">
                        Mi Perfil
                    </h1>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-semibold text-gray-700">
                                ID:
                            </label>
                            <span className="text-gray-900">{userId}</span>
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700">
                                Email:
                            </label>
                            <span className="text-gray-900">{email}</span>
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700">
                                Role:
                            </label>
                            <span className="text-gray-900">{role}</span>
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700">
                                Nombre Completo:
                            </label>
                            {isEditingName ? (
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) =>
                                            setFullName(e.target.value)
                                        }
                                        className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Button
                                        onClick={handleSave}
                                        className="ml-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                    >
                                        Guardar
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <span className="text-gray-900">
                                        {fullName}
                                    </span>
                                    <button
                                        onClick={() => setIsEditingName(true)}
                                        className="ml-2 text-blue-500 hover:text-blue-700"
                                        title="Editar nombre"
                                    >
                                        ✏️
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfilePage
