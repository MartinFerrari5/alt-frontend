// src/components/Header.jsx
import PropTypes from "prop-types"
import { useState } from "react"
import { useLocation, useSearchParams } from "react-router-dom"
import Button from "./Button"
import { AddIcon } from "../assets/icons"
import AddOptionDialog from "./email/AddOptionDialog"
import AddTaskDialog from "./Tasks/AddTaskDialog"
import DownloadExcelButton from "./admin/DownloadExcelButton"
import SendToRRHHButton from "./Tasks/SendToRRHHButton"
import useAuthStore from "../store/authStore"

function Header({ subtitle, title, tasks }) {
    const [addDialogIsOpen, setAddDialogIsOpen] = useState(false)
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const role = useAuthStore((state) => state.role)
    const fullNameFromStore = useAuthStore((state) => state.fullName)

    // Si la ruta es "/admin/...", se extrae el path para usarlo de fallback
    const adminPath = location.pathname.startsWith("/admin/")
        ? location.pathname.replace("/admin/", "")
        : ""

    // Se extraen y limpian (trim) los parámetros de búsqueda
    const queryCompany = searchParams.get("company")?.trim() || ""
    const queryProject = searchParams.get("project")?.trim() || ""
    const queryFullname = searchParams.get("fullname")?.trim() || ""
    const queryDate = searchParams.get("date")?.trim() || ""

    // Se arma el objeto de queryParams. En el envío a RRHH solo el campo "date" es obligatorio.
    const queryParams = {
        company: queryCompany,
        project: queryProject,
        fullname: queryFullname || fullNameFromStore,
        date: queryDate,
    }

    return (
        <div className="flex w-full justify-between">
            <div>
                <span className="text-xs font-semibold text-brand-custom-green">
                    {subtitle}
                </span>
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>

            <div className="flex items-center gap-3">
                {location.pathname === "/admin/exported" ||
                location.pathname === "/task/exported" ? (
                    <DownloadExcelButton tasks={tasks} />
                ) : (
                    <>
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

                        {/* Se muestra el botón para enviar a RRHH solo si estamos en "/" y el role es "user" */}
                        {location.pathname === "/" && role === "user" && (
                            <SendToRRHHButton
                                queryParams={queryParams}
                                tasks={tasks}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

Header.propTypes = {
    subtitle: PropTypes.string,
    title: PropTypes.string,
    tasks: PropTypes.array,
}

export default Header
