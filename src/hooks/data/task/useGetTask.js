// src/hooks/data/task/useGetTask.js
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/axios";
import useTaskStore from "../../../store/taskStore";
import { taskQueryKeys } from "../../../keys/queries";

export const useGetTask = (taskId) => {
  const { tasks } = useTaskStore();
  return useQuery({
    queryKey: taskQueryKeys.getOne(taskId),
    queryFn: async () => {
      const existingTask = tasks.find((task) => task.id === taskId);
      if (existingTask) return existingTask;
      const { data } = await api.get("/tasks/task", { params: { task_id: taskId } });
      return data;
    },
    enabled: !!taskId,
  });
};
