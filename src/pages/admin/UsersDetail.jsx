import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaEdit } from "react-icons/fa"
import Button from "../../components/Button"
import { useGetUsers, useUpdateUser } from "../../hooks/data/users/useUserHooks"
import Sidebar from "../../components/Sidebar"

const UsersDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: user, isLoading, error } = useGetUsers(id)
    const updateUserMutation = useUpdateUser(id)

    // Estados para controlar la edición y los valores actuales
    const [editingEmail, setEditingEmail] = useState(false)
    const [editingRole, setEditingRole] = useState(false)
    const [emailValue, setEmailValue] = useState("")
    const [roleValue, setRoleValue] = useState("")

    // Estados para almacenar los valores originales
    const [originalEmail, setOriginalEmail] = useState("")
    const [originalRole, setOriginalRole] = useState("")

    // Obtenemos el usuario (si la respuesta es un array, tomamos el primer elemento)
    const userData = Array.isArray(user) ? user[0] : user

    useEffect(() => {
        // Si existe userData y no se está editando, actualizamos el estado solo si los valores difieren
        if (userData && !editingEmail && !editingRole) {
            if (emailValue !== userData.email || roleValue !== userData.role) {
                setEmailValue(userData.email)
                setRoleValue(userData.role)
                setOriginalEmail(userData.email)
                setOriginalRole(userData.role)
            }
        }
    }, [userData, editingEmail, editingRole, emailValue, roleValue])

    const handleSave = () => {
        const payload = {}
        // Solo se agregan al payload los campos que hayan cambiado
        if (emailValue !== originalEmail) payload.email = emailValue
        if (roleValue !== originalRole) payload.role = roleValue

        // Si no hay cambios, no se realiza la petición
        if (Object.keys(payload).length === 0) return

        updateUserMutation.mutate(payload, {
            onSuccess: () => {
                setEditingEmail(false)
                setEditingRole(false)
                // Actualizamos los valores originales tras el guardado
                setOriginalEmail(emailValue)
                setOriginalRole(roleValue)
            },
            onError: () => {
                // Manejo de error (por ejemplo, mostrar notificación)
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

    if (isLoading) {
        return <div>Cargando información del usuario...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    if (!userData) {
        return <div>No se encontró información para este usuario.</div>
    }

    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            <div className="hidden lg:block lg:w-72">
                <Sidebar />
            </div>
            <div className="flex-1 overflow-auto px-4 py-6 sm:px-8">
                <Button onClick={() => navigate(-1)}>Volver</Button>
                <div>
                    <h1 className="my-4 text-2xl font-bold">
                        Detalle del Usuario
                    </h1>
                    <div className="rounded bg-white p-4 shadow">
                        <p>
                            <strong>Nombre Completo:</strong>{" "}
                            {userData.full_name}
                        </p>

                        {/* Campo Email con opción a editar */}
                        <div className="mt-2 flex items-center">
                            <strong>Email:</strong>
                            {editingEmail ? (
                                <input
                                    type="text"
                                    value={emailValue}
                                    onChange={(e) =>
                                        setEmailValue(e.target.value)
                                    }
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

                        {/* Campo Rol con opción a editar */}
                        <div className="mt-2 flex items-center">
                            <strong>Rol:</strong>
                            {editingRole ? (
                                <select
                                    value={roleValue}
                                    onChange={(e) =>
                                        setRoleValue(e.target.value)
                                    }
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

                        {/* Botones para guardar o cancelar cambios */}
                        {(editingEmail || editingRole) && (
                            <div className="mt-4 flex gap-3">
                                <Button onClick={handleSave}>
                                    Guardar cambios
                                </Button>
                                <Button onClick={handleCancel} color="ghost">
                                    Cancelar
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersDetail
