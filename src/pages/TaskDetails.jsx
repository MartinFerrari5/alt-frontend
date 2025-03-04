// /src/pages/TaskDetails.jsx
// src/pages/TaskDetails.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import TaskHeader from "../components/Tasks/TaskHeader";
import TaskForm from "../components/Tasks/TaskForm";
import { ReadOnlyTaskDetails } from "../components/Tasks/ReadOnlyTaskDetails";

import { useGetTask, useTasks } from "../hooks/data/task/useTasks";
import { schema } from "../util/validationSchema";

// Obtenemos las opciones desde el store (igual que en AddTaskDialog)
import { useOptionsStore } from "../store/optionsStore";

const TaskDetailsPage = () => {
  const { taskId } = useParams(); // taskId se recibe como cadena (UUID)
  const navigate = useNavigate();

  // Cargar opciones al montar el componente
  const { companies_table, hour_type_table, projects_table, fetchOptions } = useOptionsStore();

  useEffect(() => {
    fetchOptions("companies_table");
    fetchOptions("hour_type_table");
    fetchOptions("projects_table");
  }, [fetchOptions]);

  const [taskDate, setTaskDate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
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
  });

  // Función para formatear la hora para inputs de tipo "time"
  const formatTimeForInput = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.length > 5 ? timeStr.slice(0, 5) : timeStr;
  };

  // Función para formatear la fecha según lo espera el backend
  const formatDateForBackend = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day} 00:00:00`;
  };

  // Obtenemos la tarea específica utilizando el hook "useGetTask"
  const { data: currentTask, isLoading, isError } = useGetTask(taskId);
  // Obtenemos las mutaciones desde el hook de tareas
  const { updateTaskMutation, deleteTaskMutation } = useTasks();

  // Cada vez que "currentTask" cambie, reinicializamos el formulario y actualizamos la fecha
  useEffect(() => {
    if (currentTask) {
      const taskDateValue = currentTask.task_date ? new Date(currentTask.task_date) : null;
      setTaskDate(taskDateValue);
      reset({
        company: currentTask.company || "",
        project: currentTask.project || "",
        task_type: currentTask.task_type || "",
        task_description: currentTask.task_description || "",
        entry_time: currentTask.entry_time
          ? formatTimeForInput(currentTask.entry_time)
          : "09:00",
        exit_time: currentTask.exit_time
          ? formatTimeForInput(currentTask.exit_time)
          : "18:00",
        lunch_hours: currentTask.lunch_hours?.toString() || "1",
        hour_type: currentTask.hour_type || "",
        status: currentTask.status?.toString() || "0",
      });
    }
  }, [currentTask, reset]);

  const handleSaveClick = (data) => {
    if (data.entry_time >= data.exit_time) {
      toast.error("La hora de entrada no puede ser mayor o igual a la de salida.");
      return;
    }

    const updateData = {
      ...data,
      lunch_hours: Number(data.lunch_hours),
      status: Number(data.status),
      hour_type: data.hour_type,
      task_date: taskDate ? formatDateForBackend(taskDate) : null,
    };

    updateTaskMutation.mutate(
      { taskId, task: updateData },
      {
        onSuccess: () => {
          toast.success("¡Tarea actualizada con éxito!");
          setIsEditing(false);
        },
        onError: () => toast.error("Ocurrió un error al actualizar la tarea."),
      }
    );
  };

  const handleDeleteClick = () => {
    deleteTaskMutation.mutate(taskId, {
      onSuccess: () => {
        toast.success("¡Tarea eliminada con éxito!");
        navigate(-1);
      },
      onError: () => toast.error("Ocurrió un error al eliminar la tarea."),
    });
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar la tarea. Inténtalo de nuevo más tarde.</p>;
  if (!currentTask) return <p>No se encontraron detalles de la tarea.</p>;

  return (
    // Contenedor principal con h-screen y overflow-hidden para fijar el layout
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      {/* Se añade lg:ml-72 para desplazar el contenido y evitar que quede por detrás de la sidebar */}
      <div className="w-full lg:ml-72 space-y-6 px-8 py-16 overflow-hidden">
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
            errors={errors}
            handleSubmit={handleSubmit(handleSaveClick)}
            isSubmitting={isSubmitting}
            taskDate={taskDate}
            setTaskDate={setTaskDate}
            task={currentTask}
            companies={companies_table}
            projects={projects_table}
            hourTypes={hour_type_table}
          />
        ) : (
          <ReadOnlyTaskDetails task={currentTask} />
        )}
      </div>
    </div>
  );
};

export default TaskDetailsPage;
