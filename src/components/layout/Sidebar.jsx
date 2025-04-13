// src/components/layout/Sidebar.jsx
import { useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Clock, LogOut, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import UserAvatar from "../ui/UserAvatar"
import SidebarNavItem from "../ui/SidebarNavItem"
import AdminSubmenu from "../ui/AdminSubmenu"
import useAuthStore from "../../store/modules/authStore"

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    // Cerrar el sidebar al navegar en dispositivos móviles
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)")
        if (mediaQuery.matches) {
            setIsOpen(false)
        }
    }, [location.pathname, setIsOpen])

    // Detección simple para móviles
    const isMobile = window.innerWidth < 768

    // Contenido del sidebar (para evitar repetir código)
    const sidebarContent = (
        <>
            {/* Encabezado / Logo */}
            <div className="flex h-16 items-center justify-center border-b border-white border-opacity-20 p-4">
                {isOpen ? (
                    <h1 className="text-xl font-bold">
                        {user.role === "admin"
                            ? "Administrador de Tareas"
                            : "Mis Tareas"}
                    </h1>
                ) : (
                    <div className="hidden h-8 w-8 items-center justify-center md:flex">
                        <span className="text-xl font-bold">AT</span>
                    </div>
                )}
            </div>

            {/* Sección de perfil de usuario */}
            <div
                className={`border-b border-white border-opacity-20 px-4 py-6 ${
                    isOpen
                        ? "flex items-center space-x-4"
                        : "flex justify-center"
                }`}
            >
                <Link to="/user/user-profile">
                    <UserAvatar
                        name={user?.full_name || "Usuario"}
                        imageUrl={user?.avatar || null}
                        size="md"
                    />
                </Link>
                {isOpen && (
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                            {user?.full_name || "Usuario"}
                        </p>
                        <p className="truncate text-xs text-white/70">
                            {user?.email || "correo@ejemplo.com"}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="inline-block rounded bg-blue-600 px-2 py-0.5 text-[11px] font-semibold uppercase leading-none text-white">
                                {user.role === "admin"
                                    ? "Administrador"
                                    : "Colaborador"}
                            </span>
                        </div>
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
                    {user.role === "admin" && (
                        <AdminSubmenu showLabels={isOpen} />
                    )}
                </ul>
            </nav>

            {/* Pie del sidebar con botón de logout */}
            <div className="mt-auto border-t border-white border-opacity-20 p-4">
                <button
                    className="nav-item group w-full text-left transition-colors duration-200 hover:bg-red-500/20"
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
        </>
    )

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

            {isMobile ? (
                <AnimatePresence>
                    {isOpen && (
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.3 }}
                            className="fixed z-30 flex h-full w-64 flex-col bg-mainColor text-white shadow-lg"
                            aria-label="Main navigation"
                        >
                            {sidebarContent}
                        </motion.aside>
                    )}
                </AnimatePresence>
            ) : (
                // Versión estática para escritorio (versión expandida o colapsada según 'isOpen')
                <aside
                    className={`fixed z-30 flex h-full flex-col bg-mainColor text-white shadow-lg transition-all duration-300 md:relative ${
                        isOpen
                            ? "w-64 translate-x-0"
                            : "w-0 -translate-x-full md:w-20 md:translate-x-0"
                    }`}
                    aria-label="Main navigation"
                >
                    {sidebarContent}
                </aside>
            )}
        </>
    )
}

export default Sidebar
