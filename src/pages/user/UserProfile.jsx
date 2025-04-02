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
} from "lucide-react"


import { useUpdateUser } from "../../hooks/data/users/useUserHooks"

import { useNavigate } from "react-router-dom"
import { toast } from "../../components/ui/sonner"
import MainLayout from "../../components/layout/MainLayout"
import useAuthStore from "../../store/modules/authStore"

const UserProfile = () => {
    const navigate = useNavigate()
    const {
        userId,
        email,
        role,
        fullName: authFullName,
    } = useAuthStore((state) => state)

    const [editedName, setEditedName] = useState(authFullName || "")
    const [isEditing, setIsEditing] = useState(false)

    const updateUserMutation = useUpdateUser(userId)

    useEffect(() => {
        setEditedName(authFullName || "")
    }, [authFullName])

    const handleStartEditing = () => setIsEditing(true)
    const handleCancelEditing = () => {
        setEditedName(authFullName || "")
        setIsEditing(false)
    }

    const handleSave = () => {
        if (!editedName.trim()) {
            toast.error("Name cannot be empty")
            return
        }
        if (editedName.trim() === authFullName) {
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

    if (!userId) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="text-green h-10 w-10 animate-spin" />
            </div>
        )
    }

    const userInfoItems = [
        { icon: IdCard, label: "User ID", value: userId },
        { icon: Mail, label: "Email", value: email },
        { icon: Shield, label: "Role", value: role },
    ]

    return (
        <MainLayout>
            <div>
                <div className="flex-1 overflow-auto px-4 py-6 sm:px-8">
                    {/* Header con botones de navegación */}
                    <div className="mb-4 flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                            Volver
                        </button>
                        <button
                            onClick={() => navigate("/user/password")}
                            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                        >
                            Cambiar Contraseña
                        </button>
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
                                                    setEditedName(
                                                        e.target.value
                                                    )
                                                }
                                                className="input-field w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter your name"
                                                autoFocus
                                            />
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={handleSave}
                                                    disabled={
                                                        updateUserMutation.isLoading
                                                    }
                                                    className="bg-green flex items-center gap-2 rounded-md p-2 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
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
                                                </button>
                                                <button
                                                    onClick={
                                                        handleCancelEditing
                                                    }
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
                                                    {editedName ||
                                                        "No Name Set"}
                                                </h2>
                                                <p className="text-sm text-gray-500">
                                                    {email}
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
            </div>
        </MainLayout>
    )
}

export default UserProfile
