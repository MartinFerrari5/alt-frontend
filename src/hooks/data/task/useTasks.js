// src/hooks/data/task/useTasks.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/axios";
import useTaskStore from "../../../store/taskStore";
import { taskQueryKeys } from "../../../keys/queries";
import { taskMutationKeys } from "../../../keys/mutations";

export const useTasks = () => {
  const queryClient = useQueryClient();
  const { tasks, addTask, deleteTask, updateTask, setTasks, filterTasks } = useTaskStore();

  // Consulta para obtener todas las tareas
  // Se llama a GET http://localhost:3000/reportes/tasks
  const getTasks = useQuery({
    queryKey: taskQueryKeys.getAll(),
    queryFn: async () => {
      const { data } = await api.get("/tasks");
      setTasks(data.tasks);
      return data.tasks;
    },
    enabled: true,
  });

  // Mutación para agregar una tarea (POST http://localhost:3000/reportes/tasks)
  const addTaskMutation = useMutation({
    mutationKey: taskMutationKeys.add(),
    mutationFn: async (task) => {
      const { data } = await api.post("/tasks", task);
      return data;
    },
    onSuccess: (createdTask) => {
      addTask(createdTask);
      queryClient.setQueryData(taskQueryKeys.getAll(), (oldTasks = []) => [
        ...oldTasks,
        createdTask,
      ]);
    },
  });

  // Mutación para actualizar una tarea:
  // Se realiza un PUT a http://localhost:3000/reportes/tasks con query parameter "task_id"
  const updateTaskMutation = useMutation({
    mutationKey: taskMutationKeys.update(),
    mutationFn: async ({ taskId, task }) => {
      const { data } = await api.put("/tasks", task, { params: { task_id: taskId } });
      return data;
    },
    onSuccess: (updatedTask, { taskId }) => {
      updateTask(taskId, updatedTask);
      queryClient.invalidateQueries(taskQueryKeys.getAll());
      queryClient.invalidateQueries(taskQueryKeys.getOne(taskId));
    },
  });

  // Mutación para eliminar una tarea:
  // Se realiza un DELETE a http://localhost:3000/reportes/tasks con query parameter "task_id"
  const deleteTaskMutation = useMutation({
    mutationKey: taskMutationKeys.delete(),
    mutationFn: async (taskId) => {
      await api.delete("/tasks", { params: { task_id: taskId } });
      return taskId;
    },
    onSuccess: (taskId) => {
      deleteTask(taskId);
      queryClient.setQueryData(taskQueryKeys.getAll(), (oldTasks) =>
        oldTasks ? oldTasks.filter((task) => task.id !== taskId) : []
      );
    },
  });

  return {
    tasks,
    getTasks,
    addTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    filterTasks, 
  };
};
