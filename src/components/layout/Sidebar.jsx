// src/components/layout/Sidebar.jsx
import { useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Clock, LogOut, User } from "lucide-react"
import UserAvatar from "../ui/UserAvatar"
import SidebarNavItem from "../ui/SidebarNavItem"
import AdminSubmenu from "../ui/AdminSubmenu"
import useAuthStore from "../../store/modules/authStore"

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation()
    const user = useAuthStore((state) => state.user) // Ajusta según tu store
    const role = useAuthStore((state) => state.role)
    const logout = useAuthStore((state) => state.logout)
    const navigate = useNavigate()
    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    // Cerrar el sidebar al navegar en dispositivos móviles
    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsOpen(false)
        }
    }, [location.pathname, setIsOpen])

    return (
        <>
            {/* Overlay para móviles cuando el sidebar está abierto */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed z-30 flex h-full flex-col bg-mainColor text-white shadow-lg transition-all duration-300 md:relative ${isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-20 md:translate-x-0"}`}
                aria-label="Main navigation"
            >
                {/* Encabezado / Logo */}
                <div className="flex h-16 items-center justify-center border-b border-white border-opacity-20 p-4">
                    {isOpen ? (
                        <h1 className="text-xl font-bold">
                            Administrador de Tareas
                        </h1>
                    ) : (
                        <div className="hidden h-8 w-8 items-center justify-center md:flex">
                            <span className="text-xl font-bold">AT</span>
                        </div>
                    )}
                </div>

                {/* Sección de perfil de usuario */}
                <div
                    className={`border-b border-white border-opacity-20 px-4 py-6 ${isOpen ? "flex items-center space-x-4" : "flex justify-center"}`}
                >
                    <UserAvatar
                        name={user?.name || "Usuario"}
                        imageUrl={user?.avatar || null}
                        size="md"
                    />
                    {isOpen && (
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {user?.name || "Usuario"}
                            </p>
                            <p className="truncate text-xs text-white/70">
                                {user?.email || "correo@ejemplo.com"}
                            </p>
                            <Link
                                to="/user/user-profile"
                                className="text-xs text-greenApp transition-colors hover:text-darkGreen2"
                            >
                                Ver Perfil
                            </Link>
                        </div>
                    )}
                </div>

                {/* Menú de navegación */}
                <nav className="flex-1 overflow-y-auto py-6">
                    <ul className="space-y-2 px-2">
                        <SidebarNavItem
                            to="/"
                            icon={Home}
                            label="Inicio"
                            isActive={location.pathname === "/"}
                            showLabel={isOpen}
                        />
                        <SidebarNavItem
                            to="/history"
                            icon={Clock}
                            label="Historial"
                            isActive={location.pathname === "/history"}
                            showLabel={isOpen}
                        />

                        {/* En modo colapsado se muestra el enlace al perfil */}
                        {!isOpen && (
                            <SidebarNavItem
                                to="/user/user-profile"
                                icon={User}
                                label="Perfil"
                                isActive={
                                    location.pathname === "/user/user-profile"
                                }
                                showLabel={false}
                            />
                        )}

                        {/* Menú de administrador, solo para usuarios admin */}
                        {role === "admin" && (
                            <AdminSubmenu showLabels={isOpen} />
                        )}
                    </ul>
                </nav>

                {/* Pie del sidebar con botón de logout */}
                <div className="mt-auto border-t border-white border-opacity-20 p-4">
                    <button
                        className="nav-item group w-full text-left hover:bg-red-500/20"
                        aria-label="Cerrar sesión"
                        onClick={handleLogout}
                    >
                        <LogOut
                            size={20}
                            className="transition-colors group-hover:text-red-400"
                        />
                        {isOpen && (
                            <span className="transition-colors group-hover:text-red-400">
                                Cerrar sesión
                            </span>
                        )}
                    </button>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
