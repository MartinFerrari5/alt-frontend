// /src/pages/TaskDetails.jsx
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

import TaskHeader from "../components/Tasks/TaskHeader"
import TaskForm from "../components/Tasks/TaskForm"
import { ReadOnlyTaskDetails } from "../components/Tasks/ReadOnlyTaskDetails"

import { useGetTask, useTasks } from "../hooks/data/task/useTasks"
import { schema } from "../util/validationSchema"

import { useOptionsStore } from "../store/optionsStore"
import Sidebar from "../components/layout/Sidebar"

const TaskDetailsPage = () => {
    const { taskId } = useParams()
    const navigate = useNavigate()

    const { companies_table, hour_type_table, projects_table, fetchOptions } =
        useOptionsStore()

    useEffect(() => {
        fetchOptions("companies_table")
        fetchOptions("hour_type_table")
        fetchOptions("projects_table")
    }, [fetchOptions])

    const [taskDate, setTaskDate] = useState(null)
    const [isEditing, setIsEditing] = useState(false)

    const {
        register,
        watch,
        formState: { errors, isSubmitting },
        handleSubmit,
        reset,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            company: "",
            project: "",
            task_type: "",
            task_description: "",
            entry_time: "09:00",
            exit_time: "18:00",
            lunch_hours: "1",
            hour_type: "",
            status: "0",
        },
    })

    const formatTimeForInput = (timeStr) => {
        if (!timeStr) return ""
        return timeStr.length > 5 ? timeStr.slice(0, 5) : timeStr
    }

    const formatDateForBackend = (date) => {
        if (!date) return null
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day} 00:00:00`
    }

    // Obtener la tarea (ahora currentTask.task es un array)
    const { data: currentTask, isLoading, isError } = useGetTask(taskId)
    const { updateTaskMutation, deleteTaskMutation } = useTasks()

    // Extraer el objeto real de la tarea (primer elemento del array)
    const taskDetails =
        currentTask && currentTask.task && currentTask.task.length > 0
            ? currentTask.task[0]
            : null

    useEffect(() => {
        if (taskDetails) {
            const taskDateValue = taskDetails.task_date
                ? new Date(taskDetails.task_date)
                : null
            setTaskDate(taskDateValue)
            reset({
                company: taskDetails.company || "",
                project: taskDetails.project || "",
                task_type: taskDetails.task_type || "",
                task_description: taskDetails.task_description || "",
                entry_time: taskDetails.entry_time
                    ? formatTimeForInput(taskDetails.entry_time)
                    : "09:00",
                exit_time: taskDetails.exit_time
                    ? formatTimeForInput(taskDetails.exit_time)
                    : "18:00",
                lunch_hours: taskDetails.lunch_hours?.toString() || "1",
                hour_type: taskDetails.hour_type || "",
                status: taskDetails.status?.toString() || "0",
            })
        }
    }, [taskDetails, reset])

    const handleSaveClick = (data) => {
        if (data.entry_time >= data.exit_time) {
            toast.error(
                "La hora de entrada no puede ser mayor o igual a la de salida."
            )
            return
        }

        const updateData = {
            ...data,
            lunch_hours: Number(data.lunch_hours),
            status: Number(data.status),
            hour_type: data.hour_type,
            task_date: taskDate ? formatDateForBackend(taskDate) : null,
        }

        updateTaskMutation.mutate(
            { taskId, task: updateData },
            {
                onSuccess: () => {
                    toast.success("¡Tarea actualizada con éxito!")
                    setIsEditing(false)
                },
                onError: () =>
                    toast.error("Ocurrió un error al actualizar la tarea."),
            }
        )
    }

    const handleDeleteClick = () => {
        deleteTaskMutation.mutate(taskId, {
            onSuccess: () => {
                toast.success("¡Tarea eliminada con éxito!")
                navigate(-1)
            },
            onError: () =>
                toast.error("Ocurrió un error al eliminar la tarea."),
        })
    }

    if (isLoading) return <p>Cargando...</p>
    if (isError)
        return <p>Error al cargar la tarea. Inténtalo de nuevo más tarde.</p>
    if (!taskDetails) return <p>No se encontraron detalles de la tarea.</p>

    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            {/* Sidebar solo visible en pantallas grandes */}
            <div className="hidden lg:block lg:w-72">
                <Sidebar />
            </div>
            <div className="flex-1 overflow-auto px-4 py-6 sm:px-8">
                <TaskHeader
                    task={currentTask}
                    onBack={() => navigate(-1)}
                    onDelete={handleDeleteClick}
                    onEdit={() => setIsEditing((prev) => !prev)}
                    isEditing={isEditing}
                />
                {isEditing ? (
                    <TaskForm
                        register={register}
                        watch={watch}
                        errors={errors}
                        handleSubmit={handleSubmit(handleSaveClick)}
                        isSubmitting={isSubmitting}
                        taskDate={taskDate}
                        setTaskDate={setTaskDate}
                        task={taskDetails}
                        companies={companies_table}
                        projects={projects_table}
                        hourTypes={hour_type_table}
                    />
                ) : (
                    <ReadOnlyTaskDetails task={taskDetails} />
                )}
            </div>
        </div>
    )
}

export default TaskDetailsPage
