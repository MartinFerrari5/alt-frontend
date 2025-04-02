// src/components/ui/UserDetails.jsx
import { NavLink } from "react-router-dom"
import useAuthStore from "../../store/authStore"

const UserDetails = () => {
    const fullNameFromStore = useAuthStore((state) => state.fullName)
    const userId = useAuthStore((state) => state.userId)

    if (!userId) return null
    return (
        <NavLink
            to={`/rraa/user/user-profile`}
            className="flex items-center rounded-full transition-colors hover:bg-brand-custom-green"
        >
            <img
                className="h-10 w-10 rounded-full"
                src="/src/assets/icons/usuario.png"
                alt={fullNameFromStore}
            />
            <div className="font-medium">
                <h2>{fullNameFromStore}</h2>
            </div>
        </NavLink>
    )
}

export default UserDetails
