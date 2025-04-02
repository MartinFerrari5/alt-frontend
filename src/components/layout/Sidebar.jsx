// src/components/layout/Sidebar.jsx
import { useState, useCallback } from "react"
import { FaHome, FaUndoAlt } from "react-icons/fa"
import useAuthStore from "../../store/authStore"
import UserDetails from "../ui/UserDetails"
import SidebarButton from "../ui/SidebarButton"
import AdminDropdown from "../ui/AdminDropdown"
import HamburgerButton from "../ui/HamburgerButton"
import LogoutButton from "../auth/LogoutButton"

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const role = useAuthStore((state) => state.role)

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen((prev) => !prev)
    }, [])

    return (
        <div className="relative flex h-screen">
            <div
                className={`fixed left-0 top-0 z-50 flex h-full w-72 min-w-72 transform flex-col justify-between bg-white transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
            >
                <div>
                    <div className="space-y-4 px-8 py-6">
                        <h1 className="text-xl font-semibold text-brand-custom-green">
                            Administrador de Tareas
                        </h1>
                        <UserDetails />
                    </div>
                    <div className="flex flex-col gap-2 p-2">
                        <SidebarButton to="/rraa">
                            <FaHome /> Inicio
                        </SidebarButton>
                        <SidebarButton to="/rraa/history">
                            <FaUndoAlt /> Historial
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
                className={`flex-1 transition-opacity ${isSidebarOpen ? "pointer-events-none opacity-50" : "opacity-100"}`}
                onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
            ></div>
        </div>
    )
}

export default Sidebar
