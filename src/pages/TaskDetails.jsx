// /src/pages/TaskDetails.jsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import Sidebar from "../components/Sidebar";
import TaskHeader from "../components/Tasks/TaskHeader";
import TaskForm from "../components/Tasks/TaskForm";
import { ReadOnlyTaskDetails } from "../components/Tasks/ReadOnlyTaskDetails";

import { useDeleteTask } from "../hooks/data/task/use-delete-task";
import { useGetTask } from "../hooks/data/task/use-get-task";
import { useUpdateTask } from "../hooks/data/task/use-update-task";

import { schema } from "../util/validationSchema";

// Hook para opciones (compañías, proyectos, tipos de hora)
import { useOptionsStore } from "../store/optionsStore";

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [taskDate, setTaskDate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const companies = useOptionsStore((state) => state.companies) || [];
  const hourTypes = useOptionsStore((state) => state.hourTypes) || [];
  const projects = useOptionsStore((state) => state.projects) || [];

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

  const formatTimeForInput = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.length > 5 ? timeStr.slice(0, 5) : timeStr;
  };

  const { mutate: updateTask } = useUpdateTask(taskId);
  const { mutate: deleteTask } = useDeleteTask(taskId);

  const { data: task, isLoading, isError } = useGetTask({
    taskId,
    onSuccess: (task) => {
      if (task) {
        const taskDateValue = task.task_date ? new Date(task.task_date) : null;
        setTaskDate(taskDateValue);

        reset({
          company: task.company || "",
          project: task.project || "",
          task_type: task.task_type || "",
          task_description: task.task_description || "",
          entry_time: task.entry_time ? formatTimeForInput(task.entry_time) : "09:00",
          exit_time: task.exit_time ? formatTimeForInput(task.exit_time) : "18:00",
          lunch_hours: task.lunch_hours?.toString() || "1",
          hour_type: task.hour_type || "",
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
      toast.error("La hora de entrada no puede ser mayor o igual a la de salida.");
      return;
    }

    const updateData = {
      ...data,
      lunch_hours: Number(data.lunch_hours),
      status: Number(data.status),
      hour_type: data.hour_type,
      task_date: taskDate ? taskDate.toISOString() : null,
    };

    updateTask(updateData, {
      onSuccess: () => {
        toast.success("¡Tarea guardada con éxito!");
        setIsEditing(false);
      },
      onError: () => toast.error("Ocurrió un error al guardar la tarea."),
    });
  };

  const handleDeleteClick = async () => {
    deleteTask(undefined, {
      onSuccess: () => {
        toast.success("¡Tarea eliminada con éxito!");
        navigate(-1);
      },
      onError: () => toast.error("Ocurrió un error al eliminar la tarea."),
    });
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar la tarea. Inténtalo de nuevo más tarde.</p>;
  if (!task) return <p>No se encontraron detalles de la tarea.</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full space-y-6 px-8 py-16">
        <TaskHeader
          task={task}
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
            task={task}
            companies={companies}
            projects={projects}
            hourTypes={hourTypes}
          />
        ) : (
          <ReadOnlyTaskDetails task={task} />
        )}
      </div>
    </div>
  );
};

export default TaskDetailsPage;
