import PropTypes from "prop-types"
import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import {
    CheckIcon,
    DetailsIcon,
    LoaderIcon,
    TrashIcon,
} from "../../assets/icons"
import { useDeleteTask } from "../../hooks/data/task/use-delete-task"
import { useUpdateTask } from "../../hooks/data/task/use-update-task"
import { useAuth } from "../../components/auth/AuthContext"
import Button from "../Button"

const TaskItem = ({ task }) => {
    const { role } = useAuth()
    const { mutate: deleteTask, isPending: deleteTaskIsLoading } =
        useDeleteTask(task.id)
    const { mutate: updateTask, isPending: updateTaskIsLoading } =
        useUpdateTask(task.id)

    const [showConfirm, setShowConfirm] = useState(false)

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
                <td className="whitespace-nowrap px-6 py-4 font-medium">
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

            {showConfirm && (
                <div id="popup-modal" tabIndex="-1" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow-sm ">
                            <button
                                type="button"
                                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                                onClick={() => setShowConfirm(false)}
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-5 text-center">
                                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500 ">
                                    ¿Estás seguro de que deseas eliminar esta tarea?
                                </h3>
                                <button
                                    type="button"
                                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                    onClick={confirmDelete}
                                >
                                    Si, estoy seguro
                                </button>
                                <button
                                    type="button"
                                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 "
                                    onClick={() => setShowConfirm(false)}
                                >
                                    No, cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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
