// src/components/admin/management/ManagementTables.jsx
import { useEffect, useState } from "react"
import { useOptionsStore } from "../../../store/optionsStore"
import Header from "../../Header"
import TableItemView from "./TableItemView"
import TableItemEdit from "./TableItemEdit"
import DeleteConfirmationModal from "../../Tasks/DeleteConfirmationModal"
import { toast } from "react-toastify"
import { useGetEmails } from "../../../hooks/data/email/Use-get-email"
import { useEmailMutations } from "../../../hooks/data/email/use-email-mutations"

const ManagementTables = () => {
    const {
        companies_table,
        hour_type_table,
        projects_table,
        types_table,
        fetchOptions,
    } = useOptionsStore()

    // Se obtiene el estado de emails y sus indicadores mediante el hook
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
        <div className="w-full space-y-6 px-8 py-16">
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
    const [selectedItem, setSelectedItem] = useState(null) // Para eliminación
    const [editingIndex, setEditingIndex] = useState(null) // Índice de la fila en edición
    const [editValue, setEditValue] = useState("")

    // Funciones para las tablas de opciones (no-email)
    const { updateOption, deleteOption } = useOptionsStore()

    // Maneja el click para eliminar, guardando el índice
    const handleDeleteClick = (item, index) => {
        setSelectedItem(
            typeof item === "object"
                ? { ...item, index }
                : { value: item, index }
        )
        setShowConfirm(true)
    }

    // Maneja el click para editar y asigna el valor inicial
    const handleEditClick = (item, index) => {
        setEditingIndex(index)
        const initialValue = isEmailTable
            ? // Si el email viene como objeto, extraemos la propiedad 'email'
              typeof item.email === "object"
                ? item.email.email
                : item.email
            : typeof item === "object"
              ? item.option || item.name
              : item
        setEditValue(initialValue)
    }

    // Guarda la edición usando la mutación o el updateOption
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
                    console.error("🔴 Error al actualizar:", error)
                    toast.error("Error al actualizar. Inténtalo de nuevo.")
                },
            })
        } else {
            const tableMap = {
                Compañías: "companies_table",
                "Tipos de Hora": "hour_type_table",
                Proyectos: "projects_table",
                Emails: "emails",
            }
            const table = tableMap[title]
            if (!table) {
                console.error("🔴 Error: Tabla no definida")
                toast.error("Error: Tabla no definida.")
                return
            }
            const updatedData = { option: editValue }
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
                    console.error("🔴 Error al actualizar:", error)
                    toast.error("Error al actualizar. Inténtalo de nuevo.")
                })
        }
    }

    const handleCancelEdit = () => {
        setEditingIndex(null)
        setEditValue("")
    }

    // Confirma la eliminación del elemento
    const confirmDelete = () => {
        if (isEmailTable) {
            const idToDelete =
                selectedItem && (selectedItem.id || selectedItem.email)
            if (idToDelete === undefined) {
                console.error(
                    "🔴 Error: No se pudo identificar el elemento a eliminar."
                )
                toast.error(
                    "Error: No se pudo identificar el elemento a eliminar."
                )
                return
            }
            emailMutations.remove.mutate(idToDelete, {
                onSuccess: () => {
                    toast.success("¡Elemento eliminado exitosamente!")
                    setShowConfirm(false)
                    setSelectedItem(null)
                },
                onError: (error) => {
                    console.error("🔴 Error al eliminar:", error)
                    toast.error("Error al eliminar. Inténtalo de nuevo.")
                },
            })
        } else {
            const tableMap = {
                Compañías: "companies_table",
                "Tipos de Hora": "hour_type_table",
                Proyectos: "projects_table",
                Emails: "emails",
            }
            const table = tableMap[title]
            if (!table) {
                console.error("🔴 Error: Tabla no definida")
                toast.error("Error: Tabla no definida.")
                return
            }
            const idToDelete = selectedItem.id
            if (idToDelete === undefined) {
                console.error(
                    "🔴 Error: No se pudo identificar el elemento a eliminar."
                )
                toast.error(
                    "Error: No se pudo identificar el elemento a eliminar."
                )
                return
            }
            deleteOption(table, idToDelete)
                .then(() => {
                    toast.success("¡Elemento eliminado exitosamente!")
                    setShowConfirm(false)
                    setSelectedItem(null)
                })
                .catch((error) => {
                    console.error("🔴 Error al eliminar:", error)
                    toast.error("Error al eliminar. Inténtalo de nuevo.")
                })
        }
    }

    const cancelDelete = () => {
        setShowConfirm(false)
        setSelectedItem(null)
    }

    // Si es la tabla de emails, se muestran mensajes de carga o error
    if (isEmailTable && loading) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold text-gray-700">
                    {title}
                </h2>
                <div className="p-4 text-center">Cargando emails...</div>
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
                    Error al cargar emails
                </div>
            </div>
        )
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
                />
            )}
        </div>
    )
}

export default ManagementTables
