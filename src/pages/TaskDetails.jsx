import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Sidebar from "../components/Sidebar";
import TaskHeader from "../components/Tasks/TaskHeader";
import TaskForm from "../components/Tasks/TaskForm";
import { useDeleteTask } from "../hooks/data/task/use-delete-task";
import { useGetTask } from "../hooks/data/task/use-get-task";
import { useUpdateTask } from "../hooks/data/task/use-update-task";
import { ReadOnlyTaskDetails } from "../components/Tasks/ReadOnlyTaskDetails";

const TaskDetailsPage = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [taskDate, setTaskDate] = useState(null); // Initialize as null
    const [isEditing, setIsEditing] = useState(false); // Estado para alternar entre vista de lectura y edición

    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
        reset,
    } = useForm();

    const { mutate: updateTask } = useUpdateTask(taskId);
    const { mutate: deleteTask } = useDeleteTask(taskId);

    const {
        data: task,
        isLoading,
        isError,
    } = useGetTask({
        taskId,
        onSuccess: (task) => {
            if (task) {
                // Convert task_date to a Date object
                const taskDateValue = task.task_date
                    ? new Date(task.task_date)
                    : null;
                setTaskDate(taskDateValue);

                reset({
                    company: task.company || "",
                    project: task.project || "",
                    task_type: task.task_type || "",
                    task_description: task.task_description || "",
                    entry_time: task.entry_time || "09:00",
                    exit_time: task.exit_time || "18:00",
                    lunch_hours: task.lunch_hours?.toString() || "1",
                    status: task.status?.toString() || "0",
                });
            }
        },
        onError: () => {
            toast.error("Error al cargar los detalles de la tarea.");
        },
    });

    const handleSaveClick = async (data) => {
        if (data.entry_time >= data.exit_time) {
            toast.error(
                "La hora de entrada no puede ser mayor o igual a la de salida."
            );
            return;
        }

        updateTask(
            {
                ...data,
                lunch_hours: Number(data.lunch_hours),
                status: Number(data.status),
                task_date: taskDate ? taskDate.toISOString() : null, // Convert Date to ISO string
            },
            {
                onSuccess: () => {
                    toast.success("¡Tarea guardada con éxito!");
                    setIsEditing(false); // Volver a modo de solo lectura después de guardar
                },
                onError: () =>
                    toast.error("Ocurrió un error al guardar la tarea."),
            }
        );
    };

    const handleDeleteClick = async () => {
        deleteTask(undefined, {
            onSuccess: () => {
                toast.success("¡Tarea eliminada con éxito!");
                navigate(-1);
            },
            onError: () =>
                toast.error("Ocurrió un error al eliminar la tarea."),
        });
    };

    if (isLoading) {
        return <p>Cargando...</p>; // Mostrar un spinner o mensaje de carga
    }

    if (isError) {
        return <p>Error al cargar la tarea. Inténtalo de nuevo más tarde.</p>;
    }

    if (!task) {
        return <p>No se encontraron detalles de la tarea.</p>;
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
                        task={task} // Pass the task data here
                        loader={isLoading}
                    />
                ) : (
                    <ReadOnlyTaskDetails task={task} />
                )}
            </div>
        </div>
    );
};

export default TaskDetailsPage;