// /src/components/Header.jsx
import PropTypes from "prop-types"
import { useState } from "react"
import { useLocation } from "react-router-dom"

import Button from "./Button"

// import AddEmailDialog from "./email/AddEmailDialog"

import { AddIcon, TrashIcon } from "../assets/icons"
import AddOptionDialog from "./email/AddOptionDialog"
import AddTaskDialog from "./Tasks/AddTaskDialog"

function Header({ subtitle, title }) {
    const [addDialogIsOpen, setAddDialogIsOpen] = useState(false)
    const location = useLocation()

    // Extraer todo lo que sigue a "/admin/"
    const adminPath = location.pathname.startsWith("/admin/")
        ? location.pathname.replace("/admin/", "")
        : ""

    return (
        <div className="flex w-full justify-between">
            <div>
                <span className="text-xs font-semibold text-brand-custom-green">
                    {subtitle}
                </span>
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>

            <div className="flex items-center gap-3">
                {adminPath ? (
                    ""
                ) : (
                    <Button color="ghost">
                        Limpiar tareas
                        <TrashIcon />
                    </Button>
                )}

                <Button onClick={() => setAddDialogIsOpen(true)}>
                    <AddIcon />
                    {adminPath ? "" : "Nueva tarea"}
                </Button>

                {adminPath ? (
                    <AddOptionDialog
                        isOpen={addDialogIsOpen}
                        handleClose={() => setAddDialogIsOpen(false)}
                    />
                ) : (
                    <AddTaskDialog
                        isOpen={addDialogIsOpen}
                        handleClose={() => setAddDialogIsOpen(false)}
                    />
                )}
            </div>
        </div>
    )
}

Header.propTypes = {
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

export default Header
