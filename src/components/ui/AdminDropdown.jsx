// src/components/ui/AdminDropdown.jsx
import { NavLink } from "react-router-dom"
import { useRef, useEffect } from "react"
import useSidebarStore from "../../store/sidebarStore"
import { tv } from "tailwind-variants"

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

const AdminDropdown = () => {
    const { adminDropdownOpen, toggleAdminDropdown, closeAdminDropdown } =
        useSidebarStore()
    const dropdownRef = useRef(null)

    // Cierra el dropdown si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                closeAdminDropdown()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [closeAdminDropdown])

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={toggleAdminDropdown}
                className={`${sidebarStyle({ color: "unselected" })} w-full justify-between`}
            >
                Admin
                <svg
                    className={`ms-3 h-2.5 w-2.5 transition-transform ${adminDropdownOpen ? "rotate-180" : ""}`}
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
                        onClick={closeAdminDropdown}
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
                        onClick={closeAdminDropdown}
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

export default AdminDropdown
