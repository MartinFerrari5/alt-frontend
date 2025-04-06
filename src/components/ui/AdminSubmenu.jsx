// /src/components/ui/AdminSubmenu.jsx
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Settings, ChevronDown, ChevronRight } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu"
import Button from "../Button"

const AdminSubmenu = ({ showLabels }) => {
    const location = useLocation()
    const [adminMenuOpen, setAdminMenuOpen] = useState(false)

    const isActive = location.pathname.startsWith("/admin")

    if (!showLabels) {
        // Collapsed sidebar - show dropdown
        return (
            <li>
                <div className="nav-item relative">
                    <Settings
                        size={20}
                        className={
                            isActive ? "text-sidebar-accent-foreground" : ""
                        }
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 ml-1 h-full bg-transparent p-0 hover:bg-sidebar-accent/20"
                            >
                                <ChevronRight size={16} />
                                <span className="sr-only">Open admin menu</span>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            side="right"
                            align="start"
                            className="min-w-[140px] border-sidebar-border bg-mainColor text-white"
                        >
                            <DropdownMenuItem asChild>
                                <Link
                                    to="/admin/users"
                                    className="cursor-pointer hover:bg-sidebar-accent"
                                >
                                    Users
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    to="/admin/companies"
                                    className="cursor-pointer hover:bg-sidebar-accent"
                                >
                                    Companias
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    to="/admin/management"
                                    className="cursor-pointer hover:bg-sidebar-accent"
                                >
                                    Management
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </li>
        )
    }

    // Expanded sidebar - show collapsible menu
    return (
        <li>
            <button
                className={`nav-item flex w-full items-center justify-between text-left ${
                    isActive ? "active bg-sidebar-accent" : ""
                }`}
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                aria-expanded={adminMenuOpen}
                aria-controls="admin-submenu"
            >
                <div className="flex items-center gap-3">
                    <Settings size={20} />
                    <span>Administration</span>
                </div>
                {adminMenuOpen ? (
                    <ChevronDown size={16} />
                ) : (
                    <ChevronRight size={16} />
                )}
            </button>

            {adminMenuOpen && (
                <ul
                    id="admin-submenu"
                    className="mt-2 animate-fade-in space-y-2 pl-9"
                >
                    <li>
                        <Link
                            to="/admin/users"
                            className={`nav-item py-2 ${
                                location.pathname === "/admin/users"
                                    ? "active bg-sidebar-accent/80"
                                    : ""
                            }`}
                        >
                            Users
                        </Link>
                    </li>
                    {/* <li>
                        <Link
                            to="/admin/tasks"
                            className={`nav-item py-2 ${
                                location.pathname === "/admin/tasks"
                                    ? "active bg-sidebar-accent/80"
                                    : ""
                            }`}
                        >
                            Tasks
                        </Link>
                    </li> */}
                    <li>
                        <Link
                            to="/admin/management"
                            className={`nav-item py-2 ${
                                location.pathname === "/admin/management"
                                    ? "active bg-sidebar-accent/80"
                                    : ""
                            }`}
                        >
                            Management
                        </Link>
                    </li>
                </ul>
            )}
        </li>
    )
}

export default AdminSubmenu
