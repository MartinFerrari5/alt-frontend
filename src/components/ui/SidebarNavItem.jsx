import { Link } from "react-router-dom"

const SidebarNavItem = ({
    to,
    icon: Icon,
    label,
    isActive,
    showLabel,
    children,
}) => {
    return (
        <li>
            <Link
                to={to}
                className={`nav-item ${isActive ? "active bg-sidebar-accent" : ""}`}
                title={label}
            >
                <Icon size={20} />
                {showLabel && <span>{label}</span>}
            </Link>
            {children}
        </li>
    )
}

export default SidebarNavItem
