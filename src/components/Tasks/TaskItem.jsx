// /src/components/Tasks/TaskItem.jsx

import PropTypes from "prop-types"
import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { TrashIcon, DetailsIcon, LoaderIcon } from "../../assets/icons"
import { useDeleteTask } from "../../hooks/data/task/use-delete-task"
import { useUpdateTask } from "../../hooks/data/task/use-update-task"
import Button from "../Button"
import StatusIndicator from "./StatusIndicator"
import DeleteConfirmationModal from "./DeleteConfirmationModal"

const TaskItem = ({ task }) => {
    const { mutate: deleteTask, isPending: deleteTaskIsLoading } =
        useDeleteTask(task.id)
    const { mutate: updateTask, isPending: updateTaskIsLoading } =
        useUpdateTask(task.id)

    const [showConfirm, setShowConfirm] = useState(false)

    const handleDeleteClick = () => {
        setShowConfirm(true)
    }

    const confirmDelete = () => {
        deleteTask(undefined, {
            onSuccess: () => {
                toast.success("¡Tarea eliminada exitosamente!")
                setShowConfirm(false)
            },
            onError: (error) => {
                console.error("🔴 Error al eliminar tarea:", error)
                toast.error("Error al eliminar la tarea. Inténtalo de nuevo.")
            },
        })
    }

    const getNewStatus = () =>
        task.status === 0 ? 1 : task.status === 1 ? 2 : 0

    const handleCheckboxClick = () => {
        updateTask(
            { status: getNewStatus() },
            {
                onSuccess: () =>
                    toast.success("¡Estado de la tarea actualizado!"),
                onError: (error) => {
                    console.error("🔴 Error al actualizar tarea:", error)
                    toast.error(
                        "Error al actualizar la tarea. Inténtalo de nuevo."
                    )
                },
            }
        )
    }

    return (
        <>
            <tr className="border-b border-gray-200 bg-white hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-5 font-medium">
                    <StatusIndicator
                        status={task.status}
                        isLoading={updateTaskIsLoading}
                        onChange={handleCheckboxClick}
                    />
                </td>
                <td className="px-6 py-5">{task.company}</td>
                <td className="px-6 py-5">{task.project}</td>
                <td className="px-6 py-5">
                    {new Date(task.task_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-5">
                    {task.entry_time} - {task.exit_time}
                </td>
                <td className="px-6 py-5">{task.hour_type}</td>
                <td className="flex justify-end gap-2 px-6 py-5 text-right">
                    <Button
                        color="ghost"
                        onClick={handleDeleteClick}
                        disabled={deleteTaskIsLoading}
                    >
                        {deleteTaskIsLoading ? (
                            <LoaderIcon className="animate-spin text-brand-text-gray" />
                        ) : (
                            <TrashIcon className="text-brand-text-gray" />
                        )}
                    </Button>
                    <Link to={`/task/${task.id}`}>
                        <DetailsIcon />
                    </Link>
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
        project: PropTypes.string.isRequired,
        task_type: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
        company: PropTypes.string.isRequired,
        task_date: PropTypes.string.isRequired,
        entry_time: PropTypes.string.isRequired,
        exit_time: PropTypes.string.isRequired,
    }).isRequired,
}

export default TaskItem
