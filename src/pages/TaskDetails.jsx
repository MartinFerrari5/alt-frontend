// src/pages/TaskDetails.jsx

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import Sidebar from "../components/Sidebar"
import TaskHeader from "../components/Tasks/TaskHeader"
import TaskForm from "../components/Tasks/TaskForm"
import { useDeleteTask } from "../hooks/data/task/use-delete-task"
import { useGetTask } from "../hooks/data/task/use-get-task"
import { useUpdateTask } from "../hooks/data/task/use-update-task"
import { ReadOnlyTaskDetails } from "../components/Tasks/ReadOnlyTaskDetails"

const TaskDetailsPage = () => {
    const { taskId } = useParams()
    const navigate = useNavigate()
    const [taskDate, setTaskDate] = useState("")
    const [isEditing, setIsEditing] = useState(false) // Estado para alternar entre vista de lectura y edición

    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
        reset,
    } = useForm()

    const { mutate: updateTask } = useUpdateTask(taskId)
    const { mutate: deleteTask } = useDeleteTask(taskId)

    const { data: task, isLoading } = useGetTask({
        taskId,
        onSuccess: (task) => {
            const taskDetails = task?.task?.[0]
            if (taskDetails) {
                const formattedDate = taskDetails.task_date
                    ? taskDetails.task_date.split("T")[0]
                    : ""
                setTaskDate(formattedDate)
                reset({
                    company: taskDetails.company || "",
                    project: taskDetails.project || "",
                    task_type: taskDetails.task_type || "",
                    task_description: taskDetails.task_description || "",
                    entry_time: taskDetails.entry_time || "09:00",
                    exit_time: taskDetails.exit_time || "18:00",
                    lunch_hours: taskDetails.lunch_hours?.toString() || "1",
                    status: taskDetails.status?.toString() || "0",
                })
            }
        },
    })

    const handleSaveClick = async (data) => {
        if (data.entry_time >= data.exit_time) {
            toast.error(
                "La hora de entrada no puede ser mayor o igual a la de salida."
            )
            return
        }

        updateTask(
            {
                ...data,
                lunch_hours: Number(data.lunch_hours),
                status: Number(data.status),
                task_date: taskDate,
            },
            {
                onSuccess: () => {
                    toast.success("¡Tarea guardada con éxito!")
                    setIsEditing(false) // Volver a modo de solo lectura después de guardar
                },
                onError: () =>
                    toast.error("Ocurrió un error al guardar la tarea."),
            }
        )
    }

    const handleDeleteClick = async () => {
        deleteTask(undefined, {
            onSuccess: () => {
                toast.success("¡Tarea eliminada con éxito!")
                navigate(-1)
            },
            onError: () =>
                toast.error("Ocurrió un error al eliminar la tarea."),
        })
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full space-y-6 px-8 py-16">
                <TaskHeader
                    task={task}
                    onBack={() => navigate(-1)}
                    onDelete={handleDeleteClick}
                    onEdit={() => setIsEditing(!isEditing)} // Alternamos entre editar y solo lectura
                    isEditing={isEditing} // Pasamos el estado para cambiar el texto del botón
                />

                {isEditing ? (
                    <TaskForm
                        register={register}
                        errors={errors}
                        handleSubmit={handleSubmit(handleSaveClick)}
                        isSubmitting={isSubmitting}
                        taskDate={taskDate}
                        setTaskDate={setTaskDate}
                        loader={isLoading}
                    />
                ) : (
                    <ReadOnlyTaskDetails task={task} />
                )}
            </div>
        </div>
    )
}

export default TaskDetailsPage
