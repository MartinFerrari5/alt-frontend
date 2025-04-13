// src/components/Users/UsersItem.jsx
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"

const UsersItem = ({ user }) => {
    const navigate = useNavigate()

    const handleRowClick = () => {
        navigate(`/admin/users/${user.id}`)
    }

    // Función para obtener el nombre a mostrar del rol
    const getRoleDisplayName = (role) => {
        switch (role) {
            case "admin":
                return "Administrador"
            case "user":
                return "Colaborador"
            default:
                return role
        }
    }

    return (
        <tr
            onClick={handleRowClick}
            className="cursor-pointer border-b border-gray-200 bg-white hover:bg-gray-50"
        >
            <td className="px-4 py-5">{user.full_name}</td>
            <td className="px-4 py-5">{user.email}</td>
            <td className="px-4 py-5">{getRoleDisplayName(user.role)}</td>
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
