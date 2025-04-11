// /src/components/Tasks/TaskHeader.jsx
import { useState } from "react"
import { FaChevronLeft, FaEdit, FaTimes } from "react-icons/fa"
import { format } from "date-fns"
import { Badge } from "../ui/badge"
import { es } from "date-fns/locale"
import useAuthStore from "../../store/modules/authStore"
import Button from "../Button"
import DeleteConfirmationModal from "./DeleteConfirmationModal"

const STATE_LABELS = {
    0: "Pendiente",
    1: "En revisión",
    2: "Aprobada",
}

const STATE_COLORS = {
    0: "bg-yellow-500 text-white",
    1: "bg-blue-600 text-white",
    2: "bg-green-600 text-white",
}

const TaskHeader = ({ task, onBack, onEdit, onDeleteConfirmed, isEditing }) => {
    const role = useAuthStore((state) => state.user.role)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const formattedDate = task?.task?.task_date
        ? format(new Date(task.task.task_date), "EEEE d 'de' MMMM 'de' yyyy", {
              locale: es,
          })
        : ""

    const status = task?.task?.status?.toString() || "0"

    const handleDeleteClick = () => {
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = () => {
        setShowDeleteModal(false)
        onDeleteConfirmed()
    }

    const handleCancelDelete = () => {
        setShowDeleteModal(false)
    }

    return (
        <>
            <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                    <Button
                        onClick={onBack}
                        variant="ghost"
                        size="sm"
                        className="flex items-center text-gray-800"
                    >
                        <FaChevronLeft className="mr-2" /> Volver
                    </Button>

                    <div className="ml-auto flex items-center gap-2">
                        {role === "user" && (
                            <>
                                <Button
                                    onClick={onEdit}
                                    variant="ghost"
                                    size="sm"
                                    className={
                                        isEditing
                                            ? "text-primary-800"
                                            : "text-gray-800"
                                    }
                                >
                                    <FaEdit
                                        className={`mr-2 ${isEditing ? "text-brand-blue" : ""}`}
                                    />{" "}
                                    {isEditing ? "Cancelar edición" : "Editar"}
                                </Button>
                                <Button
                                    onClick={handleDeleteClick}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600"
                                >
                                    <FaTimes className="mr-2" /> Eliminar
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="mb-6 flex flex-col justify-between md:flex-row">
                    <div>
                        <h1 className="mb-1 text-2xl font-bold">
                            {task?.task?.task_description ||
                                "Tarea sin descripción"}
                        </h1>
                        <p className="text-md font-medium text-gray-700">
                            {formattedDate}
                        </p>
                    </div>

                    <div className="mt-3 flex items-center gap-2 md:mt-0">
                        <Badge
                            className={`text-md py-1 ${
                                STATE_COLORS[status] || "bg-gray-500 text-white"
                            }`}
                        >
                            {STATE_LABELS[status] || "Estado desconocido"}
                        </Badge>
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <DeleteConfirmationModal
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </>
    )
}

export default TaskHeader
