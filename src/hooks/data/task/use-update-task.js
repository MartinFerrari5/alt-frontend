// src/hooks/data/use-update-task.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskMutationKeys } from "../../../keys/mutations";
import { taskQueryKeys } from "../../../keys/queries";
import { api } from "../../../lib/axios";
import useTaskStore from "../../../store/taskStore";

export const useUpdateTask = (taskId) => {
  const queryClient = useQueryClient();
  const updateTask = useTaskStore((state) => state.updateTask);

  return useMutation({
    mutationKey: taskMutationKeys.update(taskId),
    mutationFn: async (data) => {
      console.log("Datos enviados al servidor:", data);
      // Construir payload con los nombres de campo correctos
      const payload = {
        company: data.company?.trim(),
        project: data.project?.trim(),
        task_type: data.task_type?.trim(),
        task_description: data.task_description?.trim(),
        task_date: data.task_date,
        entry_time: data.entry_time,
        exit_time: data.exit_time,
        lunch_hours: data.lunch_hours,
        hour_type: data.hour_type,
        status: data.status,
      };
      // Realizamos la petición PUT
      const { data: responseData } = await api.put(`/tasks/${taskId}`, payload);
      console.log("Respuesta del servidor:", responseData);
      // Como el backend retorna un mensaje de éxito, devolvemos el payload para actualizar el store
      return payload;
    },
    retry: 2,
    onSuccess: (updatedTask) => {
      // Actualizamos la tarea en el store de Zustand
      updateTask(taskId, updatedTask);
      // Actualizamos el caché de React Query para "getAll" y "getOne"
      queryClient.setQueryData(taskQueryKeys.getAll(), (oldTasks) => {
        return oldTasks
          ? oldTasks.map((task) =>
              task.id === taskId ? { ...task, ...updatedTask } : task
            )
          : [];
      });
      queryClient.setQueryData(taskQueryKeys.getOne(taskId), {
        ...updatedTask,
        id: taskId,
      });
    },
    onError: (error) => {
      console.error("🔴 Error al actualizar tarea:", error);
    },
  });
};
