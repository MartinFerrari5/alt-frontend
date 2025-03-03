// src/components/Sidebar.jsx
import { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "./auth/LogoutButton";
import HamburgerButton from "./HamburgerButton";
import { tv } from "tailwind-variants";
import useAuthStore from "../store/authStore";
import { FaHome, FaUndoAlt } from "react-icons/fa";

// Definición de estilos reutilizables
const sidebarStyle = tv({
  base: "flex items-center gap-2 rounded-lg px-6 py-3",
  variants: {
    color: {
      selected: "bg-brand-custom-green bg-opacity-15 text-brand-custom-green",
      unselected: "text-brand-dark-blue",
    },
  },
});

const SidebarButton = ({ children, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      sidebarStyle({ color: isActive ? "selected" : "unselected" })
    }
  >
    {children}
  </NavLink>
);

const AdminDropdown = ({ isOpen, toggleDropdown }) => (
  <div className="relative">
    <button
      onClick={toggleDropdown}
      className={`${sidebarStyle({
        color: isOpen ? "selected" : "unselected",
      })} w-full justify-between`}
    >
      Admin
      <svg
        className={`ms-3 h-2.5 w-2.5 transition-transform ${
          isOpen ? "rotate-180" : ""
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
    {isOpen && (
      <div className="absolute left-full top-0 z-10 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow-sm">
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
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
          <li>
            <NavLink
              to="/admin/exported"
              className={({ isActive }) =>
                sidebarStyle({
                  color: isActive ? "selected" : "unselected",
                }) + " block px-4 py-2"
              }
            >
              Exportados
            </NavLink>
          </li>
        </ul>
      </div>
    )}
  </div>
);

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const role = useAuthStore((state) => state.role);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

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
              <span className="text-brand-custom-green">organizador de tareas</span>.
            </p>
          </div>
          <div className="flex flex-col gap-2 p-2">
            <SidebarButton to="/history">
              <FaUndoAlt /> Historial
            </SidebarButton>
            <SidebarButton to="/">
              <FaHome /> Inicio
            </SidebarButton>
            {role === "admin" && (
              <AdminDropdown isOpen={isDropdownOpen} toggleDropdown={toggleDropdown} />
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
          isSidebarOpen ? "pointer-events-none opacity-50" : "opacity-100"
        }`}
        onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
