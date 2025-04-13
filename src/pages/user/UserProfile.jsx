// /src/pages/user/UserProfile.jsx
import { useState, useEffect } from "react"
import {
    User,
    Mail,
    Shield,
    IdCard,
    Pencil,
    Save,
    X,
    Loader2,
    ArrowLeft,
} from "lucide-react"

import { useNavigate } from "react-router-dom"
import { toast } from "../../components/ui/sonner"
import MainLayout from "../../components/layout/MainLayout"
import useAuthStore from "../../store/modules/authStore"
import Button from "../../components/Button"
import { useUpdateUser } from "../../store/modules/userStore"

const UserProfile = () => {
    const navigate = useNavigate()

    const user = useAuthStore((state) => state.user)

    const [editedName, setEditedName] = useState(user.full_name || "")
    const [isEditing, setIsEditing] = useState(false)

    const updateUserMutation = useUpdateUser(user.id)

    useEffect(() => {
        setEditedName(user.full_name || "")
    }, [user.full_name])

    const handleStartEditing = () => setIsEditing(true)
    const handleCancelEditing = () => {
        setEditedName(user.full_name || "")
        setIsEditing(false)
    }

    const handleSave = () => {
        if (!editedName.trim()) {
            toast.error("Name cannot be empty")
            return
        }
        if (editedName.trim() === user.full_name) {
            setIsEditing(false)
            return
        }

        // Preparamos el payload de acuerdo a la documentación
        const payload = { full_name: editedName.trim() }
        updateUserMutation.mutate(payload, {
            onSuccess: () => {
                // Actualizamos el estado de autenticación
                useAuthStore.setState({ fullName: editedName.trim() })
                toast.success("Profile updated successfully")
                setIsEditing(false)
            },
            onError: (err) => {
                toast.error(
                    "Failed to update profile: " +
                        (err.message || "Unknown error")
                )
            },
        })
    }

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="text-green h-10 w-10 animate-spin" />
            </div>
        )
    }

    const getRoleDisplayName = (role) => {
        switch (role) {
            case "admin":
                return "Administrador"
            case "user":
                return "Colaborador"
            default:
                return role // Fallback to the original value
        }
    }

    const userInfoItems = [
        { icon: IdCard, label: "ID del Usuario", value: user.id },
        { icon: Mail, label: "Email", value: user.email },
        { icon: Shield, label: "Rol", value: getRoleDisplayName(user.role) },
    ]

    return (
        <MainLayout>
            <div className="flex-1 overflow-auto px-4 py-6 sm:px-8">
                {/* Header con botones de navegación */}
                <div className="flex w-full items-center justify-between rounded-lg bg-white px-6 py-4 shadow-md">
                    <Button
                        onClick={() => navigate(-1)}
                        className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Volver
                    </Button>
                    <Button
                        onClick={() => navigate("/rraa/user/password")}
                        className="rounded-md px-4 py-2 font-medium text-white transition-colors"
                    >
                        Cambiar Contraseña
                    </Button>
                </div>

                {/* Contenido principal */}
                <div className="mx-auto max-w-4xl px-4 py-8">
                    <h1 className="text-main-color mb-6 text-2xl font-bold">
                        User Profile
                    </h1>

                    <div className="card-container mb-8 rounded-lg bg-white p-6 shadow">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="bg-green flex h-16 w-16 items-center justify-center rounded-full text-white">
                                <User className="h-8 w-8" />
                            </div>

                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) =>
                                                setEditedName(e.target.value)
                                            }
                                            className="input-field w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter your name"
                                            autoFocus
                                        />
                                        <div className="flex gap-1">
                                            <Button
                                                onClick={handleSave}
                                                disabled={
                                                    updateUserMutation.isLoading
                                                }
                                            >
                                                {updateUserMutation.isLoading ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Save className="h-5 w-5" />
                                                        <span className="hidden sm:inline">
                                                            Guardar
                                                        </span>
                                                    </>
                                                )}
                                            </Button>
                                            <button
                                                onClick={handleCancelEditing}
                                                disabled={
                                                    updateUserMutation.isLoading
                                                }
                                                className="rounded-md bg-gray-300 p-2 text-black transition-colors hover:bg-gray-400 disabled:opacity-50"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-main-color text-xl font-semibold">
                                                {editedName || "No Name Set"}
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleStartEditing}
                                            className="hover:text-green rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-200"
                                            title="Editar nombre"
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {updateUserMutation.error && (
                            <p className="mt-2 text-sm text-red-500">
                                {updateUserMutation.error.message ||
                                    "Error updating profile"}
                            </p>
                        )}

                        <div className="grid gap-4 md:grid-cols-3">
                            {userInfoItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg bg-gray-50 p-4"
                                >
                                    <div className="mb-2 flex items-center gap-2 text-green-500">
                                        <item.icon className="h-5 w-5" />
                                        <span className="text-sm font-medium">
                                            {item.label}
                                        </span>
                                    </div>
                                    <p className="font-medium text-gray-900">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default UserProfile
