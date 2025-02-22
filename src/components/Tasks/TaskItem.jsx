// src/components/Tasks/TaskItem.jsx
import PropTypes from "prop-types"
import { useState, useCallback } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

import Button from "../Button"
import StatusIndicator from "./StatusIndicator"
import DeleteConfirmationModal from "./DeleteConfirmationModal"
import { FaEdit, FaTrash } from "react-icons/fa"
import { useTasks } from "../../hooks/data/task/useTasks"
import useAuthStore from "../../store/authStore"

/**
 * Componente que representa un item de tarea en la tabla de tareas.
 * Renderiza una fila de la tabla con los datos de la tarea y botones para
 * editar y eliminar la tarea.
 *
 * @param {Object} task - Un objeto que contiene los datos de la tarea.
 * @returns {ReactElement}
 */
const TaskItem = ({ task }) => {
    const { deleteTaskMutation, updateTaskMutation } = useTasks()
    const { mutate: deleteTaskApi, isLoading: deleteTaskIsLoading } =
        deleteTaskMutation
    const { mutate: updateTaskApi, isLoading: updateTaskIsLoading } =
        updateTaskMutation

    const [showConfirm, setShowConfirm] = useState(false)
    const role = useAuthStore((state) => state.role)
    const handleDeleteClick = useCallback(() => {
        setShowConfirm(true)
    }, [])

    const confirmDelete = useCallback(() => {
        deleteTaskApi(task.id, {
            onSuccess: () => {
                toast.success("¡Tarea eliminada exitosamente!")
                setShowConfirm(false)
            },
            onError: (error) => {
                console.error("🔴 Error al eliminar tarea:", error)
                toast.error("Error al eliminar la tarea. Inténtalo de nuevo.")
            },
        })
    }, [deleteTaskApi, task.id])

    // Alterna entre estado 0 y 1
    const getNewStatus = useCallback(
        () => (task.status === 1 ? 0 : 1),
        [task.status]
    )

    const handleCheckboxClick = useCallback(() => {
        const newStatus = getNewStatus()

        if (!task.task_date || isNaN(new Date(task.task_date).getTime())) {
            toast.error("Fecha de tarea inválida. Verifica los datos.")
            return
        }

        updateTaskApi(
            { taskId: task.id, task: { status: newStatus } },
            {
                onSuccess: () => {
                    toast.success("¡Estado de la tarea actualizado!")
                },
                onError: (error) => {
                    console.error("🔴 Error al actualizar tarea:", error)
                    toast.error(
                        "Error al actualizar la tarea. Inténtalo de nuevo."
                    )
                },
            }
        )
    }, [updateTaskApi, task, getNewStatus])

    const formatDate = useCallback((dateString) => {
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
    }, [])

    return (
        <>
            <tr className="border-b border-gray-200 bg-white hover:bg-gray-50">
                <td className="px-4 py-5">{task.full_name || "Sin nombre"}</td>
                <td className="px-4 py-5">{task.company}</td>
                <td className="px-4 py-5">{task.project}</td>
                <td className="px-4 py-5">{formatDate(task.task_date)}</td>
                <td className="px-4 py-5">
                    {task.entry_time} - {task.exit_time}
                </td>
                <td className="px-4 py-5">{task.hour_type}</td>
                <td className="px-4 py-5">{task.worked_hours}</td>
                <td className="flex justify-end gap-2 px-4 py-5 text-right">
                    <Button
                        color="ghost"
                        onClick={handleDeleteClick}
                        disabled={deleteTaskIsLoading}
                    >
                        {deleteTaskIsLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin text-brand-text-gray" />
                        ) : (
                            <FaTrash className="h-5 w-5" />
                        )}
                    </Button>
                    <Link to={`/task/${task.id}`}>
                        <FaEdit className="h-5 w-5" />
                    </Link>
                    <StatusIndicator
                        role={role}
                        status={task.status}
                        isLoading={updateTaskIsLoading}
                        onChange={handleCheckboxClick}
                    />
                </td>
            </tr>

            {showConfirm && (
                <DeleteConfirmationModal
                    onConfirm={confirmDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    )
}

TaskItem.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.string.isRequired,
        full_name: PropTypes.string, // Ahora no es obligatorio
        company: PropTypes.string.isRequired,
        project: PropTypes.string.isRequired,
        task_date: PropTypes.string.isRequired,
        entry_time: PropTypes.string.isRequired,
        exit_time: PropTypes.string.isRequired,
        hour_type: PropTypes.string.isRequired,
        worked_hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        status: PropTypes.number.isRequired,
    }).isRequired,
}

export default TaskItem
