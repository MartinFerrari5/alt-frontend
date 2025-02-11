// src/store/taskStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/axios";


const useTaskStore = create(
    persist(
        (set) => ({
            tasks: [],

            // Agregar una tarea
            addTask: (newTask) => {
                set((state) => ({
                    tasks: [
                        ...state.tasks,
                        {
                            ...newTask,
                            task_date: newTask.task_date
                                ? new Date(newTask.task_date).toISOString()
                                : null,
                        },
                    ],
                }));
            },

            // Actualizar una tarea
            updateTask: (taskId, updatedTask) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === taskId
                            ? {
                                  ...task,
                                  ...updatedTask,
                                  task_date: updatedTask.task_date
                                      ? new Date(updatedTask.task_date).toISOString()
                                      : task.task_date,
                              }
                            : task
                    ),
                }));
            },

            // Eliminar una tarea
            deleteTask: (taskId) => {
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== taskId),
                }));
            },

            // Filtrar tareas por nombre y fecha
            filterTasks: async (fullname, dateRange) => {
                try {
                const queryParams = new URLSearchParams();
                if (fullname) queryParams.append("fullname", fullname);
                if (dateRange) queryParams.append("date", dateRange);

                const { data } = await api.get(`/tasks/filtertasks?${queryParams.toString()}`);
                set({ tasks: data.tasks });
                } catch (error) {
                console.error("Error al filtrar tareas:", error);
                }
            },

            // Establecer la lista completa de tareas (útil para cargar datos iniciales)
            setTasks: (tasks) => {
                set({
                    tasks: tasks.map((task) => ({
                        ...task,
                        task_date: task.task_date ? new Date(task.task_date).toISOString() : null,
                    })),
                });
            },
        }),
        {
            name: "task-storage",
            getStorage: () => localStorage,
        }
    )
);

export default useTaskStore;
