// /src/pages/user/UserProfile.jsx
import { useState } from "react"
import Button from "../../components/Button"
import { useUpdateUser } from "../../hooks/data/users/useUserHooks"
import { useNavigate } from "react-router-dom"

import useAuthStore from "../../store/authStore"
import Sidebar from "../../components/layout/Sidebar"

const UserProfilePage = () => {
    const navigate = useNavigate()

    // Obtener los datos del usuario autenticado desde el store
    const authFullName = useAuthStore((state) => state.fullName)
    const userId = useAuthStore((state) => state.userId)
    const email = useAuthStore((state) => state.email)
    const role = useAuthStore((state) => state.role)

    // Estados locales para el campo editable
    // Se inicializan a partir del valor global al montar el componente
    const [fullName, setFullName] = useState(authFullName || "")
    const [originalFullName, setOriginalFullName] = useState(authFullName || "")
    const [isEditingName, setIsEditingName] = useState(false)

    const updateUserMutation = useUpdateUser(userId)

    const handleSave = () => {
        // Si el campo quedó vacío, se conserva el valor original
        const newFullName = fullName.trim() === "" ? originalFullName : fullName

        // Solo se envía el payload si se detecta un cambio
        if (newFullName === originalFullName) {
            setIsEditingName(false)
            return
        }

        const payload = { full_name: newFullName }

        updateUserMutation.mutate(payload, {
            onSuccess: () => {
                // Actualizar el estado global en authStore
                useAuthStore.setState({ fullName: newFullName })
                // Actualizar los estados locales y salir del modo edición
                setOriginalFullName(newFullName)
                setIsEditingName(false)
            },
            onError: () => {
                // Manejo de error (por ejemplo, mostrar una notificación)
            },
        })
    }

    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            <div className="hidden lg:block lg:w-72">
                <Sidebar />
            </div>
            <div className="flex-1 overflow-auto px-4 py-6 sm:px-8">
                <Button onClick={() => navigate(-1)}>Volver</Button>
                <div className="p-6">
                    <h1 className="my-4 text-2xl font-bold">Mi Perfil</h1>
                    <div className="rounded bg-white p-4 shadow">
                        {/* Mostrar datos obtenidos en la autenticación */}
                        <div className="mb-4">
                            <label className="mb-1 block font-semibold">
                                ID:
                            </label>
                            <span>{userId}</span>
                        </div>
                        <div className="mb-4">
                            <label className="mb-1 block font-semibold">
                                Email:
                            </label>
                            <span>{email}</span>
                        </div>
                        <div className="mb-4">
                            <label className="mb-1 block font-semibold">
                                Role:
                            </label>
                            <span>{role}</span>
                        </div>
                        <div className="mb-4">
                            <label className="mb-1 block font-semibold">
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
                                        className="w-full rounded border p-2"
                                    />
                                    <Button
                                        onClick={handleSave}
                                        className="ml-2"
                                    >
                                        Guardar
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <span>{fullName}</span>
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
