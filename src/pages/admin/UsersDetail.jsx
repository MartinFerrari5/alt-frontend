// /src/pages/admin/UsersDetail.jsx
// /src/pages/admin/UsersDetail.jsx
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaEdit } from "react-icons/fa"
import Button from "../../components/Button"
import { useGetUsers, useUpdateUser } from "../../hooks/data/users/useUserHooks"

const UsersDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: user, isLoading, error } = useGetUsers(id)
  const updateUserMutation = useUpdateUser(id)

  // Estados para controlar la edición de email y rol
  const [editingEmail, setEditingEmail] = useState(false)
  const [editingRole, setEditingRole] = useState(false)
  const [emailValue, setEmailValue] = useState("")
  const [roleValue, setRoleValue] = useState("")

  // Debido a que el hook puede devolver un array con el usuario, obtenemos el primer elemento
  const userData = Array.isArray(user) ? user[0] : user

  // Inicializamos los valores locales con la información del usuario
  useEffect(() => {
    if (userData) {
      setEmailValue(userData.email)
      setRoleValue(userData.role)
    }
  }, [userData])

  const handleSave = () => {
    const payload = {
      email: emailValue,
      role: roleValue,
    }

    updateUserMutation.mutate(payload, {
      onSuccess: () => {
        // Opcional: mostrar una notificación de éxito y desactivar el modo edición
        setEditingEmail(false)
        setEditingRole(false)
      },
      onError: () => {
        // Manejo de error (por ejemplo, mostrar una notificación)
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
    <div className="p-6">
      <Button onClick={() => navigate(-1)}>Volver</Button>
      <h1 className="text-2xl font-bold my-4">Detalle del Usuario</h1>
      <div className="bg-white shadow rounded p-4">
        <p>
          <strong>Nombre Completo:</strong> {userData.full_name}
        </p>

        {/* Campo Email con opción a editar */}
        <div className="flex items-center mt-2">
          <strong>Email:</strong>
          {editingEmail ? (
            <input
              type="text"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              className="ml-2 border rounded p-1"
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
        <div className="flex items-center mt-2">
          <strong>Rol:</strong>
          {editingRole ? (
            <select
              value={roleValue}
              onChange={(e) => setRoleValue(e.target.value)}
              className="ml-2 border rounded p-1"
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

        {/* Botones para guardar o cancelar cambios si se está editando */}
        {(editingEmail || editingRole) && (
          <div className="mt-4 flex gap-3">
            <Button onClick={handleSave}>Guardar cambios</Button>
            <Button onClick={handleCancel} color="ghost">
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersDetail
