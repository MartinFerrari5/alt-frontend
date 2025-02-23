// src/components/Sidebar.jsx
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { HomeIcon, TasksIcon } from "../assets/icons"
import LogoutButton from "./auth/LogoutButton"
import HamburgerButton from "./HamburgerButton"
import { tv } from "tailwind-variants"
import useAuthStore from "../store/authStore"

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isTasksDropdownOpen, setIsTasksDropdownOpen] = useState(false)
    const role = useAuthStore((state) => state.role)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    const toggleTasksDropdown = () => {
        setIsTasksDropdownOpen(!isTasksDropdownOpen)
    }

    const sidebar = tv({
        base: "flex items-center gap-2 rounded-lg px-6 py-3",
        variants: {
            color: {
                selected:
                    "bg-brand-custom-green bg-opacity-15 text-brand-custom-green",
                unselected: "text-brand-dark-blue",
            },
        },
    })

    return (
        <div className="relative flex h-screen">
            <div
                className={`absolute z-50 flex h-full w-72 min-w-72 transform flex-col justify-between bg-white transition-transform lg:relative lg:translate-x-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
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
                            <HomeIcon /> Inicio
                        </SidebarButton>
                        {/* Dropdown para Tareas */}
                        <div>
                            {role === "user" && (
                                <div className="relative">
                                    <button
                                        onClick={toggleTasksDropdown}
                                        className={
                                            sidebar({
                                                color: isTasksDropdownOpen
                                                    ? "selected"
                                                    : "unselected",
                                            }) + " w-full justify-between"
                                        }
                                    >
                                        <TasksIcon /> Tareas
                                        <svg
                                            className={`ms-3 h-2.5 w-2.5 transition-transform ${
                                                isTasksDropdownOpen
                                                    ? "rotate-180"
                                                    : ""
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
                                    {isTasksDropdownOpen && (
                                        <div className="absolute left-full top-0 z-10 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow-sm">
                                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                                <li>
                                                    <NavLink
                                                        to="/tasks"
                                                        className={({
                                                            isActive,
                                                        }) =>
                                                            sidebar({
                                                                color: isActive
                                                                    ? "selected"
                                                                    : "unselected",
                                                            }) +
                                                            " block px-4 py-2"
                                                        }
                                                    >
                                                        pendientes
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/task/exported"
                                                        className={({
                                                            isActive,
                                                        }) =>
                                                            sidebar({
                                                                color: isActive
                                                                    ? "selected"
                                                                    : "unselected",
                                                            }) +
                                                            " block px-4 py-2"
                                                        }
                                                    >
                                                        Exportadas
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Dropdown de Admin (solo para rol admin) */}
                        {role === "admin" && (
                            <div>
                                <SidebarButton to="/tasks">
                                    <TasksIcon /> Tareas
                                </SidebarButton>
                                <div className="relative">
                                    <button
                                        onClick={toggleDropdown}
                                        className={
                                            sidebar({
                                                color: isDropdownOpen
                                                    ? "selected"
                                                    : "unselected",
                                            }) + " w-full justify-between"
                                        }
                                    >
                                        Admin
                                        <svg
                                            className={`ms-3 h-2.5 w-2.5 transition-transform ${
                                                isDropdownOpen
                                                    ? "rotate-180"
                                                    : ""
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
                                    {isDropdownOpen && (
                                        <div className="absolute left-full top-0 z-10 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow-sm">
                                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                                <li>
                                                    <NavLink
                                                        to="/admin/management"
                                                        className={({
                                                            isActive,
                                                        }) =>
                                                            sidebar({
                                                                color: isActive
                                                                    ? "selected"
                                                                    : "unselected",
                                                            }) +
                                                            " block px-4 py-2"
                                                        }
                                                    >
                                                        Gestión
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/admin/users"
                                                        className={({
                                                            isActive,
                                                        }) =>
                                                            sidebar({
                                                                color: isActive
                                                                    ? "selected"
                                                                    : "unselected",
                                                            }) +
                                                            " block px-4 py-2"
                                                        }
                                                    >
                                                        Usuarios
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/admin/exported"
                                                        className={({
                                                            isActive,
                                                        }) =>
                                                            sidebar({
                                                                color: isActive
                                                                    ? "selected"
                                                                    : "unselected",
                                                            }) +
                                                            " block px-4 py-2"
                                                        }
                                                    >
                                                        Exportados
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
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

const SidebarButton = ({ children, to }) => {
    const sidebar = tv({
        base: "flex items-center gap-2 rounded-lg px-6 py-3",
        variants: {
            color: {
                selected:
                    "bg-brand-custom-green bg-opacity-15 text-brand-custom-green",
                unselected: "text-brand-dark-blue",
            },
        },
    })

    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                sidebar({ color: isActive ? "selected" : "unselected" })
            }
        >
            {children}
        </NavLink>
    )
}

export default Sidebar
