// src/store/taskStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"

const useTaskStore = create(
    persist(
        (set) => ({
            tasks: [],

            // Agregar una tarea
            addTask: (newTask) =>
                set((state) => ({ tasks: [...state.tasks, newTask] })),

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
        }),
        { name: "task-storage", getStorage: () => localStorage }
    )
)

export default useTaskStore
