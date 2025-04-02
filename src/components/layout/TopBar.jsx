import { Menu, User } from "lucide-react"
import { Link } from "react-router-dom"

const TopBar = ({ toggleSidebar }) => {
    return (
        <header className="flex h-16 items-center justify-between border-b border-greyStrongBg bg-white px-4 shadow-sm md:px-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="btn-icon"
                    aria-label="Alternar menú"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <h2 className="hidden text-lg font-medium text-mainColor md:block">
                    Panel de Control
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <Link
                    to="/user/user-profile"
                    className="flex items-center gap-2 rounded-full p-2 transition-colors hover:bg-greyBg"
                >
                    <div className="rounded-full bg-greenApp p-1 text-white">
                        <User size={18} />
                    </div>
                    <span className="hidden text-sm font-medium md:block">
                        Mi Perfil
                    </span>
                </Link>
            </div>
        </header>
    )
}

export default TopBar
