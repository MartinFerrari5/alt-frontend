// /src/components/admin/users/UserEditForm.jsx
import { useState, useEffect } from "react"
import { FaEdit } from "react-icons/fa"
import Button from "../../Button"

const UserEditForm = ({ userData, updateUser, onUserUpdated }) => {
    const [editingEmail, setEditingEmail] = useState(false)
    const [editingRole, setEditingRole] = useState(false)
    const [emailValue, setEmailValue] = useState("")
    const [roleValue, setRoleValue] = useState("")
    const [originalEmail, setOriginalEmail] = useState("")
    const [originalRole, setOriginalRole] = useState("")

    useEffect(() => {
        if (userData && !editingEmail && !editingRole) {
            setEmailValue(userData.email)
            setRoleValue(userData.role)
            setOriginalEmail(userData.email)
            setOriginalRole(userData.role)
        }
    }, [userData, editingEmail, editingRole])

    const handleSave = () => {
        const payload = {}
        if (emailValue !== originalEmail) payload.email = emailValue
        if (roleValue !== originalRole) payload.role = roleValue
        if (Object.keys(payload).length === 0) return

        updateUser(payload, {
            onSuccess: () => {
                setEditingEmail(false)
                setEditingRole(false)
                setOriginalEmail(emailValue)
                setOriginalRole(roleValue)
                if (onUserUpdated) onUserUpdated()
            },
            onError: () => {
                // Manejo de error (por ejemplo, notificación)
            },
        })
    }

    const handleCancel = () => {
        if (userData) {
            setEmailValue(userData.email)
            setRoleValue(userData.role)
        }
        setEditingEmail(false)
        setEditingRole(false)
    }

    return (
        <div className="rounded bg-white p-4 shadow">
            <p>
                <strong>Nombre Completo:</strong> {userData.full_name}
            </p>
            <div className="mt-2 flex items-center">
                <strong>Email:</strong>
                {editingEmail ? (
                    <input
                        type="text"
                        value={emailValue}
                        onChange={(e) => setEmailValue(e.target.value)}
                        className="ml-2 rounded border p-1"
                    />
                ) : (
                    <span className="ml-2">{userData.email}</span>
                )}
                <button
                    onClick={() => setEditingEmail((prev) => !prev)}
                    className="ml-2"
                    title="Editar email"
                >
                    <FaEdit className="cursor-pointer" />
                </button>
            </div>
            <div className="mt-2 flex items-center">
                <strong>Rol:</strong>
                {editingRole ? (
                    <select
                        value={roleValue}
                        onChange={(e) => setRoleValue(e.target.value)}
                        className="ml-2 rounded border p-1"
                    >
                        <option value="admin">admin</option>
                        <option value="user">user</option>
                    </select>
                ) : (
                    <span className="ml-2">{userData.role}</span>
                )}
                <button
                    onClick={() => setEditingRole((prev) => !prev)}
                    className="ml-2"
                    title="Editar rol"
                >
                    <FaEdit className="cursor-pointer" />
                </button>
            </div>
            {(editingEmail || editingRole) && (
                <div className="mt-4 flex gap-3">
                    <Button onClick={handleSave}>Guardar cambios</Button>
                    <Button onClick={handleCancel} color="ghost">
                        Cancelar
                    </Button>
                </div>
            )}
        </div>
    )
}

export default UserEditForm
