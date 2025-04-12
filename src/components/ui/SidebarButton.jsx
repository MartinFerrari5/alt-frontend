// src/components/ui/SidebarButton.jsx
import { NavLink } from "react-router-dom"
import { tv } from "tailwind-variants"

const sidebarStyle = tv({
    base: "flex items-center gap-2 rounded-lg px-6 py-3",
    variants: {
        color: {
            selected:
                "bg-brand-custom-green text-brand-custom-green bg-opacity-15",
            unselected: "text-brand-dark-blue",
        },
    },
})

const SidebarButton = ({ children, to }) =>  (    
    <NavLink
        to={to}
        end
        className={({ isActive }) =>
            sidebarStyle({ color: isActive ? "selected" : "unselected" })
        }
    >
        {children}
    </NavLink>
    )

export default SidebarButton
