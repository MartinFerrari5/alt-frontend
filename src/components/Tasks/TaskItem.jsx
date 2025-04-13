// src/components/Tasks/TaskItem.jsx
import PropTypes from "prop-types"
import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import StatusIndicator from "./StatusIndicator"
import DeleteConfirmationModal from "./DeleteConfirmationModal"
import { useTasks } from "../../hooks/data/task/useTasks"
import useAuthStore from "../../store/modules/authStore"
import Button from "../Button"
import { Trash } from "lucide-react"

const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible"
    const parsedDate = new Date(dateString)
    if (isNaN(parsedDate.getTime())) {
        console.warn(`⚠️ Fecha inválida recibida: ${dateString}`)
        return "Fecha inválida"
    }
    return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(parsedDate)
}

const TaskItem = ({
    task,
    showCheckbox,
    isSelected,
    onSelectTask,
    currentPath,
}) => {
    const role = useAuthStore((state) => state.user.role)
    const { deleteTaskMutation, updateTaskMutation } = useTasks()
    const { mutate: deleteTask, isLoading: deleteTaskIsLoading } =
        deleteTaskMutation
    const { mutate: updateTask, isLoading: updateTaskIsLoading } =
        updateTaskMutation

    const [showConfirm, setShowConfirm] = useState(false)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [newStatus, setNewStatus] = useState(task.status)

    const navigate = useNavigate()

    useEffect(() => {
        setNewStatus(task.status)
    }, [task.status])

    const handleDeleteClick = useCallback(() => setShowConfirm(true), [])

    const confirmDelete = useCallback(() => {
        deleteTask(task.id, {
            onSuccess: () => {
                toast.success("¡Tarea eliminada exitosamente!")
                setShowConfirm(false)
            },
            onError: (error) => {
                console.error("🔴 Error al eliminar tarea:", error)
                toast.error("Error al eliminar la tarea. Inténtalo de nuevo.")
            },
        })
    }, [deleteTask, task.id])

    const openStatusModal = useCallback(() => {
        
        setNewStatus(task.status)
        setShowStatusModal(true)
    }, [task.status])

    const closeStatusModal = useCallback(() => {
        setShowStatusModal(false)
    }, [])

    // Dentro de TaskItem.jsx, en la función handleStatusConfirm:

    const handleStatusConfirm = useCallback(() => {
        if (!task.task_date || isNaN(new Date(task.task_date).getTime())) {
            toast.error("Fecha de tarea inválida. Verifica los datos.")
            return
        }
        // Se incluye task_date en la actualización para que updateTaskApi la formatee correctamente
        updateTask(
            {
                taskId: task.id,
                task: { status: newStatus, task_date: task.task_date },
            },
            {
                onSuccess: () => {
                    toast.success("¡Estado de la tarea actualizado!")
                    setShowStatusModal(false)
                },
                onError: (error) => {
                    console.error("🔴 Error al actualizar tarea:", error)
                    toast.error(
                        "Error al actualizar la tarea. Inténtalo de nuevo."
                    )
                },
            }
        )
    }, [updateTask, task, newStatus])

    const handleRowClick = () => {
        if (currentPath !== "/rraa/history") {
            navigate(`/rraa/task/${task.id}`)
        }
    }

    const handleDeleteButtonClick = (e) => {
        e.stopPropagation()
        handleDeleteClick()
    }

    const handleStatusIndicatorClick = (e) => {
        e.stopPropagation()
        openStatusModal()
    }
    return (
        <>
            <tr
                onClick={handleRowClick}
                className="cursor-pointer border-b border-gray-200 bg-white hover:bg-gray-50"
            >
                {showCheckbox && (
                    <td className="px-4 py-5">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onClick={(e) => {
                                e.stopPropagation()
                                onSelectTask(task.id)
                            }}
                            className="h-6 w-6 cursor-pointer appearance-none rounded-full border-2 border-gray-300 transition duration-200 checked:border-green-500 checked:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </td>
                )}
                {role === "admin" && (
                    <td className="px-4 py-5">
                        {task.full_name || "Sin nombre"}
                    </td>
                )}

                <td className="px-4 py-5">{formatDate(task.task_date)}</td>
                <td className="px-4 py-5">{task.entry_time}</td>
                <td className="px-4 py-5">{task.exit_time}</td>
                <td className="px-4 py-5">{task.company}</td>
                <td className="px-4 py-5">{task.project}</td>
                <td className="px-4 py-5">{task.hour_type}</td>
                <td className="px-4 py-5">{task.lunch_hours || "-"}</td>
                <td className="px-4 py-5">{task.worked_hours}</td>
                <td className="group relative px-4 py-5">
                    <span>
                        {task.task_description.length > 10
                            ? `${task.task_description.substring(0, 10)}...`
                            : task.task_description}
                    </span>
                    <div className="absolute bottom-full left-0 z-50 mb-2 hidden w-64 rounded border border-gray-300 bg-white p-2 text-black shadow-lg group-hover:block">
                        {task.task_description}
                    </div>
                </td>

                <td className="flex gap-2 px-4 py-5 text-right">
                    {role === "user" && currentPath === "/rraa" && (
                        <Button
                            color="secondary"
                            variant="outline"
                            onClick={handleDeleteButtonClick}
                            disabled={deleteTaskIsLoading}
                            className="rounded-md border-2 p-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                        >
                            {deleteTaskIsLoading ? (
                                <AiOutlineLoading3Quarters className="text-brand-text-gray animate-spin" />
                            ) : (
                                <Trash className="h-4 w-4" />
                            )}
                        </Button>
                    )}
                    {role === "admin" && currentPath === "/rraa" ? (
                        <div onClick={handleStatusIndicatorClick}>
                            <StatusIndicator
                                status={task.status}
                                isLoading={updateTaskIsLoading}
                                onChange={() => {}}
                            />
                        </div>
                    ) : (
                        <StatusIndicator
                            status={task.status}
                            isLoading={updateTaskIsLoading}
                            onChange={() => {}}
                        />
                    )}
                </td>
            </tr>

            {showConfirm && (
                <DeleteConfirmationModal
                    onConfirm={confirmDelete}
                    onCancel={() => setShowConfirm(false)}
                    message="¿Estás seguro de que deseas eliminar esta tarea?"
                />
            )}

            {showStatusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-lg font-semibold">
                            Actualizar Estado de Tarea
                        </h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleStatusConfirm()
                            }}
                        >
                            <select
                                value={newStatus}
                                onChange={(e) =>
                                    setNewStatus(Number(e.target.value))
                                }
                                className="mb-4 w-full rounded-lg border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>Selecciona un estado</option>
                                <option value="0">progreso</option>
                                <option value="2">Finalizado</option>
                            </select>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    onClick={closeStatusModal}
                                    disabled={updateTaskIsLoading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={updateTaskIsLoading}
                                >
                                    {updateTaskIsLoading ? (
                                        <AiOutlineLoading3Quarters className="animate-spin" />
                                    ) : (
                                        "Confirmar"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

TaskItem.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.string.isRequired,
        full_name: PropTypes.string,
        company: PropTypes.string.isRequired,
        project: PropTypes.string.isRequired,
        task_date: PropTypes.string.isRequired,
        entry_time: PropTypes.string.isRequired,
        exit_time: PropTypes.string.isRequired,
        hour_type: PropTypes.string.isRequired,
        lunch_hours: PropTypes.string,
        worked_hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        status: PropTypes.number.isRequired,
    }).isRequired,
    showCheckbox: PropTypes.bool,
    isSelected: PropTypes.bool,
    onSelectTask: PropTypes.func,
}

TaskItem.defaultProps = {
    showCheckbox: false,
    isSelected: false,
    onSelectTask: () => {},
}

export default TaskItem
