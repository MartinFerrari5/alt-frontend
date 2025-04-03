// src/components/Tasks/TaskHeader.jsx
import { FaEdit } from "react-icons/fa"
import { ArrowLeftIcon, ChevronRightIcon, TrashIcon } from "../../assets/icons"
import Button from "../Button"
import { Link } from "react-router-dom"
import useAuthStore from "../../store/modules/authStore"

const TaskHeader = ({ task, onBack, onDelete, onEdit, isEditing }) => {
    const role = useAuthStore((state) => state.role)

    return (
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
                <button
                    onClick={onBack}
                    className="bg-brand-custom-green mb-3 flex h-8 w-8 items-center justify-center rounded-full"
                >
                    <ArrowLeftIcon />
                </button>
                <div className="flex items-center gap-1 text-xs">
                    <Link
                        className="text-brand-text-gray cursor-pointer"
                        to="/"
                    >
                        Mis tareas
                    </Link>
                    <ChevronRightIcon className="text-brand-text-gray" />
                    <span className="text-brand-custom-green font-semibold">
                        {task.task_description}
                    </span>
                </div>
                <h1 className="mt-2 text-xl font-semibold">
                    {task.task_description}
                </h1>
            </div>
            {role !== "admin" && (
                <div className="flex gap-3">
                    <Button
                        className="h-fit self-end"
                        color="ghost"
                        onClick={onEdit}
                    >
                        {isEditing ? (
                            "Cancelar"
                        ) : (
                            <FaEdit className="h-5 w-5" />
                        )}
                    </Button>
                    <Button
                        className="h-fit self-end"
                        color="danger"
                        onClick={onDelete}
                    >
                        <TrashIcon /> Eliminar tarea
                    </Button>
                </div>
            )}
        </div>
    )
}

export default TaskHeader
