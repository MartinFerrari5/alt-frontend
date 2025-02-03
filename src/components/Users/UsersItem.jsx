// src/components/Users/UsersItem.jsx
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { TrashIcon, DetailsIcon, LoaderIcon } from "../../assets/icons"
import { useDeleteUser } from "../../hooks/data/use-delete-user"
// import { useUpdateUser } from "../../hooks/data/use-update-user";
import { useAuth } from "../../components/auth/AuthContext"
import Button from "../Button"

const UsersItem = ({ user }) => {
    const { role } = useAuth()
    const { mutate: deleteUser, isPending: deleteUserIsLoading } =
        useDeleteUser(user.id)
    // const { mutate: updateUser, isPending: updateUserIsLoading } = useUpdateUser(user.id);

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
        <div className="flex items-center justify-between gap-2 rounded-lg bg-opacity-10 px-4 py-3 text-sm">
            <div>
                {user.full_name} - {user.email} - {user.role}
            </div>
            <div className="flex items-center gap-2">
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
            </div>
        </div>
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
