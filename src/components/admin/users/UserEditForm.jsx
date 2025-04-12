import { useState, useEffect } from "react"
import { Loader2, Save } from "lucide-react"
import { FaEdit } from "react-icons/fa"
import Button from "../../Button"
import { toast } from "../../../components/ui/sonner"

const UserEditForm = ({ user, onSave }) => {
    // Se utiliza sólo el rol del usuario
    const initialRole = user.role || "user"
    const [role, setRole] = useState(initialRole)
    const [editingRole, setEditingRole] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Sincroniza el estado local con los datos del usuario
    useEffect(() => {
        setRole(user.role || "user")
        setEditingRole(false)
    }, [user])

    const roles = [
        { id: "user", label: "User" },
        { id: "admin", label: "Administrator" },
        // { id: "manager", label: "Task Manager" },
    ]

    const handleSave = async () => {
        if (role === user.role) {
            toast.info("No changes to save")
            setEditingRole(false)
            return
        }

        setIsSubmitting(true)
        try {
            // Simula un retardo en la llamada a la API
            await new Promise((resolve) => setTimeout(resolve, 800))
            const updatedUser = { ...user, role }
            onSave(updatedUser)
            toast.success("User updated successfully")
            setEditingRole(false)
        } catch (error) {
            toast.error("Failed to update user: " + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const cancelEditing = () => {
        setRole(user.role || "user")
        setEditingRole(false)
    }

    return (
        <div className="space-y-4 rounded bg-white p-4 shadow">
            <div>
                <label className="text-main-color block text-sm font-medium">
                    Full Name:
                </label>
                <div className="flex items-center">
                    <span className="mr-2">{user.full_name || user.name}</span>
                </div>
            </div>

            <div>
                <label className="text-main-color block text-sm font-medium">
                    Email:
                </label>
                <div className="flex items-center">
                    <span className="mr-2">{user.email}</span>
                </div>
            </div>

            <div>
                <label className="text-main-color block text-sm font-medium">
                    Role:
                </label>
                {editingRole ? (
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="mt-1 w-full rounded border p-2"
                    >
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <div className="flex items-center">
                        <span className="mr-2">{role}</span>
                        <button
                            onClick={() => setEditingRole(true)}
                            title="Edit role"
                        >
                            <FaEdit className="cursor-pointer" />
                        </button>
                    </div>
                )}
            </div>

            {editingRole && (
                <div className="flex gap-3 pt-2">
                    <Button onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                <span>Save Changes</span>
                            </>
                        )}
                    </Button>
                    <Button onClick={cancelEditing} color="ghost">
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    )
}

export default UserEditForm
