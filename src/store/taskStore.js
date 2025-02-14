// src/store/taskStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/axios";

// Función auxiliar para formatear la hora (opcional)
// const formatTime = (timeStr) => {
//   if (!timeStr) return timeStr;
//   return timeStr.length === 5 ? `${timeStr}:00` : timeStr;
// };


const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [],

      // Agregar una tarea
      addTask: (newTask) => set((state) => ({ tasks: [...state.tasks, newTask] })),

      // Actualizar una tarea
      updateTask: (taskId, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedTask } : task
          ),
        })),

      // Eliminar una tarea
      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),

      // Establecer el listado completo de tareas
      setTasks: (tasks) => set({ tasks }),

      // Filtrar tareas por nombre y fecha
      filterTasks: async (fullname, dateRange) => {
        try {
          const queryParams = new URLSearchParams();
          if (fullname) queryParams.append("fullname", fullname);
          if (dateRange) queryParams.append("date", dateRange);

          const { data } = await api.get(
            `/tasks/filtertasks?${queryParams.toString()}`
          );
          set({ tasks: data.tasks });
        } catch (error) {
          console.error("Error al filtrar tareas:", error);
        }
      },
    }),
    { name: "task-storage", getStorage: () => localStorage }
  )
);

export default useTaskStore;
