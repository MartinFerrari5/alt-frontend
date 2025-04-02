// src/components/Users/UsersItem.jsx
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { TrashIcon, LoaderIcon } from "../../../assets/icons"
import { useDeleteUser } from "../../../hooks/data/users/useUserHooks"
import Button from "../../Button"
import useAuthStore from "../../../store/authStore"

const UsersItem = ({ user }) => {
    const navigate = useNavigate()
    const role = useAuthStore((state) => state.role)
    const { mutate: deleteUser, isPending: deleteUserIsLoading } =
        useDeleteUser(user.id)

    const handleDeleteClick = (e) => {
        e.stopPropagation() // Evita que se dispare la navegación al hacer click en el botón
        deleteUser(undefined, {
            onSuccess: () => toast.success("¡Usuario eliminado exitosamente!"),
            onError: (error) => {
                console.error("🔴 Error al eliminar usuario:", error)
                toast.error("Error al eliminar el usuario. Inténtalo de nuevo.")
            },
        })
    }

    const handleRowClick = () => {
        navigate(`/rraa/admin/users/${user.id}`)
    }

    return (
        <tr
            onClick={handleRowClick}
            className="cursor-pointer border-b border-gray-200 bg-white hover:bg-gray-50"
        >
            <td className="px-4 py-5">{user.full_name}</td>
            <td className="px-4 py-5">{user.email}</td>
            <td className="px-4 py-5">{user.role}</td>
            <td className="flex gap-2 px-4 py-5 text-right">
                {role === "admin" && (
                    <Button
                        color="ghost"
                        onClick={handleDeleteClick}
                        disabled={deleteUserIsLoading}
                    >
                        {deleteUserIsLoading ? (
                            <LoaderIcon className="animate-spin text-brand-text-gray" />
                        ) : (
                            <TrashIcon className="text-brand-text-gray" />
                        )}
                    </Button>
                )}
            </td>
        </tr>
    )
}

UsersItem.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        full_name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
    }).isRequired,
}

export default UsersItem
