// src/components/Users/UsersItem.jsx
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { TrashIcon, DetailsIcon, LoaderIcon } from "../../../assets/icons"
import { useDeleteUser } from "../../../hooks/data/use-delete-user"

import Button from "../../Button"
import useAuthStore from "../../../store/authStore"

const UsersItem = ({ user }) => {
    const role = useAuthStore((state) => state.role)
    const { mutate: deleteUser, isPending: deleteUserIsLoading } =
        useDeleteUser(user.id)

    const handleDeleteClick = () => {
        deleteUser(undefined, {
            onSuccess: () => toast.success("¡Usuario eliminado exitosamente!"),
            onError: (error) => {
                console.error("🔴 Error al eliminar usuario:", error)
                toast.error("Error al eliminar el usuario. Inténtalo de nuevo.")
            },
        })
    }

    return (
        <tr className="border-b bg-white">
            <td className="px-6 py-4">{user.full_name}</td>
            <td className="px-6 py-4">{user.email}</td>
            <td className="px-6 py-4">{user.role}</td>
            <td className="flex items-center gap-2 px-6 py-4">
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
                <Link to={`/user/${user.id}`}>
                    <DetailsIcon />
                </Link>
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
