// src/components/Sidebar.jsx
import { useState, useCallback } from "react"
import { NavLink } from "react-router-dom"
import LogoutButton from "./auth/LogoutButton"
import HamburgerButton from "./HamburgerButton"
import { tv } from "tailwind-variants"
import useAuthStore from "../store/authStore"
import { FaHome, FaUndoAlt } from "react-icons/fa"
import useSidebarStore from "../store/sidebarStore"

// Estilos reutilizables para los botones de la sidebar
const sidebarStyle = tv({
    base: "flex items-center gap-2 rounded-lg px-6 py-3",
    variants: {
        color: {
            selected:
                "bg-brand-custom-green bg-opacity-15 text-brand-custom-green",
            unselected: "text-brand-dark-blue",
        },
    },
})

const SidebarButton = ({ children, to }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            sidebarStyle({ color: isActive ? "selected" : "unselected" })
        }
    >
        {children}
    </NavLink>
)

// Componente para el menú desplegable de Admin usando Zustand para el estado
const AdminDropdown = () => {
    const { adminDropdownOpen, toggleAdminDropdown } = useSidebarStore()

    return (
        <div className="relative">
            <button
                type="button"
                onClick={toggleAdminDropdown}
                className={`${sidebarStyle({ color: "unselected" })} w-full justify-between`}
            >
                Admin
                <svg
                    className={`ms-3 h-2.5 w-2.5 transition-transform ${
                        adminDropdownOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 9 4-4-4-4"
                    />
                </svg>
            </button>
            <ul
                className={`${
                    adminDropdownOpen ? "block" : "hidden"
                } absolute left-full top-0 z-10 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow-sm`}
            >
                <li>
                    <NavLink
                        to="/admin/management"
                        className={({ isActive }) =>
                            sidebarStyle({
                                color: isActive ? "selected" : "unselected",
                            }) + " block px-4 py-2"
                        }
                    >
                        Gestión
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            sidebarStyle({
                                color: isActive ? "selected" : "unselected",
                            }) + " block px-4 py-2"
                        }
                    >
                        Usuarios
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

// Componente de detalles de usuario
const UserDetails = () => {
    const fullNameFromStore = useAuthStore((state) => state.fullName)
    const userId = useAuthStore((state) => state.userId)

    if (!userId) return null
    return (
        <NavLink
            to={`/user?id=${userId}`}
            className="flex items-center rounded-full transition-colors hover:bg-brand-custom-green"
        >
            <img
                className="h-10 w-10 rounded-full"
                src={"/src/assets/icons//LogoPerfil.png"}
                alt={fullNameFromStore}
            />
            <div className="font-medium">
                <h2>{fullNameFromStore}</h2>
            </div>
        </NavLink>
    )
}

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const role = useAuthStore((state) => state.role)

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen((prev) => !prev)
    }, [])

    return (
        <div className="relative flex h-screen">
            {/* Sidebar fija en la pantalla */}
            <div
                className={`fixed left-0 top-0 z-50 flex h-full w-72 min-w-72 transform flex-col justify-between bg-white transition-transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                <div>
                    <div className="space-y-4 px-8 py-6">
                        <h1 className="text-xl font-semibold text-brand-custom-green">
                            Administrador de Tareas
                        </h1>
                        {/* <UserDetails /> */}
                    </div>
                    <div className="flex flex-col gap-2 p-2">
                        <SidebarButton to="/history">
                            <FaUndoAlt /> Historial
                        </SidebarButton>
                        <SidebarButton to="/">
                            <FaHome /> Inicio
                        </SidebarButton>
                        {role === "admin" && <AdminDropdown />}
                    </div>
                </div>
                <div className="p-4">
                    <LogoutButton />
                </div>
            </div>
            <div className="p-4 lg:hidden">
                <HamburgerButton onClick={toggleSidebar} />
            </div>
            <div
                className={`flex-1 transition-opacity ${
                    isSidebarOpen
                        ? "pointer-events-none opacity-50"
                        : "opacity-100"
                }`}
                onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
            ></div>
        </div>
    )
}

export default Sidebar
