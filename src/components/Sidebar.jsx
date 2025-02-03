import { useState } from "react"

import { HomeIcon, TasksIcon } from "../assets/icons"
import LogoutButton from "./auth/LogoutButton"
import HamburgerButton from "./HamburgerButton"
import SidebarButton from "./SidebarButton"

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div className="relative flex h-screen">
            {/* Sidebar */}
            <div
                className={`absolute z-50 flex h-full w-72 min-w-72 transform flex-col justify-between bg-white transition-transform lg:relative lg:translate-x-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Sección superior */}
                <div>
                    <div className="space-y-4 px-8 py-6">
                        <h1 className="text-xl font-semibold text-brand-custom-green">
                            Administrador de Tareas
                        </h1>
                        <p>
                            Un simple{" "}
                            <span className="text-brand-custom-green">
                                organizador de tareas
                            </span>
                            .
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 p-2">
                        <SidebarButton to="/">
                            <HomeIcon />
                            Inicio
                        </SidebarButton>
                        <SidebarButton to="/tasks">
                            <TasksIcon />
                            Mis Tareas
                        </SidebarButton>
                        <SidebarButton to="/users">
                            <TasksIcon />
                            Users
                        </SidebarButton>
                    </div>
                </div>

                {/* Botón de cerrar sesión */}
                <div className="p-4">
                    <LogoutButton />
                </div>
            </div>

            {/* Botón de hamburguesa */}
            <div className="p-4 lg:hidden">
                <HamburgerButton onClick={toggleSidebar} />
            </div>

            {/* Contenido principal (opcional) */}
            <div
                className={`flex-1 transition-opacity ${
                    isSidebarOpen
                        ? "pointer-events-none opacity-50"
                        : "opacity-100"
                }`}
                onClick={() => isSidebarOpen && setIsSidebarOpen(false)} // Cierra el sidebar al hacer clic fuera de él
            >
                {/* Aquí iría el contenido principal de la página */}
            </div>
        </div>
    )
}

export default Sidebar
