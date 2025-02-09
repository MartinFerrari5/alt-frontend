// /src/components/admin/management/ManagementTables.jsx

import { useGetHourTypes } from "../../../hooks/data/use-get-typeHour"
import { useGetCompanies } from "../../../hooks/data/use-get-companies"
import { useGetProjects } from "../../../hooks/data/projects/use-get-projects"
import Header from "../../Header"
import TableItem from "./TableItem"
import { useGetEmail } from "../../../hooks/data/email/Use-get-email"
import { useDeleteOptions } from "../../../hooks/data/options/use-delete-options"
import { useState } from "react"
import { toast } from "react-toastify"
import DeleteConfirmationModal from "../../Tasks/DeleteConfirmationModal"

const ManagementTables = () => {
    const { data: hourTypes = [] } = useGetHourTypes()
    const { data: companies = [] } = useGetCompanies()
    const { data: projects = [] } = useGetProjects()
    const { data: emails = [] } = useGetEmail()

    return (
        <div className="w-full space-y-6 px-8 py-16">
            <Header subtitle="Gestión de Datos" title="Administración" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DataTable title="Compañías" data={companies} />
                <DataTable title="Tipos de Hora" data={hourTypes} />
                <DataTable title="Proyectos" data={projects} />
                <DataTable title="Emails" data={emails} />
            </div>
        </div>
    )
}

const DataTable = ({ title, data }) => {
    const { mutate: deleteOptions } = useDeleteOptions()
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    const handleDeleteClick = (item) => {
        console.log("Selected Item:", item) // Debugging
        setSelectedItem(item)
        setShowConfirm(true)
    }

    const confirmDelete = () => {
        // Map the title to the correct table name
        const tableMap = {
            Compañías: "companies_table",
            "Tipos de Hora": "hour_type_table",
            Proyectos: "projects_table",
        }

        const table = tableMap[title] // Get the table name from the title

        if (!table) {
            console.error("🔴 Error: Tabla no definida")
            toast.error("Error: Tabla no definida.")
            return
        }

        deleteOptions(
            { table, element: selectedItem }, // Pass table and element
            {
                onSuccess: () => {
                    toast.success("¡Elemento eliminado exitosamente!")
                    setShowConfirm(false)
                },
                onError: (error) => {
                    console.error("🔴 Error al eliminar:", error)
                    toast.error("Error al eliminar. Inténtalo de nuevo.")
                },
            }
        )
    }

    const cancelDelete = () => {
        setShowConfirm(false)
        setSelectedItem(null)
    }

    return (
        <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
                {title}
            </h2>
            <div className="relative max-h-[400px] overflow-y-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-600">
                        <tr>
                            <th className="px-6 py-3">Id</th>
                            <th className="px-6 py-3">{title}</th>
                            <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                >
                                    No hay datos disponibles.
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <TableItem
                                    key={item.id || index}
                                    id={item.id || index + 1}
                                    name={item.email || item.name || item}
                                    onDelete={() => handleDeleteClick(item)}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {showConfirm && (
                <DeleteConfirmationModal
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    )
}

export default ManagementTables
