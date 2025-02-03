// src/components/Tasks/TaskItem.jsx

import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import {
    CheckIcon,
    DetailsIcon,
    LoaderIcon,
    TrashIcon,
} from "../../assets/icons"
import { useDeleteTask } from "../../hooks/data/use-delete-task"
import { useUpdateTask } from "../../hooks/data/use-update-task"
import { useAuth } from "../../components/auth/AuthContext"
import Button from "../Button"

const TaskItem = ({ task }) => {
    const { role } = useAuth()
    const { mutate: deleteTask, isPending: deleteTaskIsLoading } =
        useDeleteTask(task.id)
    const { mutate: updateTask, isPending: updateTaskIsLoading } =
        useUpdateTask(task.id)

    const getStatusClasses = () => {
        switch (task.status) {
            case 2:
                return "bg-brand-custom-green text-brand-custom-green"
            case 1:
                return "bg-brand-process text-brand-process"
            default:
                return "bg-brand-dark-blue bg-opacity-5 text-brand-dark-blue"
        }
    }

    const handleDeleteClick = () => {
        deleteTask(undefined, {
            onSuccess: () => toast.success("¡Tarea eliminada exitosamente!"),
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
        <tr className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
            <td className="px-6 py-4">
                <label
                    className={`relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg ${getStatusClasses()}`}
                >
                    <input
                        type="checkbox"
                        checked={task.status === 2}
                        className="absolute h-full w-full cursor-pointer opacity-0"
                        onChange={handleCheckboxClick}
                        disabled={updateTaskIsLoading}
                    />
                    {task.status === 2 && <CheckIcon />}
                    {task.status === 1 && (
                        <LoaderIcon className="animate-spin text-brand-white" />
                    )}
                </label>
            </td>
            <td className="px-6 py-4">{task.company}</td>
            <td className="px-6 py-4">{task.project}</td>
            <td className="px-6 py-4">
                {new Date(task.task_date).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
                {task.entry_time} - {task.exit_time}
            </td>
            <td className="flex justify-end gap-2 px-6 py-4 text-right">
                {role === "admin" && (
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
                )}
                <Link to={`/task/${task.id}`}>
                    <DetailsIcon />
                </Link>
            </td>
        </tr>
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
