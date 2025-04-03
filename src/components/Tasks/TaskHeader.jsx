// src/components/Tasks/TaskHeader.jsx
import { FaEdit } from "react-icons/fa"
import { ArrowLeftIcon, ChevronRightIcon, TrashIcon } from "../../assets/icons"
import Button from "../Button"
import { Link } from "react-router-dom"
import useAuthStore from "../../store/authStore"

const TaskHeader = ({ task, onBack, onDelete, onEdit, isEditing }) =>{
    const role = useAuthStore((state) => state.role)
 return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
            <button
                onClick={onBack}
                className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-custom-green"
            >
                <ArrowLeftIcon />
            </button>
            <div className="flex items-center gap-1 text-xs">
                <Link className="cursor-pointer text-brand-text-gray" to="/">
                    Mis tareas
                </Link>
                <ChevronRightIcon className="text-brand-text-gray" />
                <span className="font-semibold text-brand-custom-green">
                    {task.task_description}
                </span>
            </div>
            <h1 className="mt-2 text-xl font-semibold">
                {task.task_description}
            </h1>
        </div>
        <div className="flex gap-3">
        {role === "user"  &&(
                <Button className="h-fit self-end" color="ghost" onClick={onEdit}>
                {isEditing ? "Cancelar" : <FaEdit className="h-5 w-5" />}
            </Button>)}
            <Button
                className="h-fit self-end"
                color="danger"
                onClick={onDelete}
            >
                <TrashIcon /> Eliminar tarea
            </Button>
        </div>
    </div>
)
}

export default TaskHeader
