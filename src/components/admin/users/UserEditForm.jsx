import { useState, useEffect } from "react"
import { Loader2, Save } from "lucide-react"
import { FaEdit } from "react-icons/fa"
import Button from "../../Button"
import { toast } from "../../../components/ui/sonner"

const UserEditForm = ({ user, onSave }) => {
    // Si el objeto usuario tiene full_name o name, se utiliza ese valor
    const initialName = user.full_name || user.name || ""
    const [name, setName] = useState(initialName)
    const [email, setEmail] = useState(user.email || "")
    const [role, setRole] = useState(user.role || "user")

    // Banderas para activar la edición de cada campo
    const [editingName, setEditingName] = useState(false)
    const [editingEmail, setEditingEmail] = useState(false)
    const [editingRole, setEditingRole] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)

    // Actualiza el estado local si cambian los datos del usuario
    useEffect(() => {
        setName(user.full_name || user.name || "")
        setEmail(user.email || "")
        setRole(user.role || "user")
        setEditingName(false)
        setEditingEmail(false)
        setEditingRole(false)
    }, [user])

    const roles = [
        { id: "user", label: "User" },
        { id: "admin", label: "Administrator" },
        // { id: "manager", label: "Task Manager" },
    ]

    const handleSave = async () => {
        if (!name.trim() || !email.trim()) {
            toast.error("Name and email are required")
            return
        }

        // Prepara el payload sólo con los campos modificados
        const payload = {}
        if (name !== (user.full_name || user.name)) payload.name = name
        if (email !== user.email) payload.email = email
        if (role !== user.role) payload.role = role

        if (Object.keys(payload).length === 0) {
            toast.info("No changes to save")
            cancelEditing()
            return
        }

        setIsSubmitting(true)
        try {
            // Simula un retardo de llamada API
            await new Promise((resolve) => setTimeout(resolve, 800))
            const updatedUser = { ...user, ...payload }
            onSave(updatedUser)
            toast.success("User updated successfully")
            cancelEditing()
        } catch (error) {
            toast.error("Failed to update user: " + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const cancelEditing = () => {
        setName(user.full_name || user.name || "")
        setEmail(user.email || "")
        setRole(user.role || "user")
        setEditingName(false)
        setEditingEmail(false)
        setEditingRole(false)
    }

    const anyEditing = editingName || editingEmail || editingRole

    return (
        <div className="space-y-4 rounded bg-white p-4 shadow">
            <div>
                <label className="text-main-color block text-sm font-medium">
                    Full Name:
                </label>
                {editingName ? (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded border p-2"
                    />
                ) : (
                    <div className="flex items-center">
                        <span className="mr-2">{name}</span>
                        <button
                            onClick={() => setEditingName(true)}
                            title="Edit name"
                        >
                            <FaEdit className="cursor-pointer" />
                        </button>
                    </div>
                )}
            </div>

            <div>
                <label className="text-main-color block text-sm font-medium">
                    Email:
                </label>
                {editingEmail ? (
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded border p-2"
                    />
                ) : (
                    <div className="flex items-center">
                        <span className="mr-2">{email}</span>
                        <button
                            onClick={() => setEditingEmail(true)}
                            title="Edit email"
                        >
                            <FaEdit className="cursor-pointer" />
                        </button>
                    </div>
                )}
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

            {anyEditing && (
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
