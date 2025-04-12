// src/components/ui/UserDetails.jsx
import { NavLink } from "react-router-dom"
import useAuthStore from "../../store/modules/authStore"

const UserDetails = () => {
    const user = useAuthStore((state) => state.user)

    if (!user) return null
    return (
        <NavLink
            to={`/rraa/user/user-profile`}
            className="hover:bg-brand-custom-green flex items-center rounded-full transition-colors"
        >
            <img
                className="h-10 w-10 rounded-full"
                src="/src/assets/icons/usuario.png"
                alt={user.full_name}
            />
            <div className="font-medium">
                <h2>{user.full_name}</h2>
            </div>
        </NavLink>
    )
}

export default UserDetails
