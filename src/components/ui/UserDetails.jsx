// src/components/ui/UserDetails.jsx
import { NavLink } from "react-router-dom"
import useAuthStore from "../../store/modules/authStore"

const UserDetails = () => {
    const fullNameFromStore = useAuthStore((state) => state.fullName)
    const userId = useAuthStore((state) => state.userId)

    if (!userId) return null
    return (
        <NavLink
            to={`/user/user-profile`}
            className="hover:bg-brand-custom-green flex items-center rounded-full transition-colors"
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
