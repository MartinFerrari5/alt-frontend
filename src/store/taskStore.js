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

            // Actualizar una tarea (convertimos IDs a string para evitar discrepancias)
            updateTask: (taskId, updatedTask) =>
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id.toString() === taskId.toString()
                            ? { ...task, ...updatedTask }
                            : task
                    ),
                })),

            // Eliminar una tarea (comparando los IDs convertidos a string)
            deleteTask: (taskId) =>
                set((state) => ({
                    tasks: state.tasks.filter(
                        (task) => task.id.toString() !== taskId.toString()
                    ),
                })),

            // Establecer el listado completo de tareas
            setTasks: (tasks) => set({ tasks }),
        }),
        {
            name: "task-storage",
            getStorage: () => localStorage,
            partialize: (state) => ({ tasks: state.tasks }),
        }
    )
)

export default useTaskStore
