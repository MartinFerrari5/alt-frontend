import PropTypes from "prop-types"
import { useState } from "react"
import { useLocation, useSearchParams } from "react-router-dom"
import useAuthStore from "../../store/authStore"
import { AddIcon } from "../../assets/icons"
import AddOptionDialog from "../email/AddOptionDialog"
import DownloadExcelButton from "../admin/DownloadExcelButton"
import Button from "../Button"
import SendToRRHHButton from "../Tasks/SendToRRHHButton"
import AddTaskDialog from "../Tasks/AddTaskDialog"

function Header({ subtitle, title, tasks }) {
    const [addDialogIsOpen, setAddDialogIsOpen] = useState(false)
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const role = useAuthStore((state) => state.role)
    const fullNameFromStore = useAuthStore((state) => state.fullName)

    const currentPath = location.pathname
    const isAdminPath = currentPath.startsWith("/admin/")
    const adminPath = isAdminPath ? currentPath.replace("/admin/", "") : ""

    // Extracción y normalización de parámetros de búsqueda
    const queryParams = {
        company: (searchParams.get("company") || "").trim(),
        project: (searchParams.get("project") || "").trim(),
        fullname: (searchParams.get("fullname") || fullNameFromStore).trim(),
        date: (searchParams.get("date") || "").trim(),
    }

    const showDownloadExcel = currentPath === "/" || currentPath === "/history"

    return (
        <div className="flex w-full items-center justify-between rounded-lg bg-white px-6 py-4 shadow-md">
            <div>
                <span className="text-xs font-semibold text-brand-custom-green">
                    {subtitle}
                </span>
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            </div>

            <div className="flex items-center gap-3">
                <div>
                    {isAdminPath ? (
                        <>
                            <AddOptionDialog
                                isOpen={addDialogIsOpen}
                                handleClose={() => setAddDialogIsOpen(false)}
                            />
                        </>
                    ) : (
                        <>
                            <AddTaskDialog
                                isOpen={addDialogIsOpen}
                                handleClose={() => setAddDialogIsOpen(false)}
                            />
                        </>
                    )}
                </div>
                {showDownloadExcel && <DownloadExcelButton tasks={tasks} />}

                <Button onClick={() => setAddDialogIsOpen(true)}>
                    <AddIcon />
                    {adminPath ? "" : "Nueva tarea"}
                </Button>

                {currentPath === "/" && (
                    <SendToRRHHButton
                        queryParams={queryParams}
                        tasks={tasks}
                        role={role}
                    />
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
