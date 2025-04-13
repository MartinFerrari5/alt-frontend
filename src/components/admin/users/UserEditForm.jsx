import { useState, useEffect } from "react"
import { Save, X } from "lucide-react"
import { FaEdit } from "react-icons/fa"
import Button from "../../Button"
import { toast } from "../../../components/ui/sonner"
import { LoadingSpinner } from "../../../util/LoadingSpinner"

const UserEditForm = ({ user, onSave }) => {
    const initialRole = user.role || "user"
    const [role, setRole] = useState(initialRole)
    const [editingRole, setEditingRole] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setRole(user.role || "user")
        setEditingRole(false)
    }, [user])

    const roles = [
        { id: "user", label: "Colaborador" },
        { id: "admin", label: "Administrador" },
        // { id: "manager", label: "Gestor de Tareas" },
    ]

    const getRoleDisplayName = (roleId) => {
        const foundRole = roles.find((r) => r.id === roleId)
        return foundRole ? foundRole.label : roleId
    }

    const handleSave = async () => {
        if (role === user.role) {
            toast.info("No hay cambios para guardar")
            setEditingRole(false)
            return
        }
        setIsSubmitting(true)
        try {
            // Simular llamada API
            await new Promise((resolve) => setTimeout(resolve, 800))
            const updatedUser = { ...user, role }
            await onSave(updatedUser)
            toast.success("Usuario actualizado correctamente")
            setEditingRole(false)
        } catch (error) {
            console.error("Error al actualizar el usuario:", error)
            toast.error(
                "Error al actualizar el usuario: " +
                    (error.message || "Error desconocido")
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const cancelEditing = () => {
        setRole(user.role || "user")
        setEditingRole(false)
    }

    return (
        <form
            className="space-y-6 rounded bg-white p-6 md:p-8"
            onSubmit={(e) => {
                e.preventDefault()
                handleSave()
            }}
        >
            <fieldset className="space-y-4">
                <legend className="sr-only">Información del Usuario</legend>

                <div>
                    <label
                        htmlFor="full-name"
                        className="text-main-color block text-sm font-medium"
                    >
                        Nombre Completo:
                    </label>
                    <p id="full-name" className="mt-1 text-base text-gray-700">
                        {user.full_name || user.name}
                    </p>
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="text-main-color block text-sm font-medium"
                    >
                        Correo Electrónico:
                    </label>
                    <p id="email" className="mt-1 text-base text-gray-700">
                        {user.email}
                    </p>
                </div>

                <div>
                    <label
                        htmlFor="role"
                        className="text-main-color block text-sm font-medium"
                    >
                        Rol:
                    </label>
                    {editingRole ? (
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 block w-full rounded border p-2 text-base focus:border-blue-500 focus:ring-blue-500"
                            disabled={isSubmitting}
                        >
                            {roles.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="flex items-center">
                            <p
                                id="role"
                                className="mr-2 text-base text-gray-700"
                            >
                                {getRoleDisplayName(role)}
                            </p>
                            <button
                                type="button"
                                onClick={() => setEditingRole(true)}
                                title="Editar rol"
                                className="text-gray-500 hover:text-blue-600"
                            >
                                <FaEdit className="cursor-pointer" />
                            </button>
                        </div>
                    )}
                </div>
            </fieldset>

            {editingRole && (
                <div className="flex flex-col items-end gap-4 pt-4 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        onClick={cancelEditing}
                        variant="outline"
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                    >
                        <X className="h-4 w-4" />
                        <span>Cancelar</span>
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                <span>Guardar</span>
                            </>
                        )}
                    </Button>
                </div>
            )}
        </form>
    )
}

export default UserEditForm
