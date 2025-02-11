// src/components/admin/management/ManagementTables.jsx
import { useState } from "react"
import { useGetOptions } from "../../../hooks/data/options/use-get-options"
import { useGetEmail } from "../../../hooks/data/email/Use-get-email"
import { useDeleteOptions } from "../../../hooks/data/options/use-delete-options"
import { useEditOptions } from "../../../hooks/data/options/use-edit-options"
import Header from "../../Header"
import TableItemView from "./TableItemView" // Componente de vista
import TableItemEdit from "./TableItemEdit" // Componente de edición
import DeleteConfirmationModal from "../../Tasks/DeleteConfirmationModal"
import { toast } from "react-toastify"
import { useOptionsStore } from "../../../store/optionsStore"

const ManagementTables = () => {
    // Se dispara el fetch para actualizar el store
    useGetOptions("companies_table", "companies")
    useGetOptions("hour_type_table", "hourTypes")
    useGetOptions("projects_table", "projects")
    const { data: emails = [] } = useGetEmail()

    // Se leen los datos desde el store para reflejar los cambios inmediatamente
    const companies = useOptionsStore((state) => state.companies) || []
    const hourTypes = useOptionsStore((state) => state.hourTypes) || []
    const projects = useOptionsStore((state) => state.projects) || []

    return (
        <div className="w-full space-y-6 px-8 py-16">
            <Header subtitle="Gestión de Datos" title="Administración" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DataTable title="Compañías" data={companies} />
                <DataTable title="Tipos de Hora" data={hourTypes} />
                <DataTable title="Proyectos" data={projects} />
                <DataTable title="Emails" data={emails} isEmailTable={true} />
            </div>
        </div>
    )
}

const DataTable = ({ title, data, isEmailTable = false }) => {
    const { mutate: deleteOptions } = useDeleteOptions()
    const { mutate: editOptions } = useEditOptions()
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null) // Para eliminación
    const [editingIndex, setEditingIndex] = useState(null) // Índice de la fila en edición
    const [editValue, setEditValue] = useState("") // Valor editado

    // Maneja el click para eliminar, guardando además el índice
    const handleDeleteClick = (item, index) => {
        setSelectedItem(
            typeof item === "object"
                ? { ...item, index }
                : { value: item, index }
        )
        setShowConfirm(true)
    }

    // Maneja el click para editar: guarda el índice y asigna el valor inicial
    const handleEditClick = (item, index) => {
        setEditingIndex(index)
        const initialValue = isEmailTable
            ? typeof item === "object"
                ? item.email
                : item
            : typeof item === "object"
              ? item.name
              : item
        setEditValue(initialValue)
    }

    // Al guardar la edición, se obtiene el elemento a editar a partir del índice
    const handleSaveEdit = () => {
        if (editingIndex === null || !editValue.trim()) {
            toast.error("El valor no puede estar vacío.")
            return
        }

        const itemToEdit = data[editingIndex]

        // Mapeo del título a la tabla correspondiente en la API
        const tableMap = {
            Compañías: "companies_table",
            "Tipos de Hora": "hour_type_table",
            Proyectos: "projects_table",
            Emails: "emails_table",
        }

        const table = tableMap[title]
        if (!table) {
            console.error("🔴 Error: Tabla no definida")
            toast.error("Error: Tabla no definida.")
            return
        }

        const updatedData = isEmailTable
            ? { email: editValue }
            : { name: editValue }

        // Se utiliza el id si existe; de lo contrario se usa el índice
        const idToUpdate =
            typeof itemToEdit === "object" && itemToEdit.id
                ? itemToEdit.id
                : editingIndex

        editOptions(
            { table, id: idToUpdate, updatedData },
            {
                onSuccess: () => {
                    toast.success("¡Elemento actualizado exitosamente!")
                    setEditingIndex(null)
                    setEditValue("")
                },
                onError: (error) => {
                    console.error("🔴 Error al actualizar:", error)
                    toast.error("Error al actualizar. Inténtalo de nuevo.")
                },
            }
        )
    }

    // Cancela la edición y resetea el estado correspondiente
    const handleCancelEdit = () => {
        setEditingIndex(null)
        setEditValue("")
    }

    // Función para confirmar la eliminación del elemento
    const confirmDelete = () => {
        const tableMap = {
            Compañías: "companies_table",
            "Tipos de Hora": "hour_type_table",
            Proyectos: "projects_table",
            Emails: "emails_table",
        }

        const table = tableMap[title]
        if (!table) {
            console.error("🔴 Error: Tabla no definida")
            toast.error("Error: Tabla no definida.")
            return
        }

        const idToDelete =
            selectedItem && (selectedItem.id || selectedItem.value)
        if (idToDelete === undefined) {
            console.error(
                "🔴 Error: No se pudo identificar el elemento a eliminar."
            )
            toast.error("Error: No se pudo identificar el elemento a eliminar.")
            return
        }

        deleteOptions(
            { table, id: idToDelete },
            {
                onSuccess: () => {
                    toast.success("¡Elemento eliminado exitosamente!")
                    setShowConfirm(false)
                    setSelectedItem(null)
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
                            data.map((item, index) => {
                                const name = isEmailTable
                                    ? typeof item === "object"
                                        ? item.email
                                        : item
                                    : typeof item === "object"
                                      ? item.name
                                      : item
                                return editingIndex === index ? (
                                    <TableItemEdit
                                        key={item.id || index}
                                        id={item.id || index + 1}
                                        name={name}
                                        editValue={editValue}
                                        onEditChange={(e) =>
                                            setEditValue(e.target.value)
                                        }
                                        onSaveEdit={handleSaveEdit}
                                        onCancelEdit={handleCancelEdit}
                                        onDeleteClick={() =>
                                            handleDeleteClick(item, index)
                                        }
                                    />
                                ) : (
                                    <TableItemView
                                        key={item.id || index}
                                        id={item.id || index + 1}
                                        name={name}
                                        onEditClick={() =>
                                            handleEditClick(item, index)
                                        }
                                        onDeleteClick={() =>
                                            handleDeleteClick(item, index)
                                        }
                                        isEmailTable={isEmailTable}
                                    />
                                )
                            })
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
