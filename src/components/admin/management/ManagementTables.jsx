// src/components/admin/management/ManagementTables.jsx
import { useEffect, useState } from "react"
import { useOptionsStore } from "../../../store/optionsStore"
import TableItemView from "./TableItemView"
import TableItemEdit from "./TableItemEdit"
import DeleteConfirmationModal from "../../Tasks/DeleteConfirmationModal"
import { toast } from "react-toastify"
import {
    useEmailMutations,
    useGetEmails,
} from "../../../hooks/data/email/use-email-mutations"
import Header from "../../layout/Header"

// Mapeo de títulos a nombres de tabla para reutilizar en las llamadas a la API
const TABLE_MAP = {
    Compañías: "companies_table",
    "Tipos de Hora": "hour_type_table",
    Proyectos: "projects_table",
    Emails: "emails",
    "Tipos de Tarea": "types_table",
}

// Funciones auxiliares para los mensajes
const showSuccess = (message) => toast.success(message)
const showError = (message) => toast.error(message)

const ManagementTables = () => {
    const {
        companies_table,
        hour_type_table,
        projects_table,
        types_table,
        fetchOptions,
    } = useOptionsStore()

    const {
        emails,
        isLoading: emailsLoading,
        error: emailsError,
    } = useGetEmails()
    const emailMutations = useEmailMutations()

    useEffect(() => {
        fetchOptions("companies_table")
        fetchOptions("hour_type_table")
        fetchOptions("projects_table")
        fetchOptions("types_table")
    }, [fetchOptions])

    return (
        <div className="w-full space-y-6">
            <Header subtitle="Gestión de Datos" title="Administración" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DataTable title="Compañías" data={companies_table || []} />
                <DataTable title="Tipos de Hora" data={hour_type_table || []} />
                <DataTable title="Proyectos" data={projects_table || []} />
                <DataTable title="Tipos de Tarea" data={types_table || []} />
                <DataTable
                    title="Emails"
                    data={emails}
                    isEmailTable={true}
                    emailMutations={emailMutations}
                    loading={emailsLoading}
                    error={emailsError}
                />
            </div>
        </div>
    )
}

const DataTable = ({
    title,
    data,
    isEmailTable = false,
    emailMutations,
    loading,
    error,
}) => {
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [editingIndex, setEditingIndex] = useState(null)
    const [editValue, setEditValue] = useState("")

    const { updateOption, deleteOption } = useOptionsStore()

    const handleDeleteClick = (item, index) => {
        setSelectedItem(
            typeof item === "object"
                ? { ...item, index }
                : { value: item, index }
        )
        setShowConfirm(true)
    }

    const handleEditClick = (item, index) => {
        setEditingIndex(index)
        const initialValue = isEmailTable
            ? typeof item.email === "object"
                ? item.email.email
                : item.email
            : typeof item === "object"
              ? item.option || item.name
              : item
        setEditValue(initialValue)
    }

    const handleSaveEdit = () => {
        if (editingIndex === null || !editValue.trim()) {
            toast.error("El valor no puede estar vacío.")
            return
        }
        const itemToEdit = data[editingIndex]
        if (isEmailTable) {
            const updatedEmail = { ...itemToEdit, email: editValue }
            emailMutations.edit.mutate(updatedEmail, {
                onSuccess: () => {
                    toast.success("¡Elemento actualizado exitosamente!")
                    setEditingIndex(null)
                    setEditValue("")
                },
                onError: (error) => {
                    console.error("Error al actualizar email:", error)
                    const backendMsg =
                        error.response?.data?.message || error.message
                    toast.error(backendMsg)
                },
            })
        } else {
            // Manejamos el resto de las tablas de la misma forma que antes
            const tableMap = {
                Compañías: "companies_table",
                "Tipos de Hora": "hour_type_table",
                Proyectos: "projects_table",
                Emails: "emails",
                "Tipos de Tarea": "types_table",
            }
            const table = tableMap[title]
            if (!table) {
                console.error("Error: Tabla no definida")
                toast.error("Error: Tabla no definida.")
                return
            }
            const updatedData = editValue
            const idToUpdate =
                typeof itemToEdit === "object" && itemToEdit.id
                    ? itemToEdit.id
                    : editingIndex
            updateOption(table, idToUpdate, updatedData)
                .then(() => {
                    toast.success("¡Elemento actualizado exitosamente!")
                    setEditingIndex(null)
                    setEditValue("")
                })
                .catch((error) => {
                    console.error("Error al actualizar:", error)
                    toast.error("Error al actualizar. Inténtalo de nuevo.")
                })
        }
    }

    const handleCancelEdit = () => {
        setEditingIndex(null)
        setEditValue("")
    }

    const confirmDelete = async () => {
        if (!selectedItem || !selectedItem.id) {
            showError(
                "No se pudo identificar el elemento a eliminar. Inténtalo de nuevo."
            )
            return
        }

        // Si es un email, usamos la mutación de emails
        if (isEmailTable) {
            emailMutations.remove.mutate(selectedItem.id, {
                onSuccess: () => {
                    showSuccess("Correo electrónico eliminado correctamente.")
                    setShowConfirm(false)
                    setSelectedItem(null)
                },
                onError: (error) => {
                    console.error("Error al eliminar el email:", error)
                    const errorMessage =
                        error.response?.data?.message || error.message
                    showError(errorMessage)
                },
            })
            return
        }

        // Para otras tablas, se usa deleteOption
        try {
            const table = TABLE_MAP[title]
            if (!table) {
                showError("Error: La tabla no está definida. Contacta soporte.")
                return
            }

            await deleteOption(table, selectedItem.id)
            showSuccess("Elemento eliminado correctamente.")
            setShowConfirm(false)
            setSelectedItem(null)
        } catch (error) {
            console.error("Error al eliminar:", error)
            const errorMessage = error.response?.data?.message || error.message
            showError(errorMessage)
        }
    }

    const cancelDelete = () => {
        setShowConfirm(false)
        setSelectedItem(null)
    }

    if (isEmailTable && loading) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold text-gray-700">
                    {title}
                </h2>
                <div className="p-4 text-center">
                    Cargando correos electrónicos...
                </div>
            </div>
        )
    }

    if (isEmailTable && error) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold text-gray-700">
                    {title}
                </h2>
                <div className="p-4 text-center text-red-500">
                    Error al cargar correos electrónicos
                </div>
            </div>
        )
    }

    // Se construye el nombre del elemento para personalizar los mensajes
    const itemName =
        selectedItem &&
        (selectedItem.option ||
            selectedItem.name ||
            selectedItem.value ||
            (isEmailTable
                ? typeof selectedItem.email === "object"
                    ? selectedItem.email.email
                    : selectedItem.email
                : ""))

    return (
        <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
                {title}
            </h2>
            <div className="relative max-h-[400px] overflow-y-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-600">
                        <tr>
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
                                    ? typeof item.email === "object"
                                        ? item.email.email
                                        : item.email
                                    : typeof item === "object"
                                      ? item.option || item.name
                                      : item
                                return editingIndex === index ? (
                                    <TableItemEdit
                                        key={item.id}
                                        id={item.id}
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
                                        key={item.id}
                                        id={item.id}
                                        name={name}
                                        onEditClick={() =>
                                            handleEditClick(item, index)
                                        }
                                        onDeleteClick={() =>
                                            handleDeleteClick(item, index)
                                        }
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
                    message={`¿Estás seguro de eliminar el elemento "${itemName}"?`}
                    confirmText="Sí, eliminar"
                    cancelText="Cancelar"
                />
            )}
        </div>
    )
}

export default ManagementTables
