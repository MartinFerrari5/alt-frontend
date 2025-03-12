// /src/pages/user/UserProfile.jsx
import { useState, useEffect } from "react"
import Button from "../../components/Button"
import { useGetUsers, useUpdateUser } from "../../hooks/data/users/useUserHooks"
import { useNavigate, useParams } from "react-router-dom"
import Sidebar from "../../components/Sidebar"

const UserProfilePage = () => {
  // Se obtiene el id del usuario desde la URL
  const { id } = useParams()
  if(!id){
   null
  }
    const navigate = useNavigate()
    console.log("id: ",id)
  const { data: user, isLoading, error } = useGetUsers(id)
  const updateUserMutation = useUpdateUser(id)
  console.log("user: ",user)

  // Estados para el nombre y para almacenar el valor original
  const [fullName, setFullName] = useState("")
  const [originalFullName, setOriginalFullName] = useState("")
  const [isEditingName, setIsEditingName] = useState(false)

  // Actualiza los estados cuando se obtiene la información del usuario
  useEffect(() => {
    if (user) {
      setFullName(user.full_name)
      setOriginalFullName(user.full_name)
    }
  }, [user])

  const handleSave = () => {
    // Si el campo fullName quedó vacío, se conserva el valor original
    const newFullName = fullName.trim() === "" ? originalFullName : fullName
    // Solo se envía el campo si se modificó
    if (newFullName === originalFullName) {
      setIsEditingName(false)
      return
    }
    const payload = { full_name: newFullName }

    updateUserMutation.mutate(payload, {
      onSuccess: () => {
        // Actualiza el valor original y sale del modo edición
        setOriginalFullName(newFullName)
        setIsEditingName(false)
      },
      onError: () => {
        // Aquí se puede manejar el error, por ejemplo, mostrando una notificación
      },
    })
  }

  if (isLoading) {
    return <div>Cargando información del usuario...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!user) {
    return <div>No se encontró información para este usuario.</div>
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="hidden lg:block lg:w-72">
        <Sidebar />
      </div>
      <div  className="flex-1 overflow-auto px-4 py-6 sm:px-8">
                  <Button onClick={() => navigate(-1)}>Volver</Button>
        <div className="p-6">
          <h1 className="text-2xl font-bold my-4">Mi Perfil</h1>
          <div className="bg-white shadow rounded p-4">
            {/* Se muestran los datos del usuario */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">ID:</label>
              <span>{user.id}</span>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Role:</label>
              <span>{user.role}</span>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Fecha de Creación:</label>
              <span>{new Date(user.created_at).toLocaleString()}</span>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Nombre Completo:</label>
              {isEditingName ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border rounded p-2"
                  />
                  <Button onClick={handleSave} className="ml-2">
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
